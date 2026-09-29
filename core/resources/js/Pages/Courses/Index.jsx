import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { ToastContainer } from 'react-toastify';
import { useFlashMessage } from '@/hooks/useFlashMessage';
import { useModal } from '@/hooks/useModal';
import DeleteConfirmationModal from '@/Components/DeleteConfirmationModal';
import TableHeader from '@/Components/TableHeader';
import Pagination from '@/Components/Pagination';

const Index = ({ courses, searchTerm }) => {
    const [query, setQuery] = useState(searchTerm || '');
    const { appUrl } = usePage().props;
    const [courseToDelete, setCourseToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const { modalRef, show, hide } = useModal();

    useFlashMessage();

    const remove = (course) => {
        setCourseToDelete(course);
        show();
    };

    const confirmDelete = () => {
        if (!courseToDelete) {
            return;
        }

        setDeleting(true);

        router.delete(
            route('courses.destroy', courseToDelete.id),
            {
                preserveScroll: true,
                onFinish: () => {
                    setDeleting(false);
                    setCourseToDelete(null);
                    hide();
                },
            }
        );
    };

    const cancelDelete = () => {
        setCourseToDelete(null);
        hide();
    };

    return (
        <>
            <ToastContainer />

            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                <div>
                    <h1 className="h4 mb-1">
                        Courses
                    </h1>

                    <p className="text-muted mb-0">
                        Manage catalog courses, pricing, and curriculum.
                    </p>
                </div>

                <div className="d-flex gap-2">
                    <Link
                        href={route('courses.categories.index')}
                        className="btn btn-outline-secondary"
                    >
                        Manage Categories
                    </Link>

                    <Link
                        href={route('courses.create')}
                        className="btn btn-primary"
                    >
                        Add Course
                    </Link>
                </div>
            </div>

            <div className="card">
                <TableHeader
                    searchValue={query}
                    onSearchChange={(value) => {
                        setQuery(value);

                        router.get(
                            route('courses.index'),
                            { search: value },
                            {
                                preserveState: true,
                                replace: true,
                            }
                        );
                    }}
                    searchPlaceholder="Search courses..."
                    showAddButton={false}
                    searchColClass="col-md-8 col-12"
                    filterColClass=""
                    buttonColClass="d-none"
                />

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead>
                            <tr>
                                <th>Course</th>
                                <th>Subject</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th className="text-end">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {courses.data.length ? (
                                courses.data.map((course) => (
                                    <tr key={course.id}>
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <img
                                                    src={
                                                        course.image
                                                            ? `${appUrl}/${course.image}`
                                                            : 'https://placehold.co/100x70?text=Course'
                                                    }
                                                    alt=""
                                                    style={{
                                                        width: 92,
                                                        height: 62,
                                                        objectFit: 'cover',
                                                        borderRadius: 8,
                                                    }}
                                                />

                                                <div>
                                                    <strong>
                                                        {course.title}
                                                    </strong>

                                                    <div className="small text-muted">
                                                        {course.university ||
                                                            'No provider'}{' '}
                                                        ·{' '}
                                                        {course.instructor ||
                                                            'No instructor'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            {course.category?.name || '—'}
                                        </td>

                                        <td>
                                            $
                                            {Number(
                                                course.price
                                            ).toFixed(2)}
                                        </td>

                                        <td>
                                            <span
                                                className={`badge ${
                                                    course.is_published
                                                        ? 'bg-label-success'
                                                        : 'bg-label-secondary'
                                                }`}
                                            >
                                                {course.is_published
                                                    ? 'Published'
                                                    : 'Draft'}
                                            </span>
                                        </td>

                                        <td className="text-end">
                                            <Link
                                                href={route(
                                                    'courses.edit',
                                                    course.id
                                                )}
                                                className="btn btn-sm btn-outline-primary me-2"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() =>
                                                    remove(course)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center text-muted py-5"
                                    >
                                        No courses found. Add your first
                                        course to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {courses.links.length > 3 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="text-muted small">
                        Showing {courses.from ?? 0}–{courses.to ?? 0} of{' '}
                        {courses.total}
                    </span>

                    <Pagination
                        links={courses.links}
                        query={query}
                    />
                </div>
            )}

            <DeleteConfirmationModal
                modalRef={modalRef}
                title="Delete course?"
                message="Are you sure you want to delete this course? This action cannot be undone."
                itemName={courseToDelete?.title}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
                processing={deleting}
            />
        </>
    );
};

export default Index;