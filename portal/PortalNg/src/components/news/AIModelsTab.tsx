// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import React, { useEffect, useState } from "react";
import { uploadAIModel, GetAIModels , updateAiModel, deleteAiModel} from "../../services/newsServices";
import ButtonBasic1 from "../elements/ButtonBasic1";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useTheme } from "../../contexts/useTheme";
import ActionsCellRenderer from "./ActionsCellRenderer";
import  NewsEditModal from '../Modal/NewsEditModal';
import NewsDeleteModal from '../Modal/NewsDeleteModal';


    const AIModelsTab: React.FC = () => {
    const [formData, setFormData] = useState({
        AIModelName: "",
        AIModelDescription: "",
        Category: "",
        Creator: "",
        url: ""
    });
    const [latestAIModels, setLatestAIModels] = useState<
        {
            aiModelName: string;
            aiModelDescription: string;
            url: string;
        }[]
    >([]);
    const { theme } = useTheme();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any>({});
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    const handleEditClick = (data: any) => {
        setSelectedRow(data);
        setIsModalOpen(true);
    };
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleModalSubmit =async (updatedData: { [key: string]: any }) => {
        console.log("Updated AI Model:", updatedData);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("AIModelId", updatedData.aiModelId || selectedRow.AIModelId);
            formDataToSend.append("AIModelName", updatedData.aiModelName);
            formDataToSend.append("AIModelDescription", updatedData.aiModelDescription);
            formDataToSend.append("Category", updatedData.Category);
            formDataToSend.append("Creator", updatedData.Creator);
            formDataToSend.append("url", updatedData.url);

            const response = await updateAiModel(formDataToSend);
            if (response.status === 200) {
                // alert("AI Model updated successfully.");
                setIsModalOpen(false);
                fetchLatestAIModels();
            } else {
                alert("Failed to update AI Model.");
            }
        } catch (error: any) {
            console.error("Error updating AI Model:", error);
            alert(`Error updating AI Model: ${error.response?.data || error.message}`);
        }
    };
        const handleDeleteConfirm = async () => {
            // console.log("Deleting Model:", selectedRow);
            // setIsDeleteModalOpen(false);
            console.log("Deleting Model:", selectedRow);
            try {
                const response = await deleteAiModel(selectedRow.aiModelId.toString());
                if (response.status === 200) {
                    // alert("AI Model deleted successfully.");
                    setIsDeleteModalOpen(false);
                    fetchLatestAIModels();
                } else {
                    alert("Failed to delete AI Model.");
                }
            } catch (error: any) {
                console.error("Error deleting AI Model:", error);
                alert(`Error deleting AI Model: ${error.response?.data || error.message}`);
            }
        };
        const fetchLatestAIModels = async () => {
            try {
                const response = await GetAIModels();
                if (response.status === 200) {
                    setLatestAIModels(response.data);
                }
            } catch (error) {
                console.error("Error fetching latest AI Models:", error);
            }
        };

        useEffect(() => {
            fetchLatestAIModels();
        }, []);
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("AIModelName", formData.AIModelName);
            formDataToSend.append("AIModelDescription", formData.AIModelDescription);
            formDataToSend.append("Category", formData.Category);
            formDataToSend.append("Creator", formData.Creator);
            formDataToSend.append("url", formData.url);

            const response = await uploadAIModel(formDataToSend);
            if (response.status === 200) {
                // alert("Successfully upload AI Model");
                setFormData({
                    AIModelName: "",
                    AIModelDescription: "",
                    Category: "",
                    Creator: "",
                    url: ""
                });
               await fetchLatestAIModels();
            } else {
                alert("Failed to upload AI Model");
            }
        } catch (error: any) {
            console.error("Error uploading AI Model:", error);
            alert(`Error uploading AI Model: ${error.response?.data || error.message}`);
        }
    };

    const handleDelete = (data: any) => {

         console.log("Delete clicked for:", data);
        setSelectedRow(data);
        setIsDeleteModalOpen(true);
    };
    const aiModelColumns: ColDef[] = [
        { headerName: "Model Name", field: "aiModelName", flex: 1 },
        { headerName: "Description", field: "aiModelDescription", flex: 1 },
        { headerName: "URL", field: "url", flex: 1 },
        {
            headerName: "Actions",
            field: "AIModelName",
            cellRenderer: (params) => (
              <ActionsCellRenderer
              data={params.data}
              onEdit={handleEditClick}
              onDelete={handleDelete}
              >

              </ActionsCellRenderer>
            ),
            flex: 1
        }
    ];

    useEffect(() => {
        const fetchLatestAIModels = async () => {
            try {
                const response = await GetAIModels();
                if (response.status === 200) {
                    setLatestAIModels(response.data);
                }
            } catch (error) {
                console.error("Error fetching latest AI Models:", error);
            }
        };
        fetchLatestAIModels();
    }, []);

    return (
        <div className="m-4 pb-6">
            <div className="w-[80%]">
                <form onSubmit={handleSubmit} className="space-y-4 w-[60%]">
                    <div className="form-control">
                        <label className="w-36">AI Model Name</label>
                        <input
                            type="text"
                            name="AIModelName"
                            value={formData.AIModelName}
                            onChange={handleChange}
                            placeholder="Enter AI Model Name"
                            className="input input-bordered input-secondary w-full bg-gray-300 dark:bg-gray-900 mb-4 mt-4"
                            required
                        />
                    </div>
                    <div className="form-control">
                        <label className="w-36">AI Model Description</label>
                        <textarea
                            name="AIModelDescription"
                            value={formData.AIModelDescription}
                            onChange={handleChange}
                            placeholder="Enter AI Model Description"
                            className="textarea textarea-bordered w-full bg-gray-300 dark:bg-gray-900 text-black dark:text-white h-28 p-2 mb-4 mt-4"
                            required
                        />
                    </div>
                    <div className="form-control">
                        <label className="w-36">Category</label>
                        <input
                            type="text"
                            name="Category"
                            value={formData.Category}
                            onChange={handleChange}
                            placeholder="Enter Category"
                            className="input input-bordered input-secondary w-full bg-gray-300 dark:bg-gray-900 mb-4 mt-4"
                            required
                        />
                    </div>
                    <div className="form-control">
                        <label className="w-36">Creator</label>
                        <input
                            type="text"
                            name="Creator"
                            value={formData.Creator}
                            onChange={handleChange}
                            placeholder="Enter Creator"
                            className="input input-bordered input-secondary w-full bg-gray-300 dark:bg-gray-900 mb-4 mt-4"
                            required
                        />
                    </div>
                    <div className="form-control">
                        <label className="w-36">URL</label>
                        <input
                            type="text"
                            name="url"
                            value={formData.url}
                            onChange={handleChange}
                            placeholder="Enter URL"
                            className="input input-bordered input-secondary w-full bg-gray-300 dark:bg-gray-900 mb-4 mt-4"
                            required
                        />
                    </div>
                    <ButtonBasic1 label="Upload AI Model" target="submit" color="btn-primary" />
                </form>
                <div
                    className={`pt-11 ${
                        theme === "dark" ? "ag-theme-alpine-dark custom-dark" : "ag-theme-alpine custom-light"
                    }`}
                    style={{ height: "500px", width: "100%" }}
                >
                    <AgGridReact
                        rowData={latestAIModels}
                        columnDefs={aiModelColumns}
                        domLayout="autoHeight"

                    />
                </div>
            </div>
            <NewsEditModal
                isOpen={isModalOpen}
                title="Edit AI Model"
                fields={[
                { name: "aiModelName", label: "Model Name" },
              { name: "aiModelDescription", label: "Description", type: "textarea" },
              { name: "url", label: "URL" },
                ]}
                initialData={selectedRow}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                />
            <NewsDeleteModal
                isOpen={isDeleteModalOpen}
                title="Delete AI Model"
                message="Are you sure you want to delete this AI Model?"
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                />
        </div>
    );
};

export default AIModelsTab;