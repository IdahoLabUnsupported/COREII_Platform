// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import ButtonBasic1 from "../elements/ButtonBasic1";
import ButtonIcon from "../elements/ButtonIcon";

interface FieldDefinition {
    name: string;
    label: string;
    type?: string; // e.g., "text" or "textarea"
}

interface DynamicEditModalProps {
    isOpen: boolean;
    title: string;
    fields: FieldDefinition[];
    initialData: { [key: string]: any };
    onClose: () => void;
    onSubmit: (updatedData: { [key: string]: any }) => void;
}

const NewsEditModal: React.FC<DynamicEditModalProps> = ({
                                                               isOpen,
                                                               title,
                                                               fields,
                                                               initialData,
                                                               onClose,
                                                               onSubmit,
                                                           }) => {
    const [formData, setFormData] = useState<{ [key: string]: any }>(initialData);

    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        onSubmit(formData);
        onClose();
    };

    return ReactDOM.createPortal(
        <div
            className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
          >
          <div
    className="modal-container bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg w-1/3 shadow-lg relative max-h-full overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
>
<ButtonIcon
    label="close"
          buttonIcon="close"
          color="btn-ghost"
          buttonSize="btn-sm"
          className="absolute top-2 right-2"
          onClick={onClose}
    />
    <h3 className="text-xl mb-4">{title}</h3>
    <form>
    {fields.map((field) => (
            <div className="form-control mb-4" key={field.name}>
        <label className="label text-gray-800 dark:text-white" htmlFor={field.name}>
        {field.label}
</label>
    {field.type === "textarea" ? (
        <textarea
            name={field.name}
            id={field.name}
            value={formData[field.name] || ""}
            onChange={handleChange}
            className="input input-bordered bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
    ) : (
        <input
            type={field.type || "text"}
            name={field.name}
            id={field.name}
            value={formData[field.name] || ""}
            onChange={handleChange}
            className="input input-bordered bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
    )}
</div>
))}
    <div className="modal-action flex justify-end">
<ButtonBasic1 label="Save" color="btn-primary" onClick={handleSubmit} />
    <ButtonBasic1 label="Cancel" color="btn-secondary" onClick={onClose} />
</div>
</form>
</div>
</div>,
    document.body
);
};

export default NewsEditModal;