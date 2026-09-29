import React, { useState } from "react";
import { Link, router, useForm } from "@inertiajs/react";
import { ToastContainer } from "react-toastify";
import { useFlashMessage } from "@/hooks/useFlashMessage";
import { useModal } from "@/hooks/useModal";
import DeleteConfirmationModal from "@/Components/DeleteConfirmationModal";

const Categories = ({ categories }) => {
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState("");
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const { modalRef, show, hide } = useModal();
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
    });
    useFlashMessage();

    const add = (event) => {
        event.preventDefault();
        post(route("courses.categories.store"), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };
    const update = (category) => {
        router.put(
            route("courses.categories.update", category.id),
            { name: editingName },
            { preserveScroll: true, onSuccess: () => setEditingId(null) },
        );
    };
    const remove = (category) => {
        setCategoryToDelete(category);
        show();
    };
    const confirmDelete = () => {
        if (!categoryToDelete) return;
        setDeleting(true);
        router.delete(
            route("courses.categories.destroy", categoryToDelete.id),
            {
                preserveScroll: true,
                onFinish: () => {
                    setDeleting(false);
                    setCategoryToDelete(null);
                    hide();
                },
            },
        );
    };
    const cancelDelete = () => {
        setCategoryToDelete(null);
        hide();
    };

    return (
        <>
            <ToastContainer />
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h1 className="h4 mb-1">Course Categories</h1>
                    <p className="text-muted mb-0">
                        Manage the subjects available in course filters.
                    </p>
                </div>
                <Link
                    href={route("courses.index")}
                    className="btn btn-outline-secondary"
                >
                    Back to Courses
                </Link>
            </div>
            <div className="card mb-4">
                <div className="card-body">
                    <h2 className="h6">Add category</h2>
                    <form className="d-flex gap-2" onSubmit={add}>
                        <input
                            className={`form-control ${errors.name ? "is-invalid" : ""}`}
                            value={data.name}
                            onChange={(event) =>
                                setData("name", event.target.value)
                            }
                            placeholder="e.g. Web Development"
                            required
                        />
                        <button
                            className="btn btn-primary"
                            disabled={processing}
                        >
                            Add
                        </button>
                    </form>
                    {errors.name && (
                        <div className="text-danger small mt-1">
                            {errors.name}
                        </div>
                    )}
                </div>
            </div>
            <div className="card">
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Courses</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length ? (
                                categories.map((category) => (
                                    <tr key={category.id}>
                                        <td>
                                            {editingId === category.id ? (
                                                <input
                                                    className="form-control"
                                                    value={editingName}
                                                    onChange={(event) =>
                                                        setEditingName(
                                                            event.target.value,
                                                        )
                                                    }
                                                />
                                            ) : (
                                                category.name
                                            )}
                                        </td>

                                        <td>{category.courses_count}</td>

                                        <td className="text-end">
                                            {editingId === category.id ? (
                                                <>
                                                    <button
                                                        className="btn btn-sm btn-primary me-2"
                                                        onClick={() =>
                                                            update(category)
                                                        }
                                                    >
                                                        Save
                                                    </button>

                                                    <button
                                                        className="btn btn-sm btn-outline-secondary"
                                                        onClick={() =>
                                                            setEditingId(null)
                                                        }
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="btn btn-sm btn-outline-primary me-2"
                                                        onClick={() => {
                                                            setEditingId(
                                                                category.id,
                                                            );
                                                            setEditingName(
                                                                category.name,
                                                            );
                                                        }}
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() =>
                                                            remove(category)
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="3"
                                        className="text-center text-muted py-4"
                                    >
                                        No categories yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <DeleteConfirmationModal
                modalRef={modalRef}
                title="Delete category?"
                message="Are you sure you want to delete this category? Courses in it will remain but become uncategorized."
                itemName={categoryToDelete?.name}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
                processing={deleting}
            />
        </>
    );
};

export default Categories;
