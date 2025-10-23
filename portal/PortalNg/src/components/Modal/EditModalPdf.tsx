// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import ButtonBasic1 from '../elements/ButtonBasic1';
import ButtonIcon from '../elements/ButtonIcon';

const EditModalPdf = ({ isOpen, onClose, resource, categories, onSave }) => {
    const [formData, setFormData] = useState(resource);
    const excludedFields = ['filePath', 'fileId', 'comments', 'categoryId', 'publishDate', 'shortName', 'description','docVersion','sourceType','name' , "categoryName"];

    useEffect(() => {
        setFormData(resource);
    }, [resource]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        onSave(formData);
        onClose(); // Close the modal upon successful save
    };

    const capitalize = (str) => {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    };

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div
                className="modal-container bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg w-1/3 shadow-lg relative max-h-full overflow-y-auto"
                onClick={e => e.stopPropagation()}>
                <ButtonIcon
                    label="close"
                    buttonIcon="close"
                    color="btn-ghost"
                    buttonSize="btn-sm"
                    className="absolute top-2 right-2 "
                    onClick={onClose}
                />
                <h3 className="text-xl mb-4">Edit Resource</h3>
                {Object.keys(formData).filter(key => !excludedFields.includes(key)).map(key => (
                    <div className="form-control mb-4" key={key}>
                        <label className="label text-gray-800 dark:text-white" htmlFor={key}>
                            {capitalize(key.replace(/([A-Z])/g, ' $1').trim())}
                        </label>
                        <input
                            type="text"
                            name={key}
                            value={formData[key] || ''}
                            onChange={handleChange}
                            className="input input-bordered bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        />
                    </div>
                ))}
                <div className="form-control mb-4">
                    <label className="label text-gray-800 dark:text-white" htmlFor="categoryId">
                        Category
                    </label>
                    <select
                        name="categoryId"
                        value={formData.categoryId || ''}
                        onChange={handleChange}
                        className="select select-bordered bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                            <option key={category.category_Id} value={category.category_Id}>
                                {category.category_Name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="modal-action flex justify-end">
                    <ButtonBasic1
                        label="Save"
                        color="btn-primary"
                        onClick={handleSubmit}
                    />
                    <ButtonBasic1
                        label="Save"
                        color="btn-secondary"
                        onClick={onClose}
                    />
                </div>
            </div>
        </div>,
        document.body
    );
};

export default EditModalPdf;