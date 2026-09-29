<?php

namespace App\Http\Controllers;

use App\Models\CourseCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CourseCategoryController extends Controller
{
    public function index()
    {
        return Inertia::render('Courses/Categories', [
            'categories' => CourseCategory::withCount('courses')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate(['name' => 'required|string|max:255|unique:course_categories,name']);
        CourseCategory::create(['name' => $validated['name'], 'slug' => $this->uniqueSlug($validated['name'])]);

        return back()->with('success', 'Course category created successfully.');
    }

    public function update(Request $request, CourseCategory $courseCategory)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:course_categories,name,' . $courseCategory->id,
        ]);
        $courseCategory->update([
            'name' => $validated['name'],
            'slug' => $this->uniqueSlug($validated['name'], $courseCategory->id),
        ]);

        return back()->with('success', 'Course category updated successfully.');
    }

    public function destroy(CourseCategory $courseCategory)
    {
        $courseCategory->delete();

        return back()->with('success', 'Course category deleted successfully. Courses in this category will remain uncategorized.');
    }

    private function uniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name) ?: 'category';
        $slug = $base;
        $suffix = 2;
        while (CourseCategory::where('slug', $slug)->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))->exists()) {
            $slug = $base . '-' . $suffix++;
        }

        return $slug;
    }
}
