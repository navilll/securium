<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Course extends Model
{
    protected $fillable = [
        'category_id', 'title', 'slug', 'image', 'university', 'instructor', 'instructor_image', 'instructor_bio',
        'duration', 'students_count', 'lessons_count', 'skill_level', 'language', 'price',
        'original_price', 'pass_percentage', 'deadline', 'short_description', 'overview',
        'overview_blocks', 'curriculum', 'instructor_details', 'learning_outcomes', 'is_published',
    ];

    protected function casts(): array
    {
        return [
            'curriculum' => 'array',
            'overview_blocks' => 'array',
            'instructor_details' => 'array',
            'learning_outcomes' => 'array',
            'price' => 'decimal:2',
            'original_price' => 'decimal:2',
            'deadline' => 'date:Y-m-d',
            'is_published' => 'boolean',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(CourseCategory::class, 'category_id');
    }

    public function scopeFilter(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['search'] ?? null, function (Builder $query, string $search) {
                $query->where(function (Builder $query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('university', 'like', "%{$search}%")
                        ->orWhere('instructor', 'like', "%{$search}%");
                });
            })
            ->when($filters['category'] ?? $filters['subject'] ?? null, function (Builder $query, $category) {
                $query->where('category_id', $category);
            })
            ->when($filters['level'] ?? null, fn (Builder $query, string $level) => $query->where('skill_level', $level));
    }
}
