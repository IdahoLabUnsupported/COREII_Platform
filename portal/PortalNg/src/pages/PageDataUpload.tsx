// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import FileUploader from "../components/file-uploader/file-uploader";

const url = 'http://localhost:5210/api/dataUpload/postDataUpload';

interface ContainerProps {
    children: React.ReactNode;
}

const Container = ({ children }: ContainerProps) => (
    <div className="page-component dark:bg-slate-800">
        {children}
    </div>
);

export default function DataUpload() {
    return (
        <div className='page-component dark:bg-slate-800'>
            <div className="p-10">


                <h2 className="text-4xl mb-8 text-gray-800 dark:text-white">Data Upload</h2>


                <FileUploader
                    url={url}
                            acceptedFileTypes={[
                                "application/JSON",
                                ".csv",
                            ]}
                            allowMultiple={true}
                            maxFileSize={100}
                            label="Max File Size: 100MB (multiple)"
                            labelAlt="Accepted File Types: json, csv"
                        />


            </div>
        </div>
                );
                }