// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
//  Added LOTS OF COMMENTS FOR EASIER WAY TO UNDERSTAND THIS COMPONENT 
import React, { useEffect, useState } from "react";
import { getApplications } from "../../services/pageAppService";
import {
    updateApplicationNews,
    updateCoreIINews,
    getLatestCoreIINews,
    deleteCoreIINews,
    editCoreIINews,
    deleteModSim,
    updateExistingAppNews,
    deleteApplicationNews,
   // getLatestAppNews
} from "../../services/newsServices";
import ButtonBasic1 from "../../components/elements/ButtonBasic1";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import ActionsCellRenderer from "./ActionsCellRenderer";
import { useTheme } from "../../contexts/useTheme";
import NewsEditModal from "../Modal/NewsEditModal";
import NewsDeleteModal from "../Modal/NewsDeleteModal";


const ApplicationsTab: React.FC = () => {
    const { theme } = useTheme();

    // ------------- APPLICATION DATA & FORM -------------
    const [applications, setApplications] = useState<
        { applicationId: string; applicationName: string; applicationNews: string }[]
    >([]);
    const [selectedApp, setSelectedApp] = useState<string>("");
    const [newsText, setNewsText] = useState<string>("");

    // ------------- COREII NEWS STATE -------------
    const [coreiiNews, setCoreiiNews] = useState<string>("");
    const [latestCoreiiNews, setLatestCoreiiNews] = useState<any[]>([]);

    // ------------- APPLICATION NEWS STATE (NEW) -------------
    const applicationNewsRows = applications.filter(
        (app: any) => app.applicationNews && app.applicationNews.trim() !== ""
);
    const [latestAppNews, setLatestAppNews] = useState<any[]>([]);

    // ------------- MODAL STATE FOR COREII NEWS -------------
    const [selectedRow, setSelectedRow] = useState<any>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // ------------- MODAL STATE FOR APPLICATION NEWS (NEW) -------------
    const [selectedAppNews, setSelectedAppNews] = useState<any>({});
    const [isAppNewsEditModalOpen, setIsAppNewsEditModalOpen] = useState(false);
    const [isAppNewsDeleteModalOpen, setIsAppNewsDeleteModalOpen] = useState(false);

    // ------------- DATA FETCHING -------------
    useEffect(() => {
        const fetchApps = async () => {
            try {
                const apps = await getApplications();
                // console.log(apps)
                setApplications(apps);
                // Also derive application news rows
                const appNews = apps.filter(
                    (app: any) => app.applicationNews && app.applicationNews.trim() !== ""
            );
                setLatestAppNews(appNews);
            } catch (error) {
                console.error("Error fetching applications:", error);
            }
        };

        const fetchCoreNews = async () => {
            try {
                const response = await getLatestCoreIINews();
                if (response.status === 200) {
                    setLatestCoreiiNews(response.data);
                }
            } catch (error) {
                console.error("Error fetching COREII news:", error);
            }
        };

        fetchApps();
        fetchCoreNews();
    }, []);

    // ------------- HANDLERS: APPLICATION NEWS FORM -------------
    const handleAppChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedApp(event.target.value);
    };

    const handleSubmitApp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedApp || !newsText.trim()) {
            alert("Please select an application and enter news text.");
            return;
        }
        try {
            const formData = new FormData();
            formData.append("ApplicationId", selectedApp);
            formData.append("ApplicationNews", newsText.trim());
            const response = await updateApplicationNews(formData);
            if (response.status === 200) {
                alert("Application news added successfully!");
                setNewsText("");
                // Refresh applications and update latest app news
                const apps = await getApplications();
                setApplications(apps);
                const appNews = apps.filter(
                    (app: any) => app.applicationNews && app.applicationNews.trim() !== ""
            );
                setLatestAppNews(appNews);
            } else {
                alert("Failed to add application news.");
            }
        } catch (error: any) {
            console.error("Error updating application news:", error);
            alert("An error occurred while updating application news.");
        }
    };

    // ------------- HANDLERS: COREII NEWS -------------
    const handleSubmitCoreIINews = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!coreiiNews.trim()) {
            alert("Please enter COREII news.");
            return;
        }
        try {
            const formData = new FormData();
            formData.append("NewsContent", coreiiNews);
            const response = await updateCoreIINews(formData);
            if (response.status === 200) {
                alert("COREII news updated successfully!");
                setCoreiiNews("");
                const res = await getLatestCoreIINews();
                if (res.status === 200) {
                    setLatestCoreiiNews(res.data);
                }
            } else {
                alert("Failed to update COREII news.");
            }
        } catch (error: any) {
            console.error("Error updating COREII news:", error);
            alert("An error occurred while updating COREII news.");
        }
    };

    const handleEditNews = (data: any) => {
        setSelectedRow(data);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (updatedData: { [key: string]: any }) => {
        try {
            const id = updatedData.newsId || selectedRow.newsId;
            const formDataToSend = new FormData();
            formDataToSend.append("NewsId", id);
            formDataToSend.append("NewsContent", updatedData.newsContent);
            const response = await editCoreIINews(formDataToSend);
            if (response.status === 200) {
                alert("COREII news updated successfully.");
                setIsModalOpen(false);
                const res = await getLatestCoreIINews();
                if (res.status === 200) {
                    setLatestCoreiiNews(res.data);
                }
            } else {
                alert("Failed to update COREII news.");
            }
        } catch (error: any) {
            console.error("Error updating COREII news:", error);
            alert(`Error updating COREII news: ${error.response?.data || error.message}`);
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            const response = await deleteCoreIINews(selectedRow.newsId.toString());
            if (response.status === 200) {
                alert("COREII news deleted successfully.");
                setIsDeleteModalOpen(false);
                const res = await getLatestCoreIINews();
                if (res.status === 200) {
                    setLatestCoreiiNews(res.data);
                }
            } else {
                alert("Failed to delete COREII news.");
            }
        } catch (error: any) {
            console.error("Error deleting COREII news:", error);
            alert(`Error deleting COREII news: ${error.response?.data || error.message}`);
        }
    };

    const handleDelete = (data: any) => {
        setSelectedRow(data);
        setIsDeleteModalOpen(true);
    };

    // ------------- HANDLERS: APPLICATION NEWS (NEW) -------------
    const handleEditAppNews = (data: any) => {

        // setSelectedAppNews(data);
        setSelectedAppNews({
            ...data,
            // Map the lowercase property to the field expected by the modal.
            ApplicationNews: data.applicationNews
        });
        setIsAppNewsEditModalOpen(true);
    };

    const handleDeleteAppNews = (data: any) => {
        setSelectedAppNews(data);
        setIsAppNewsDeleteModalOpen(true);
    };

    const handleAppNewsModalSubmit = async (updatedData: { [key: string]: any }) => {
        try {
            const id = updatedData.ApplicationId || selectedAppNews.applicationId;
            const formDataToSend = new FormData();
            formDataToSend.append("ApplicationId", id);
            formDataToSend.append("ApplicationNews", updatedData.ApplicationNews);
            const response = await updateExistingAppNews(formDataToSend);
            if (response.status === 200) {
                alert("Application news updated successfully.");
                setIsAppNewsEditModalOpen(false);
                const apps = await getApplications();
                setApplications(apps);
                const appNews = apps.filter(
                    (app: any) => app.applicationNews && app.applicationNews.trim() !== ""
            );
                setLatestAppNews(appNews);
            } else {
                alert("Failed to update application news.");
            }
        } catch (error: any) {
            console.error("Error updating application news:", error);
            alert(`Error updating application news: ${error.response?.data || error.message}`);
        }
    };

    const handleAppNewsDeleteConfirm = async () => {
        try {
            const response = await deleteApplicationNews(selectedAppNews.applicationId.toString());
            if (response.status === 200) {
                alert("Application news deleted successfully.");
                setIsAppNewsDeleteModalOpen(false);
                const apps = await getApplications();
                setApplications(apps);
                const appNews = apps.filter(
                    (app: any) => app.applicationNews && app.applicationNews.trim() !== ""
            );
                setLatestAppNews(appNews);
            } else {
                alert("Failed to delete application news.");
            }
        } catch (error: any) {
            console.error("Error deleting application news:", error);
            alert(`Error deleting application news: ${error.response?.data || error.message}`);
        }
    };

    // ------------- COLUMN DEFINITIONS -------------
    // COREII News Grid Columns
    const coreiiNewsColumns: ColDef[] = [
        {
            headerName: "COREII News Content",
    field: "newsContent",
    flex: 1,
        cellRenderer: (params) => (
        <div
            className="whitespace-normal overflow-visible"
                    dangerouslySetInnerHTML={{ __html: params.value }}
    />
)
},
    {
        headerName: "Actions",
        field: "newsContent",
        flex: 1,
            cellRenderer: (params) => (
        <ActionsCellRenderer
            data={params.data}
            onEdit={handleEditNews}
            onDelete={handleDelete}
        />
    )
    }
];

    // Application News Grid Columns
    const appNewsColumns: ColDef[] = [

        {
            headerName: "Application Name",
            field: "applicationName",
            flex: 1
        }, {
            headerName: "Application News",
    field: "applicationNews",
    flex: 1
},
    {
        headerName: "Actions",
        field: "applicationNews",
        flex: 1,
            cellRenderer: (params) => (
        <ActionsCellRenderer
            data={params.data}
            onEdit={handleEditAppNews}
            onDelete={handleDeleteAppNews}
        />
    )
    }
];

    return (
        <div className="m-4 pb-6">
            <div className="w-[80%]">

    <form onSubmit={handleSubmitApp} className="space-y-4 w-[60%]">
<div className="form-control">
<label className="label text-gray-800 dark:text-white" htmlFor="applicationSelect">
    Select Application
    </label>
    <select
        id="applicationSelect"
                        value={selectedApp}
    onChange={handleAppChange}
    className="select select-bordered bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
>
<option value="" disabled>
    Select an application
    </option>
    {applications.map((app) => (
        <option key={app.applicationId} value={app.applicationId}>
            {app.applicationName}
        </option>
    ))}
</select>
</div>
    <div className="form-control">
<label className="label text-gray-800 dark:text-white" htmlFor="newsText">
    Application News
    </label>
    <textarea
        id="newsText"
                        name="newsText"
                        value={newsText}
    onChange={(e) => setNewsText(e.target.value)}
    placeholder="Enter application news"
                        className="textarea textarea-bordered w-full bg-gray-300 dark:bg-gray-900 text-black dark:text-white h-28 p-2 mb-4 mt-4"
    required
    />
    </div>
    <ButtonBasic1 label="Submit Application News" target="submit" color="btn-primary" />
</form>

    {/* ---------- COREII News Form ---------- */}
    <form onSubmit={handleSubmitCoreIINews} className="space-y-4 mt-10 w-[60%]">
    <div className="form-control">
<label className="label text-gray-800 dark:text-white">
    Upload COREII News
    </label>
    <textarea
        value={coreiiNews}
        onChange={(e) => setCoreiiNews(e.target.value)}
        placeholder="Upload COREII News"
                        className="textarea textarea-bordered w-full bg-gray-300 dark:bg-gray-900 text-black dark:text-white h-28 p-2 mb-4 mt-4"
    required
    />
    </div>
    <ButtonBasic1 label="Submit COREII News" target="submit" color="btn-primary" />
</form>

    {/* ---------- COREII News Grid ---------- */}
    <div
        className={`pt-11 ${theme === "dark" ? "ag-theme-alpine-dark custom-dark" : "ag-theme-alpine custom-light"}`}
        style={{ height: "auto", width: "100%" }}
    >
        <AgGridReact
            rowData={latestCoreiiNews}
            columnDefs={coreiiNewsColumns}
            domLayout="autoHeight"
            />
    </div>

    {/* ---------- Application News Grid (NEW) ---------- */}
    <div
        className={`pt-11 ${theme === "dark" ? "ag-theme-alpine-dark custom-dark" : "ag-theme-alpine custom-light"}`}
        style={{ height: "500px", width: "100%" }}
    >
        <AgGridReact
            rowData={applicationNewsRows}
            columnDefs={appNewsColumns}
            domLayout="autoHeight"
            />
    </div>

            </div>

    <NewsEditModal
        isOpen={isModalOpen}
        title="Edit COREII News"
                fields={[{ name: "newsContent", label: "COREII News Content", type: "textarea" }]}
    initialData={selectedRow}
    onClose={() => setIsModalOpen(false)}
    onSubmit={handleModalSubmit}
    />
    <NewsDeleteModal
        isOpen={isDeleteModalOpen}
        title="Delete COREII News"
                message="Are you sure you want to delete this COREII News?"
                onClose={() => setIsDeleteModalOpen(false)}
    onConfirm={handleDeleteConfirm}
    />

    {/* ---------- Application News Modals (NEW) ---------- */}
    <NewsEditModal
        isOpen={isAppNewsEditModalOpen}
        title="Edit Application News"
                fields={[{ name: "ApplicationNews", label: "Application News", type: "textarea" }]}
    initialData={selectedAppNews}
    onClose={() => setIsAppNewsEditModalOpen(false)}
    onSubmit={handleAppNewsModalSubmit}
    />
    <NewsDeleteModal
        isOpen={isAppNewsDeleteModalOpen}
        title="Delete Application News"
                message="Are you sure you want to delete this Application News?"
                onClose={() => setIsAppNewsDeleteModalOpen(false)}
    onConfirm={handleAppNewsDeleteConfirm}
    />

</div>
);
};

export default ApplicationsTab;