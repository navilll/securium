<?php

use App\Models\Course;
use App\Models\CourseCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('course api lists published courses and filters by search and category', function () {
    $category = CourseCategory::create(['name' => 'Development', 'slug' => 'development']);
    Course::create([
        'category_id' => $category->id,
        'title' => 'JavaScript from Zero',
        'slug' => 'javascript-from-zero',
        'price' => 86,
        'is_published' => true,
    ]);
    Course::create([
        'title' => 'Hidden course',
        'slug' => 'hidden-course',
        'price' => 0,
        'is_published' => false,
    ]);

    $this->getJson('/api/courses?search=JavaScript&category=development')
        ->assertOk()
        ->assertJsonPath('courses.total', 1)
        ->assertJsonPath('courses.data.0.slug', 'javascript-from-zero')
        ->assertJsonPath('courses.data.0.category.name', 'Development');
});

test('course api returns full detail by slug', function () {
    Course::create([
        'title' => 'Graphic Design',
        'slug' => 'graphic-design',
        'price' => 25,
        'overview' => 'Learn design fundamentals.',
        'overview_blocks' => [['type' => 'heading', 'content' => 'Design fundamentals']],
        'curriculum' => [['type' => 'heading', 'content' => 'Typography'], ['type' => 'list', 'items' => ['Type anatomy', 'Pairing fonts']]],
        'instructor_details' => [['type' => 'paragraph', 'content' => 'Instructor profile details']],
        'is_published' => true,
    ]);

    $this->getJson('/api/courses/graphic-design')
        ->assertOk()
        ->assertJsonPath('course.overview', 'Learn design fundamentals.')
        ->assertJsonPath('course.overview_blocks.0.content', 'Design fundamentals')
        ->assertJsonPath('course.curriculum.0.content', 'Typography')
        ->assertJsonPath('course.instructor_details.0.content', 'Instructor profile details');
});
