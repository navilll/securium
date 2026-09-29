<?php

namespace App\Http\Controllers;

use App\Models\ContactForm;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_courses' => Course::count(),
            'published_courses' => Course::where('is_published', true)->count(),
            'draft_courses' => Course::where('is_published', false)->count(),
            'total_course_students' => Course::sum('students_count'),
            'total_course_lessons' => Course::sum('lessons_count'),
            'total_users' => User::count(),
            'total_enquiries' => ContactForm::count(),
        ];

        $weeklyEnquiries = collect(range(6, 0))->map(function (int $daysAgo) {
            $date = now()->subDays($daysAgo);

            return [
                'label' => $date->format('D'),
                'date' => $date->format('M j'),
                'count' => ContactForm::whereDate('created_at', $date->toDateString())->count(),
            ];
        });

        $courseCategories = CourseCategory::withCount('courses')
            ->orderByDesc('courses_count')
            ->limit(5)
            ->get()
            ->map(fn (CourseCategory $category) => [
                'name' => $category->name,
                'count' => $category->courses_count,
            ]);

        $recentCourses = Course::with('category')
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (Course $course) => [
                'id' => $course->id,
                'title' => $course->title,
                'category' => $course->category?->name ?? 'Uncategorized',
                'price' => $course->price,
                'is_published' => $course->is_published,
            ]);

        $recentEnquiries = ContactForm::latest()
            ->limit(4)
            ->get()
            ->map(fn (ContactForm $enquiry) => [
                'id' => $enquiry->id,
                'name' => $enquiry->name,
                'email' => $enquiry->email,
                'phone' => $enquiry->phone,
                'course' => $enquiry->course,
                'created_at' => $enquiry->created_at->diffForHumans(),
                'description' => $enquiry->description ? str($enquiry->description)->limit(80)->toString() : null,
            ]);

        return Inertia::render('Dashboard/CourseDashboard', [
            'stats' => $stats,
            'recentCourses' => $recentCourses,
            'recentEnquiries' => $recentEnquiries,
            'weeklyEnquiries' => $weeklyEnquiries,
            'courseCategories' => $courseCategories,
        ]);
    }
}