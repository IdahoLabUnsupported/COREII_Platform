// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import React, { useState, useEffect , useRef} from 'react';
import { getApplications, addImages, uploadIcon } from '../../services/pageAppService';

type Props = {
    closeModal: () => void;
};

const ModalAddImages: React.FC<Props> = ({ closeModal }) => {
    const [applications, setApplications] = useState([]);
    const [selectedApp, setSelectedApp] = useState<string>('');
    const [images, setImages] = useState<FileList | null>(null);
    const [icon, setIcon] = useState<File | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const apps = await getApplications();
                setApplications(apps);
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        };
        fetchApplications();
    }, []);

    const handleAppChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedApp(event.target.value);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setImages(event.target.files);
    };

    const handleIconChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIcon(event.target.files ? event.target.files[0] : null);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!selectedApp || !images) {
            alert('Please select an application and upload images.');
            return;
        }

        const formData = new FormData();
        formData.append('applicationId', selectedApp);
        Array.from(images).forEach((image, index) => {
            formData.append(`images`, image);
        });

        try {
            await addImages(formData);
            alert('Images uploaded successfully.');
            closeModal();
        } catch (error) {
            console.error('Error uploading images:', error);
            alert('Failed to upload images.');
        }
    };

    const handleIconUpload = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!selectedApp || !icon) {
            alert('Please select an application and upload an icon.');
            return;
        }

        try {
            await uploadIcon(parseInt(selectedApp), icon);
            alert('Icon uploaded successfully.');
            closeModal();
        } catch (error) {
            console.error('Error uploading icon:', error);
            alert('Failed to upload icon.');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div ref={modalRef}
                 className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg border border-gray-300 dark:border-gray-700 relative">
                <button className="absolute top-2 right-2 text-gray-800 dark:text-white" onClick={closeModal}>X</button>
                <h2 className="text-xl mb-4">Add Images</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-control">
                        <label className="label text-gray-800 dark:text-white" htmlFor="applicationSelect">Select
                            Application</label>
                        <select
                            id="applicationSelect"
                            value={selectedApp}
                            onChange={handleAppChange}
                            className="select select-bordered bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        >
                            <option value="" disabled>Select an application</option>
                            {applications.map((app: any) => (
                                <option key={app.applicationId} value={app.applicationId}>
                                    {app.applicationName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-control">
                        <label className="label text-gray-800 dark:text-white" htmlFor="imageUpload">Upload
                            Images</label>
                        <input
                            type="file"
                            id="imageUpload"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            className="input input-bordered bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        />
                    </div>
                    <div className="form-control">
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </form>
                <form onSubmit={handleIconUpload} className="space-y-4 mt-8">
                    <div className="form-control">
                        <label className="label text-gray-800 dark:text-white" htmlFor="iconUpload">Upload Icon</label>
                        <input
                            type="file"
                            id="iconUpload"
                            accept="image/*"
                            onChange={handleIconChange}
                            className="input input-bordered bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        />
                    </div>
                    <div className="form-control">
                        <button type="submit" className="btn btn-primary">Upload Icon</button>
                    </div>
                </form>
                <div className="flex justify-end space-x-4 mt-4">
                    <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ModalAddImages;