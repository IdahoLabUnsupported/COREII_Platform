// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import React, { useEffect, useState } from "react";
import {
    uploadDatasetModel,
    getLatestDatasets,
    updateDataset,
    deleteDataset
} from "../../services/newsServices";
import ButtonBasic1 from "../../components/elements/ButtonBasic1";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import ActionsCellRenderer from "./ActionsCellRenderer";
import { useTheme } from "../../contexts/useTheme";
import  NewsEditModal from '../Modal/NewsEditModal';
import NewsDeleteModal from '../Modal/NewsDeleteModal';

const DatasetsTab: React.FC = () => {
    const [datasetFormData, setDatasetFormData] = useState({
        DatasetName: "",
    DatasetDescription: "",
});
    const [latestDatasets, setLatestDatasets] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any>({});
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const handleDatasetChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setDatasetFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDatasetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("Title", datasetFormData.DatasetName);
            formDataToSend.append("Description", datasetFormData.DatasetDescription);

            const response = await uploadDatasetModel(formDataToSend);
            if (response.status === 200) {
                setDatasetFormData({ DatasetName: "", DatasetDescription: "" });
                fetchLatestDatasets();
            } else {
                alert("Failed to upload Dataset");
            }
        } catch (error: any) {
            console.error("Error uploading Dataset:", error);
            alert(`Error uploading Dataset: ${error.response?.data || error.message}`);
        }
    };
    const handleDeleteConfirm =async () => {

        try {
            const response = await deleteDataset(selectedRow.id.toString());
            if (response.status === 200) {
                setIsDeleteModalOpen(false);
                await fetchLatestDatasets();
            } else {
                alert("Failed to delete Model.");
            }
        } catch (error: any) {
            console.error("Error deleting  Model:", error);
            alert(`Error deleting Model: ${error.response?.data || error.message}`);
        }
    };

    const handleDelete = (data: any) => {
        setSelectedRow(data);
        setIsDeleteModalOpen(true);
    };
    const fetchLatestDatasets = async () => {
        try {
            const response = await getLatestDatasets();
            if (response.status === 200) {
                setLatestDatasets(response.data);
            }
        } catch (error) {
            console.error("Error fetching latest datasets:", error);
        }
    };

    useEffect(() => {
        fetchLatestDatasets();
    }, []);

    const handleEditDataset = (data: any) => {
        setSelectedRow(data);
        setIsModalOpen(true);
    };

    const handleModalSubmit =async (updatedData: { [key: string]: any }) => {
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("Id", updatedData.id || selectedRow.id);
            formDataToSend.append("Title", updatedData.title || selectedRow.title);
            formDataToSend.append("Description", updatedData.description);


            const response = await updateDataset(formDataToSend);
            if (response.status === 200) {
                // alert("Dataset Model updated successfully.");
                setIsModalOpen(false);
               await fetchLatestDatasets();
            } else {
                alert("Failed to update Model.");
            }
        } catch (error: any) {
            console.error("Error updating Model:", error);
            alert(`Error updating  Model: ${error.response?.data || error.message}`);
        }
    };


    const datasetColumns: ColDef[] = [
        { headerName: "Title", field: "title", flex: 1 },
    { headerName: "Description", field: "description", flex: 1 },
    {
        headerName: "Actions",
        field: "id",
        flex: 1,
            cellRenderer: (params) => (
        <ActionsCellRenderer
            data={params.data}
            onEdit={handleEditDataset}
            onDelete={handleDelete}
        />
    ),
    },
];
    const { theme } = useTheme();
    return (
        <div className="m-4 pb-6">
            <div className="w-[80%]">
                <form onSubmit={handleDatasetSubmit}  className="space-y-4 w-[60%]">
                    <div className="form-control">
                        <label className="w-36">Dataset Name</label>
                        <input
                            type="text"
                            name="DatasetName"
                            value={datasetFormData.DatasetName}
                            onChange={handleDatasetChange}
                            placeholder="Dataset Name"
                            className="input input-bordered input-secondary w-full bg-gray-300 dark:bg-gray-900 mb-4 mt-4"
                            required
                        />
                    </div>
                    <div className="form-control">
                        <label className="w-36">Dataset Description</label>
                        <textarea
                            name="DatasetDescription"
                            value={datasetFormData.DatasetDescription}
                            onChange={handleDatasetChange}
                            placeholder="Dataset Description"
                            className="textarea textarea-bordered w-full bg-gray-300 dark:bg-gray-900 text-black dark:text-white h-28 p-2 mb-4 mt-4"
                            required
                        />
                    </div>
                    <ButtonBasic1 label="Upload Dataset" target="submit" color="btn-primary" />
                </form>

                <div
                    className={`pt-11 ${
                        theme === "dark" ? "ag-theme-alpine-dark custom-dark" : "ag-theme-alpine custom-light"
                    }`}
                    style={{ height: "500px", width: "100%" }}
                >
                    <AgGridReact
                        rowData={latestDatasets}
                        columnDefs={datasetColumns}
                        domLayout="autoHeight"

                    />
                </div>
            </div>
                <NewsEditModal
                    isOpen={isModalOpen}
                    title="Edit Dataset"
                    fields={[
                        { name: "title", label: "Title" },
                        { name: "description", label: "Description", type: "textarea" },
                    ]}
                    initialData={selectedRow}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleModalSubmit}
                />

            <NewsDeleteModal
                isOpen={isDeleteModalOpen}
                title="Delete Dataset"
                message="Are you sure you want to delete this Dataset?"
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                />            </div>
            );
            };

            export default DatasetsTab;