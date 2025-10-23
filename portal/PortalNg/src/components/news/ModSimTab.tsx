// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import React, { useEffect,useState } from "react";
import {
    uploadModSimData,
    GetModSimModels,
    updateModSim,
    deleteModSim,
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

const ModSimTab: React.FC = () => {

    const { theme } = useTheme();
    const [modSimFormData, setModSimFormData] = useState({
        Title: "",
    Content: "",
});
    const [latestModSim, setLatestModSim] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any>({});
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const handleModSimChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setModSimFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleModSimSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const modSimFormDataToSend = new FormData();
            modSimFormDataToSend.append("Title", modSimFormData.Title);
            modSimFormDataToSend.append("Content", modSimFormData.Content);

            const response = await uploadModSimData(modSimFormDataToSend);
            if (response.status === 200) {
                alert("Successfully uploaded MOD/SIM Data");
                setModSimFormData({ Title: "", Content: "" });
                await fetchLatestModSim();
            } else {
                alert("Failed to upload MOD/SIM Data");
            }
        } catch (error: any) {
            console.error("Error uploading MOD/SIM Data:", error);
            alert(`Error uploading MOD/SIM Data: ${error.response?.data || error.message}`);
        }
    };
    const fetchLatestModSim = async () => {
        try {
            const response = await GetModSimModels();
            if (response.status === 200) {
                setLatestModSim(response.data);
            }
        } catch (error) {
            console.error("Error fetching latest Mod/Sim data:", error);
        }
    };
    const handleModalSubmit = async (updatedData: { [key: string]: any }) => {
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("Id", updatedData.id || selectedRow.id);
            formDataToSend.append("Title", updatedData.title || selectedRow.title);
            formDataToSend.append("Content", updatedData.content);


            const response = await updateModSim(formDataToSend);
            if (response.status === 200) {
                alert("MOD/SIM Model updated successfully.");
                setIsModalOpen(false);
                await fetchLatestModSim();
            } else {
                alert("Failed to update Model.");
            }
        } catch (error: any) {
            console.error("Error updating Model:", error);
            alert(`Error updating  Model: ${error.response?.data || error.message}`);
        }
    };
    const handleDeleteConfirm = async () => {
        try {
            const response = await deleteModSim(selectedRow.id.toString());
            if (response.status === 200) {
                alert("AI Model deleted successfully.");
                setIsDeleteModalOpen(false);
              await fetchLatestModSim();
            } else {
                alert("Failed to delete  Model.");
            }
        } catch (error: any) {
            console.error("Error deleting  Model:", error);
            alert(`Error deleting  Model: ${error.response?.data || error.message}`);
        }
    };
    const handleDelete = (data: any) => {
        setSelectedRow(data);
        setIsDeleteModalOpen(true);
    };
    useEffect(() => {
        fetchLatestModSim();
    }, []);

    const handleEditModSim = (data: any) => {
        setSelectedRow(data);
        setIsModalOpen(true);
    };


    const modSimColumns: ColDef[] = [
        { headerName: "Title", field: "title", flex: 1 },
    {
        headerName: "Content",
        field: "content",
        flex: 1,
            cellRenderer: (params) => (
        <div
            className="whitespace-normal overflow-visible"
          dangerouslySetInnerHTML={{ __html: params.value }}
        />
    ),
    },
    {
        headerName: "Actions",
        field: "id",
        flex: 1,
            cellRenderer: (params) => (
        <ActionsCellRenderer
            data={params.data}
            onEdit={handleEditModSim}
            onDelete={handleDelete}
        />
    ),
    },
];

    return (
        <div className="m-4 pb-6">
            <div className="w-[80%]">
                <form onSubmit={handleModSimSubmit}  className="space-y-4 w-[60%]">
                    <div className="form-control">
                        <label className="w-36">MOD/SIM Title</label>
                        <input
                            type="text"
                            name="Title"
                            value={modSimFormData.Title}
                            onChange={handleModSimChange}
                            placeholder="MOD/SIM Title"
                            className="input input-bordered input-secondary w-full bg-gray-300 dark:bg-gray-900 mb-4 mt-4"
                            required
                        />
                    </div>
                    <div className="form-control">
                        <label className="w-36">Content</label>
                        <textarea
                            name="Content"
                            value={modSimFormData.Content}
                            onChange={handleModSimChange}
                            placeholder="Enter HTML content"
                            className="textarea textarea-bordered w-full bg-gray-300 dark:bg-gray-900 text-black dark:text-white h-28 p-2 mb-4 mt-4"
                            required
                        />
                    </div>
                    <ButtonBasic1 label="Upload MOD/SIM Data" target="submit" color="btn-primary" />
                </form>
                <div
                    className={`pt-11 ${
                        theme === "dark" ? "ag-theme-alpine-dark custom-dark" : "ag-theme-alpine custom-light"
                    }`}
                    style={{ height: "500px", width: "100%" }}
                >
                    <AgGridReact
                        rowData={latestModSim}
                        columnDefs={modSimColumns}
                        domLayout="autoHeight"

                    />
                </div>
            </div>
            <NewsEditModal
                isOpen={isModalOpen}
                title="Edit MOD/SIM Data"
                fields={[
                { name: "title", label: "Title" },
                { name: "content", label: "Content", type: "textarea" },
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
            />
        </div>
    );
};

export default ModSimTab;