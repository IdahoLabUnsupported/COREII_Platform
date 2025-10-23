// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import React, { useState } from 'react';
import ButtonBasic1 from '../elements/ButtonBasic1';
import ButtonIcon from "../elements/ButtonIcon";

type ModalEditDashboardProps = {
    closeModal: () => void;
    onSubmit: (formData: any) => void;
    defaultValue: any;
};

const ModalEditDashboard: React.FC<ModalEditDashboardProps> = ({ closeModal, onSubmit, defaultValue }) => {
    const [formState, setFormState] = useState(defaultValue || {
        applicationName: '',
        applicationSourceUrl: '',
        textData: '',
        textHelps: '',
        textSummary: '',
        textWorks: '',
        tlr: 1,
        applicationUrl: '',
        applicationIcon: '',
        applicationNews:'',
    });
    const [errors, setError] = useState<string[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.target.name === 'applicationIcon') {
            setFormState({ ...formState, applicationIcon: e.target.value }); // Handle applicationIcon as a string
        } else if (e.target.name === 'applicationImages') {
            const files = (e.target as HTMLInputElement).files;
            if (files) {
                setFormState({ ...formState, applicationImages: Array.from(files) });
            }
        } else {
            setFormState({ ...formState, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = [];
        if (formState.applicationName.trim() === '') {
            newErrors.push('Application Name is required.');
        }
        if (formState.applicationSourceUrl.trim() === '') {
            newErrors.push('Application Source URL is required.');
        }
        if (formState.applicationUrl.trim() === '') {
            newErrors.push('Application URL is required.');
        }if(formState.textData .trim() === ''){
            newErrors.push('Text Data is required');
        }
        if (newErrors.length > 0) {
            setError(newErrors);
            return;
        }
        setError([]);
        onSubmit(formState);
        console.log(formState)
        closeModal();
    };

    return (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
             onClick={closeModal}>
            <div
                className="modal-box bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-3xl shadow-lg relative max-h-full overflow-y-auto"
                onClick={e => e.stopPropagation()}>
                <ButtonIcon
                    label="close"
                    buttonIcon="close"
                    color="btn-ghost"
                    buttonSize="btn-sm"
                    className="absolute top-2 right-2"
                    onClick={closeModal}
                />
                <h2 className="font-bold text-lg text-gray-800 dark:text-white">{defaultValue ? 'Edit' : 'Add'} Application</h2>
                <form onSubmit={handleSubmit}>
                    {errors.length > 0 && (
                        <div>
                            {errors.map((error, index) => (
                                <p key={index} className="text-red-500">{error}</p>
                            ))}
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label text-gray-800 dark:text-white" htmlFor="applicationName">Application
                                Name</label>
                            <input
                                type="text"
                                name="applicationName"
                                value={formState.applicationName}
                                onChange={handleChange}
                                className="input input-bordered bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                            />
                        </div>
                        <div className="form-control">
                            <label className="label text-gray-800 dark:text-white" htmlFor="applicationSourceUrl">Application
                                Source URL</label>
                            <input
                                type="text"
                                name="applicationSourceUrl"
                                value={formState.applicationSourceUrl}
                                onChange={handleChange}
                                className="input input-bordered bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                            />
                        </div>
                        <div className="form-control">
                            <label className="label text-gray-800 dark:text-white" htmlFor="applicationUrl">Application
                                URL</label>
                            <input
                                type="text"
                                name="applicationUrl"
                                value={formState.applicationUrl}
                                onChange={handleChange}
                                className="input input-bordered bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                            />
                        </div>
                        <div className="form-control">
                            <label className="label text-gray-800 dark:text-white" htmlFor="tlr">TRL</label>
                            <input
                                type="number"
                                name="tlr"
                                value={formState.tlr}
                                onChange={handleChange}
                                className="input input-bordered bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                            />
                        </div>
                        <div className="form-control col-span-2">
                            <label className="label text-gray-800 dark:text-white" htmlFor="textData">Text Data</label>
                            <textarea
                                name="textData"
                                value={formState.textData}
                                onChange={handleChange}
                                className="textarea textarea-bordered bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                            />
                        </div>
                        <div className="form-control col-span-2">
                            <label className="label text-gray-800 dark:text-white" htmlFor="textHelps">Text
                                Helps</label>
                            <textarea
                                name="textHelps"
                                value={formState.textHelps}
                                onChange={handleChange}
                                className="textarea textarea-bordered bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                            />
                        </div>
                        <div className="form-control col-span-2">
                            <label className="label text-gray-800 dark:text-white" htmlFor="textSummary">Text
                                Summary</label>
                            <textarea
                                name="textSummary"
                                value={formState.textSummary}
                                onChange={handleChange}
                                className="textarea textarea-bordered bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                            />
                        </div>
                        <div className="form-control col-span-2">
                            <label className="label text-gray-800 dark:text-white" htmlFor="textWorks">Text
                                Works</label>
                            <textarea
                                name="textWorks"
                                value={formState.textWorks}
                                onChange={handleChange}
                                className="textarea textarea-bordered bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                            />
                        </div>
                        <div className="form-control col-span-2">
                            <label className="label text-gray-800 dark:text-white" htmlFor="textWorks">News</label>
                            <textarea
                                name="applicationNews"
                                value={formState.applicationNews}
                                onChange={handleChange}
                                className="textarea textarea-bordered bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                            />
                        </div>
                    </div>
                    <div className="modal-action flex justify-end mt-4">
                        <ButtonBasic1 label="Cancel" color="btn-secondary" onClick={closeModal} />
                        <ButtonBasic1 label="Save" color="btn-primary" onClick={handleSubmit} />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalEditDashboard;