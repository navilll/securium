<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->string('search')->toString();
        $courses = Course::with('category')
            ->filter(['search' => $search])
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Courses/Index', [
            'courses' => $courses,
            'searchTerm' => $search,
        ]);
    }

    public function create()
    {
        return Inertia::render('Courses/Create', ['categories' => CourseCategory::orderBy('name')->get(['id', 'name'])]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateCourse($request);
        $validated['slug'] = $this->uniqueSlug($validated['slug'] ?: $validated['title']);
        foreach (['overview_blocks', 'curriculum', 'instructor_details'] as $section) {
            $validated[$section] = $this->normalizeBlocks($validated[$section] ?? []);
        }
        $validated['image'] = $request->hasFile('image') ? $this->storeImage($request->file('image')) : null;
        $validated['instructor_image'] = $request->hasFile('instructor_image') ? $this->storeImage($request->file('instructor_image')) : null;
        $validated['is_published'] = $request->boolean('is_published');

        Course::create($validated);

        return redirect()->route('courses.index')->with('success', 'Course created successfully.');
    }

    public function edit(Course $course)
    {
        return Inertia::render('Courses/Edit', [
            'course' => $course,
            'categories' => CourseCategory::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Course $course)
    {
        $validated = $this->validateCourse($request, $course);
        $validated['slug'] = $this->uniqueSlug($validated['slug'] ?: $validated['title'], $course->id);
        foreach (['overview_blocks', 'curriculum', 'instructor_details'] as $section) {
            $validated[$section] = $this->normalizeBlocks($validated[$section] ?? []);
        }
        if ($request->hasFile('image')) {
            $this->deleteImage($course->image);
            $validated['image'] = $this->storeImage($request->file('image'));
        } else {
            unset($validated['image']);
        }
        if ($request->hasFile('instructor_image')) {
            $this->deleteImage($course->instructor_image);
            $validated['instructor_image'] = $this->storeImage($request->file('instructor_image'));
        } else {
            unset($validated['instructor_image']);
        }
        $validated['is_published'] = $request->boolean('is_published');

        $course->update($validated);

        return redirect()->route('courses.index')->with('success', 'Course updated successfully.');
    }

    public function destroy(Course $course)
    {
        $this->deleteImage($course->image);
        $this->deleteImage($course->instructor_image);
        $course->delete();

        return redirect()->route('courses.index')->with('success', 'Course deleted successfully.');
    }

    private function validateCourse(Request $request, ?Course $course = null): array
    {
        return $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:courses,slug,' . ($course?->id ?? 'NULL'),
            'category_id' => 'required|exists:course_categories,id',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'instructor_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'university' => 'nullable|string|max:255',
            'instructor' => 'nullable|string|max:255',
            'instructor_bio' => 'nullable|string|max:2000',
            'duration' => 'nullable|string|max:100',
            'students_count' => 'required|integer|min:0',
            'lessons_count' => 'nullable|integer|min:0',
            'skill_level' => 'required|string|max:100',
            'language' => 'required|string|max:100',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0|gte:price',
            'pass_percentage' => 'nullable|integer|min:0|max:100',
            'deadline' => 'nullable|date',
            'short_description' => 'nullable|string|max:1000',
            'overview_blocks' => 'nullable|array',
            'curriculum' => 'nullable|array',
            'instructor_details' => 'nullable|array',
            'is_published' => 'nullable|boolean',
        ] + $this->sectionRules());
    }

    private function sectionRules(): array
    {
        $rules = [];
        foreach (['overview_blocks', 'curriculum', 'instructor_details'] as $section) {
            $rules["{$section}.*.type"] = 'required|in:heading,paragraph,list';
            $rules["{$section}.*.content"] = 'nullable|string|max:10000';
            $rules["{$section}.*.items"] = 'nullable|array';
            $rules["{$section}.*.items.*"] = 'nullable|string|max:2000';
        }

        return $rules;
    }

    private function normalizeBlocks($blocks): array
    {
        if (! is_array($blocks)) {
            return [];
        }

        return array_values(array_filter(array_map(function ($block) {
            if (is_string($block)) {
                $block = ['type' => 'paragraph', 'content' => $block];
            }
            if (! is_array($block) || ! in_array($block['type'] ?? null, ['heading', 'paragraph', 'list'], true)) {
                return null;
            }

            if ($block['type'] === 'list') {
                $items = array_values(array_filter(array_map('trim', $block['items'] ?? [])));
                return $items ? ['type' => 'list', 'items' => $items] : null;
            }

            $content = trim((string) ($block['content'] ?? ''));
            return $content !== '' ? ['type' => $block['type'], 'content' => $content] : null;
        }, $blocks)));
    }

    private function uniqueSlug(string $value, ?int $ignoreId = null): string
    {
        $base = Str::slug($value) ?: 'course';
        $slug = $base;
        $suffix = 2;

        while (Course::where('slug', $slug)->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))->exists()) {
            $slug = $base . '-' . $suffix++;
        }

        return $slug;
    }

    private function storeImage($image): string
    {
        $directory = public_path('uploads/courses');
        File::ensureDirectoryExists($directory);
        $name = Str::uuid() . '.' . $image->extension();
        $image->move($directory, $name);

        return 'uploads/courses/' . $name;
    }

    private function deleteImage(?string $path): void
    {
        if ($path && File::exists(public_path($path))) {
            File::delete(public_path($path));
        }
    }
}
