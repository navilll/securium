import React from 'react';
import { useForm } from '@inertiajs/react';
import FormLayout from '@/Components/FormLayout';
import FormActions from '@/Components/FormActions';
import CourseForm from './partials/CourseForm';

const legacyBlocks = (value) => {
    if (Array.isArray(value)) {
        return value.map((block) => typeof block === 'string' ? { type: 'paragraph', content: block } : block);
    }
    return value ? [{ type: 'paragraph', content: value }] : [];
};

const Edit = ({ course, categories }) => {
    const { data, setData, post, transform, errors, processing } = useForm({
        title: course.title ?? '',
        slug: course.slug ?? '',
        category_id: course.category_id ?? '',
        image: null,
        university: course.university ?? '',
        instructor: course.instructor ?? '',
        duration: course.duration ?? '',
        students_count: course.students_count ?? 0,
        lessons_count: course.lessons_count ?? 0,
        skill_level: course.skill_level ?? 'Beginner',
        language: course.language ?? 'English',
        price: course.price ?? '0',
        original_price: course.original_price ?? '',
        pass_percentage: course.pass_percentage ?? '',
        deadline: course.deadline ?? '',
        short_description: course.short_description ?? '',
        overview_blocks: legacyBlocks(course.overview_blocks?.length ? course.overview_blocks : course.overview),
        curriculum: legacyBlocks(course.curriculum),
        instructor_details: legacyBlocks(course.instructor_details),
        is_published: Boolean(course.is_published),
    });

    const submit = (event) => {
        event.preventDefault();
        transform((formData) => ({ ...formData, _method: 'put' }));
        post(route('courses.update', course.id), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <FormLayout 
            title="Edit Course" 
            subtitle={`Update ${course.title}`} 
            onSubmit={submit} processing={processing}
        >
            <CourseForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                categories={categories}
                existingImage={course.image}
            >
                <FormActions 
                    processing={processing} 
                    submitText="Update Course" 
                    cancelText="Cancel" 
                    submitButtonProps={{ variant: 'primary' }} 
                />
            </CourseForm>
        </FormLayout>
    );
};

export default Edit;
