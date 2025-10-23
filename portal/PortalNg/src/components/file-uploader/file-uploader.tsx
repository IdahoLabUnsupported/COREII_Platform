// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
'use client'
import React, { useState, ChangeEvent, useRef } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import axios from "axios";
import './file-uploader.css';

interface FileUploaderProps {
    acceptedFileTypes?: string[] | null;
    url: string;
    maxFileSize?: number;
    allowMultiple?: boolean;
    label?: string;
    labelAlt?: string;
}

export default function FileUploader(props: FileUploaderProps) {
    const {
        acceptedFileTypes,
        url,
        maxFileSize,
        allowMultiple,
        label,
        labelAlt
    } = props;
    const MAX_FILE_SIZE = maxFileSize * 1024 * 1024;
    const [fileProgress, setFileProgress] = useState<{ [key: string]: number }>({});
    const [fileStatus, setFileStatus] = useState<{ [key: string]: string }>({});
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

    const isError = Object.values(fileStatus).some(status => status !== 'Uploaded');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetUploader = () => {
        setFileProgress({});
        setFileStatus({});
        setUploadError(null);
        setUploadSuccess(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    const fileSelectedHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setUploadError(null);
        if (event.target.files) {
            const files = Array.from(event.target.files);
            let isValid = true;
            let fileErrors: { [key: string]: string } = {};
            files.forEach(file => {
                if (file.size > MAX_FILE_SIZE) {
                    isValid = false;
                    fileErrors[file.name] = "File size too large";
                }
            });

            if (!isValid) {
                setFileStatus(fileErrors);
            } else {
                files.forEach(file => {
                    setFileProgress(prev => ({ ...prev, [file.name]: 0 }));
                    fileUploadHandler(file);
                });
            }
        }

    };

    const fileUploadHandler = (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        axios.post(url, formData, {
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setFileProgress(prev => ({ ...prev, [file.name]: percentCompleted }));
            }
        }).then(() => {
            setFileStatus(prev => ({ ...prev, [file.name]: 'Uploaded' }));
        }).catch(() => {
            setFileStatus(prev => ({ ...prev, [file.name]: 'Failed' }));
        });
    };

    return (
        <div className="flex flex-col gap-4 w-full h-60 md:h-48" >
            {
                uploadSuccess
                    ?
                    <div className="flex flex-col gap-2">
                        {
                            isError ? <span className="text-xs text-red-500">Upload completed, but with errors.</span> : <></>
                        }
                        <div className="btn-group w-full">
                            <span className="btn btn-success w-1/2">Success!</span>
                            <button
                                className="btn w-1/2"
                                onClick={resetUploader}
                            >Upload Another</button>
                        </div>
                    </div>
                    :
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">{label}</span>
                            <span className="label-text-alt">{labelAlt}</span>
                        </label>
                        <input
                            type="file"
                            className="file-input file-input-bordered file-input-padding file-input-primary w-full max-w-xs dark:bg-slate-800"
                            onChange={fileSelectedHandler}
                            accept={acceptedFileTypes ? acceptedFileTypes.join(',') : undefined}
                            ref={fileInputRef}
                            multiple={allowMultiple} // Added the 'multiple' attribute conditionally
                        />
                        <label className="label">
                            <span className="label-text-alt text-red-500">{uploadError}</span>
                        </label>
                    </div>
            }

            <div className="overflow-x-auto flex gap-2 flex-col-reverse">
                {Object.entries(fileProgress).map(([fileName, progress]) => (
                    <div key={fileName} className="text-xs flex flex-col gap-1">
                        <p>{fileName}</p>
                        <div className="flex items-center gap-2">
                            <progress
                                className="progress progress-primary w-full"
                                value={progress}
                                max="100"
                            />
                            {progress === 100 &&
                                <>
                                    {
                                        fileStatus[fileName] === 'Uploaded'
                                            ?
                                            <FaCheck className="text-xl text-green-500 mr-4" />
                                            :
                                            <FaTimes className="text-xl text-red-500 mr-4" />
                                    }
                                </>
                            }
                        </div>
                        <p className="text-red-500">{fileStatus[fileName] !== 'Uploaded' ? fileStatus[fileName] : ''}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}