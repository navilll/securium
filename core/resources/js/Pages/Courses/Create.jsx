import React from 'react';
import { useForm } from '@inertiajs/react';
import FormLayout from '@/Components/FormLayout';
import FormActions from '@/Components/FormActions';
import CourseForm from './partials/CourseForm';

const Create = ({ categories }) => {
    const { data, setData, post, errors, processing } = useForm({
        title: '', slug: '', category_id: '', image: null, university: '', instructor: '', duration: '',
        students_count: 0, lessons_count: 0, skill_level: 'Beginner', language: 'English', price: '0',
        original_price: '', pass_percentage: '', deadline: '', short_description: '', overview_blocks: [],
        curriculum: [], instructor_details: [], is_published: true,
    });

    const submit = (event) => {
        event.preventDefault();
        post(route('courses.store'), { preserveScroll: true, forceFormData: true });
    };

    return (
        <FormLayout 
            title="Create Course" 
            subtitle="Add a course to the catalog" 
            onSubmit={submit} 
            processing={processing}
        >
            <CourseForm 
                data={data} 
                setData={setData} 
                errors={errors} 
                processing={processing} 
                categories={categories}
            >
                <FormActions 
                    processing={processing} 
                    submitText="Create Course" 
                    cancelText="Cancel" 
                    submitButtonProps={{ variant: 'primary' }} 
                />
            </CourseForm>
        </FormLayout>
    );
};

export default Create;
