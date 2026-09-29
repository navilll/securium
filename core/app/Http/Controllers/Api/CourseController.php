<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseCategory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->validate([
            'search' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'subject' => 'nullable|string|max:255',
            'level' => 'nullable|string|max:100',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:50',
        ]);
        $categoryFilter = $filters['category'] ?? $filters['subject'] ?? null;

        $courses = Course::with('category')
            ->where('is_published', true)
            ->when($filters['search'] ?? null, function (Builder $query, string $search) {
                $query->where(function (Builder $query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('university', 'like', "%{$search}%")
                        ->orWhere('instructor', 'like', "%{$search}%")
                        ->orWhere('short_description', 'like', "%{$search}%");
                });
            })
            ->when($categoryFilter, function (Builder $query, string $category) {
                $query->whereHas('category', function (Builder $categoryQuery) use ($category) {
                    if (ctype_digit($category)) {
                        $categoryQuery->whereKey((int) $category);
                    } else {
                        $categoryQuery->where('slug', $category)->orWhere('name', $category);
                    }
                });
            })
            ->when($filters['level'] ?? null, fn (Builder $query, string $level) => $query->where('skill_level', $level))
            ->latest()
            ->paginate($filters['per_page'] ?? 12)
            ->withQueryString()
            ->through(fn (Course $course) => $this->courseData($course));

        return response()->json([
            'status' => 'success',
            'courses' => $courses,
            'categories' => CourseCategory::orderBy('name')->get(['id', 'name', 'slug']),
            'filters' => [
                'search' => $filters['search'] ?? null,
                'category' => $categoryFilter,
                'level' => $filters['level'] ?? null,
            ],
        ]);
    }

    public function show(string $slug)
    {
        $course = Course::with('category')->where('slug', $slug)->where('is_published', true)->first();
        if (! $course) {
            return response()->json(['status' => 'error', 'message' => 'Course not found.'], 404);
        }

        return response()->json([
            'status' => 'success',
            'course' => $this->courseData($course, true),
        ]);
    }

    public function categories()
    {
        return response()->json([
            'status' => 'success',
            'categories' => CourseCategory::withCount(['courses' => fn (Builder $query) => $query->where('is_published', true)])
                ->orderBy('name')->get(['id', 'name', 'slug']),
        ]);
    }

    private function courseData(Course $course, bool $detail = false): array
    {
        $data = [
            'id' => $course->id,
            'title' => $course->title,
            'slug' => $course->slug,
            'image' => $course->image ? asset($course->image) : null,
            'university' => $course->university,
            'instructor' => $course->instructor,
            'category' => $course->category ? [
                'id' => $course->category->id,
                'name' => $course->category->name,
                'slug' => $course->category->slug,
            ] : null,
            'duration' => $course->duration,
            'students_count' => $course->students_count,
            'lessons_count' => $course->lessons_count,
            'skill_level' => $course->skill_level,
            'language' => $course->language,
            'price' => $course->price,
            'original_price' => $course->original_price,
            'short_description' => $course->short_description,
        ];

        if ($detail) {
            $data += [
                'pass_percentage' => $course->pass_percentage,
                'deadline' => $course->getRawOriginal('deadline'),
                'overview' => $course->overview,
                'overview_blocks' => $course->overview_blocks ?: ($course->overview ? [['type' => 'paragraph', 'content' => $course->overview]] : []),
                'curriculum' => $this->normalizeLegacyBlocks($course->curriculum ?? []),
                'instructor_details' => $this->normalizeLegacyBlocks($course->instructor_details ?? []),
            ];
        }

        return $data;
    }

    private function normalizeLegacyBlocks(array $blocks): array
    {
        return array_values(array_map(function ($block) {
            return is_string($block) ? ['type' => 'paragraph', 'content' => $block] : $block;
        }, $blocks));
    }
}
