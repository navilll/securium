<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained('course_categories')->nullOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('image')->nullable();
            $table->string('university')->nullable();
            $table->string('instructor')->nullable();
            $table->string('instructor_image')->nullable();
            $table->text('instructor_bio')->nullable();
            $table->string('duration')->nullable();
            $table->unsignedInteger('students_count')->default(0);
            $table->unsignedInteger('lessons_count')->default(0);
            $table->string('skill_level')->default('Beginner');
            $table->string('language')->default('English');
            $table->decimal('price', 10, 2)->default(0);
            $table->decimal('original_price', 10, 2)->nullable();
            $table->unsignedTinyInteger('pass_percentage')->nullable();
            $table->date('deadline')->nullable();
            $table->text('short_description')->nullable();
            $table->longText('overview')->nullable();
            $table->json('curriculum')->nullable();
            $table->json('learning_outcomes')->nullable();
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
