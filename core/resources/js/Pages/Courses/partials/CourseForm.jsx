import { useState } from "react";
import { usePage } from "@inertiajs/react";
import { useModal } from "@/hooks/useModal";
import DeleteConfirmationModal from "@/Components/DeleteConfirmationModal";
import "../../../../css/course-form.css";

const sectionTabs = [
    { key: "overview_blocks", label: "Overview" },
    { key: "curriculum", label: "Curriculum" },
    { key: "instructor_details", label: "Instructor" },
];

const CourseForm = ({
    data,
    setData,
    errors = {},
    processing,
    categories = [],
    existingImage = null,
    children,
}) => {
    const { appUrl } = usePage().props;

    const [activeTab, setActiveTab] = useState("overview_blocks");
    const [pendingDelete, setPendingDelete] = useState(null);

    const { modalRef, show, hide } = useModal();

    const assetUrl = (path) =>
        `${(appUrl || "").replace(/\/$/, "")}/${String(path || "").replace(
            /^\//,
            "",
        )}`;

    const blocksFor = (field) =>
        Array.isArray(data[field]) ? data[field] : [];

    const updateBlock = (field, blockIndex, changes) => {
        const blocks = [...blocksFor(field)];

        blocks[blockIndex] = {
            ...blocks[blockIndex],
            ...changes,
        };

        setData(field, blocks);
    };

    const addBlock = (field, type) => {
        const block =
            type === "list"
                ? {
                      type,
                      items: [""],
                  }
                : {
                      type,
                      content: "",
                  };

        setData(field, [...blocksFor(field), block]);
    };

    const addListItem = (field, blockIndex) => {
        const block = blocksFor(field)[blockIndex];

        updateBlock(field, blockIndex, {
            items: [...(block.items || []), ""],
        });
    };

    const updateListItem = (field, blockIndex, itemIndex, value) => {
        const block = blocksFor(field)[blockIndex];
        const items = [...(block.items || [])];

        items[itemIndex] = value;

        updateBlock(field, blockIndex, {
            items,
        });
    };

    const askDelete = (field, blockIndex, itemIndex = null) => {
        setPendingDelete({
            field,
            blockIndex,
            itemIndex,
        });

        show();
    };

    const confirmDelete = () => {
        if (!pendingDelete) {
            return;
        }

        const { field, blockIndex, itemIndex } = pendingDelete;

        const blocks = [...blocksFor(field)];

        if (itemIndex === null) {
            blocks.splice(blockIndex, 1);
        } else {
            const items = [...(blocks[blockIndex].items || [])];

            items.splice(itemIndex, 1);

            blocks[blockIndex] = {
                ...blocks[blockIndex],
                items,
            };
        }

        setData(field, blocks);

        hide();
        setPendingDelete(null);
    };

    const cancelDelete = () => {
        setPendingDelete(null);
        hide();
    };

    const field = (
        name,
        label,
        type = "text",
        extra = {},
        col = "col-md-6",
    ) => (
        <div className={`${col} mb-3`} key={name}>
            <label className="form-label" htmlFor={name}>
                {label}
            </label>

            <input
                id={name}
                type={type}
                className={`form-control ${errors[name] ? "is-invalid" : ""}`}
                value={data[name] ?? ""}
                onChange={(event) => setData(name, event.target.value)}
                disabled={processing}
                {...extra}
            />

            {errors[name] && (
                <div className="invalid-feedback">{errors[name]}</div>
            )}
        </div>
    );

    const addBlockButtons = (fieldName) => (
        <div className="d-flex flex-wrap gap-2 border-top pt-3 mt-4">
            <button
                type="button"
                className="btn btn-outline-primary"
                disabled={processing}
                onClick={() => addBlock(fieldName, "heading")}
            >
                + Add Heading
            </button>

            <button
                type="button"
                className="btn btn-outline-primary"
                disabled={processing}
                onClick={() => addBlock(fieldName, "paragraph")}
            >
                + Add Paragraph
            </button>

            <button
                type="button"
                className="btn btn-outline-primary"
                disabled={processing}
                onClick={() => addBlock(fieldName, "list")}
            >
                + Add List
            </button>
        </div>
    );

    const blockEditor = (fieldName) => {
        const blocks = blocksFor(fieldName);

        return (
            <>
                {blocks.length === 0 && (
                    <div className="alert alert-light border mb-0">
                        No content blocks yet. Use the buttons below to add a
                        heading, paragraph, or bullet list.
                    </div>
                )}

                {blocks.map((block, blockIndex) => (
                    <div
                        className="card border mb-3"
                        key={`${fieldName}-${blockIndex}`}
                    >
                        <div className="card-header d-flex justify-content-between align-items-center py-2">
                            <strong className="text-capitalize">
                                {block.type === "list"
                                    ? "Bullet list"
                                    : block.type}
                            </strong>

                            <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                disabled={processing}
                                onClick={() => askDelete(fieldName, blockIndex)}
                            >
                                Delete block
                            </button>
                        </div>

                        <div className="card-body">
                            {block.type === "heading" && (
                                <>
                                    <label className="form-label">
                                        Heading
                                    </label>

                                    <input
                                        className={`form-control ${
                                            errors[
                                                `${fieldName}.${blockIndex}.content`
                                            ]
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        value={block.content || ""}
                                        onChange={(event) =>
                                            updateBlock(fieldName, blockIndex, {
                                                content: event.target.value,
                                            })
                                        }
                                        placeholder="Enter heading"
                                        disabled={processing}
                                    />

                                    {errors[
                                        `${fieldName}.${blockIndex}.content`
                                    ] && (
                                        <div className="invalid-feedback">
                                            {
                                                errors[
                                                    `${fieldName}.${blockIndex}.content`
                                                ]
                                            }
                                        </div>
                                    )}
                                </>
                            )}

                            {block.type === "paragraph" && (
                                <>
                                    <label className="form-label">
                                        Paragraph
                                    </label>

                                    <textarea
                                        rows="4"
                                        className={`form-control ${
                                            errors[
                                                `${fieldName}.${blockIndex}.content`
                                            ]
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        value={block.content || ""}
                                        onChange={(event) =>
                                            updateBlock(fieldName, blockIndex, {
                                                content: event.target.value,
                                            })
                                        }
                                        placeholder="Write paragraph content"
                                        disabled={processing}
                                    />

                                    {errors[
                                        `${fieldName}.${blockIndex}.content`
                                    ] && (
                                        <div className="invalid-feedback">
                                            {
                                                errors[
                                                    `${fieldName}.${blockIndex}.content`
                                                ]
                                            }
                                        </div>
                                    )}
                                </>
                            )}

                            {block.type === "list" && (
                                <>
                                    <label className="form-label">
                                        List bullets
                                    </label>

                                    {(block.items || []).map(
                                        (item, itemIndex) => (
                                            <div
                                                className="input-group mb-2"
                                                key={`${blockIndex}-item-${itemIndex}`}
                                            >
                                                <span className="input-group-text">
                                                    •
                                                </span>

                                                <input
                                                    className="form-control"
                                                    value={item}
                                                    onChange={(event) =>
                                                        updateListItem(
                                                            fieldName,
                                                            blockIndex,
                                                            itemIndex,
                                                            event.target.value,
                                                        )
                                                    }
                                                    placeholder={`List item ${
                                                        itemIndex + 1
                                                    }`}
                                                    disabled={processing}
                                                />

                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger"
                                                    disabled={processing}
                                                    aria-label="Delete list item"
                                                    onClick={() =>
                                                        askDelete(
                                                            fieldName,
                                                            blockIndex,
                                                            itemIndex,
                                                        )
                                                    }
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ),
                                    )}

                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary mt-1"
                                        disabled={processing}
                                        onClick={() =>
                                            addListItem(fieldName, blockIndex)
                                        }
                                    >
                                        + Add bullet
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}

                {addBlockButtons(fieldName)}
            </>
        );
    };

    return (
        <>
            <>
                <h5 className="mb-3">Course Information</h5>

                <div className="row">
                    {field("title", "Course name *", "text", {
                    })}

                    {field("slug", "URL slug (optional)")}

                    <div className="col-md-6 mb-3">
                        <label className="form-label" htmlFor="category_id">
                            Subject / category
                        </label>

                        <select
                            id="category_id"
                            className="form-select"
                            value={data.category_id ?? ""}
                            onChange={(event) =>
                                setData("category_id", event.target.value)
                            }
                            disabled={processing}
                        >
                            <option value="">Select subject</option>

                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>

                        {errors.category_id && (
                            <div className="text-danger small mt-1">
                                {errors.category_id}
                            </div>
                        )}

                        <a
                            className="small"
                            href={route("courses.categories.index")}
                        >
                            Manage categories
                        </a>
                    </div>

                    {field("university", "University / provider")}

                    {field("instructor", "Instructor name")}

                    {field("skill_level", "Skill level", "text")}

                    {field(
                        "duration",
                        "Duration (e.g. 15 Weeks)",
                        "text",
                        {},
                        "col-md-3",
                    )}

                    {field(
                        "students_count",
                        "Students",
                        "number",
                        { min: 0 },
                        "col-md-3",
                    )}

                    {field(
                        "lessons_count",
                        "Lessons",
                        "number",
                        { min: 0 },
                        "col-md-3",
                    )}

                    {field(
                        "language",
                        "Language",
                        "text",
                        { required: true },
                        "col-md-3",
                    )}

                    {field(
                        "price",
                        "Current price",
                        "number",
                        {
                            min: 0,
                            step: "0.01",
                            required: true,
                        },
                        "col-md-3",
                    )}

                    {field(
                        "original_price",
                        "Original price",
                        "number",
                        {
                            min: 0,
                            step: "0.01",
                        },
                        "col-md-3",
                    )}

                    {field(
                        "pass_percentage",
                        "Pass percentage",
                        "number",
                        {
                            min: 0,
                            max: 100,
                        },
                        "col-md-3",
                    )}

                    {field("deadline", "Deadline", "date", {}, "col-md-3")}

                    <div className="col-12 mb-3">
                        <label className="form-label" htmlFor="image">
                            Course image
                        </label>

                        <input
                            id="image"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className={`form-control ${
                                errors.image ? "is-invalid" : ""
                            }`}
                            onChange={(event) =>
                                setData(
                                    "image",
                                    event.target.files?.[0] ?? null,
                                )
                            }
                            disabled={processing}
                        />

                        {errors.image && (
                            <div className="invalid-feedback">
                                {errors.image}
                            </div>
                        )}

                        {(data.image instanceof File || existingImage) && (
                            <img
                                className="mt-3 rounded"
                                src={
                                    data.image instanceof File
                                        ? URL.createObjectURL(data.image)
                                        : assetUrl(existingImage)
                                }
                                alt="Course preview"
                                style={{
                                    maxWidth: 260,
                                    maxHeight: 150,
                                    objectFit: "cover",
                                }}
                            />
                        )}
                    </div>

                    <div className="col-12 mb-3">
                        <label
                            className="form-label"
                            htmlFor="short_description"
                        >
                            Card summary
                        </label>

                        <textarea
                            id="short_description"
                            rows="2"
                            className="form-control"
                            value={data.short_description ?? ""}
                            onChange={(event) =>
                                setData("short_description", event.target.value)
                            }
                            disabled={processing}
                        />

                        {errors.short_description && (
                            <div className="text-danger small mt-1">
                                {errors.short_description}
                            </div>
                        )}
                    </div>

                    <div className="col-12 mb-3">
                        <label className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={Boolean(data.is_published)}
                                onChange={(event) =>
                                    setData(
                                        "is_published",
                                        event.target.checked,
                                    )
                                }
                                disabled={processing}
                            />

                            <span className="form-check-label">
                                Published and visible in the public catalog
                            </span>
                        </label>
                    </div>
                </div>
            </>

            <div className="card mt-4">
                <div className="card-body">
                    <ul
                        className="nav nav-pills course-form-tablist mb-4"
                        role="tablist"
                    >
                        {sectionTabs.map((tab) => (
                            <li
                                className="nav-item"
                                key={tab.key}
                                role="presentation"
                            >
                                <button
                                    type="button"
                                    className={`nav-link ${
                                        activeTab === tab.key ? "active" : ""
                                    }`}
                                    onClick={() => setActiveTab(tab.key)}
                                >
                                    {tab.label}
                                </button>
                            </li>
                        ))}
                    </ul>

                    {activeTab === "overview_blocks" && (
                        <>
                            <h5 className="mb-3">Overview Content</h5>

                            {blockEditor("overview_blocks")}
                        </>
                    )}

                    {activeTab === "curriculum" && (
                        <>
                            <h5 className="mb-3">Course Curriculum</h5>

                            <p className="text-muted">
                                Build the curriculum using headings, paragraphs,
                                and lists. List blocks can contain multiple
                                bullet points.
                            </p>

                            {blockEditor("curriculum")}
                        </>
                    )}

                    {activeTab === "instructor_details" && (
                        <>
                            <h5 className="mb-3">Instructor Content</h5>

                            {blockEditor("instructor_details")}
                        </>
                    )}

                    <div className="mt-4">{children}</div>
                </div>
            </div>

            <DeleteConfirmationModal
                modalRef={modalRef}
                title="Delete content block?"
                message={
                    pendingDelete?.itemIndex === null
                        ? "Are you sure you want to delete this content block?"
                        : "Are you sure you want to delete this bullet point?"
                }
                itemName={
                    pendingDelete
                        ? sectionTabs.find(
                              (tab) => tab.key === pendingDelete.field,
                          )?.label
                        : null
                }
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </>
    );
};

export default CourseForm;
