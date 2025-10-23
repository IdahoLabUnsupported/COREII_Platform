// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridApi } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { getApplications, editApplication, deleteApplication, addApplication } from "../services/pageAppService";
import DOMPurify from 'dompurify';
import { BsFillTrashFill, BsFillPencilFill } from 'react-icons/bs';
import ModalEditDashboard from '../components/Modal/ModalEditDashboard';
import ModalAddImages from '../components/Modal/ModalAddImages';
import { useDispatch } from 'react-redux';
import { updatedeleteApplication, setApplications } from '../../app/store/applicationsSlice';
import { useTheme } from '../contexts/useTheme';
import  ButtonBasic1    from '../components/elements/ButtonBasic1';
import ButtonIcon   from "../components/elements/ButtonIcon";

type DataRow = {
    applicationId: number;
    applicationName: string;
    applicationSourceUrl: string;
    textData: string;
    textHelps: string;
    textSummary: string;
    textWorks: string;
    applicationIcon: string;
    // applicationNews:string;
    applicationImages?: string[];
};

type Props = object;

const PageAdminDashboard: React.FC<Props> = () => {
    const [data, setData] = useState<DataRow[]>([]);
    const [editRow, setEditRow] = useState<DataRow | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState<boolean>(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [deleteRow, setDeleteRow] = useState<DataRow | null>(null);
    const [isAddImagesModalOpen, setIsAddImagesModalOpen] = useState<boolean>(false);
    const [expandedRows, setExpandedRows] = useState<number[]>([]);
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const { theme } = useTheme();

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            const data = await getApplications();
            setData(data);
        };
        fetchData();
    }, []);

    const handleEditClick = (row: DataRow) => {
        setEditRow(row);
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    const handleAddClick = () => {
        setEditRow(null);
        setIsEditMode(false);
        setIsModalOpen(true);
    };

    const handleAddImagesClick = () => {
        setIsAddImagesModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditRow(null);
    };

    const closeAddImagesModal = () => {
        setIsAddImagesModalOpen(false);
    };

    const handleModalSubmit = async (formData: DataRow) => {
        try {
            if (isEditMode) {
                await editApplication(formData);
            } else {
                await addApplication(formData);
            }
            const updatedData = await getApplications();
            setData(updatedData);
            dispatch(setApplications(updatedData));
            closeModal();
        } catch (e) {
            console.log(e);
        }
    };

    const openDeleteModal = (row: DataRow) => {
        setDeleteRow(row);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeleteRow(null);
    };

    const confirmDelete = async () => {
        if (deleteRow) {
            try {
                await deleteApplication(deleteRow.applicationId);
                dispatch(updatedeleteApplication(deleteRow.applicationId));
                const updatedData = await getApplications();
                setData(updatedData);
                closeDeleteModal();
            } catch (e) {
                console.log(e);
            }
        }
    };

    const sanitizeHTML = (html: string) => {
        return { __html: DOMPurify.sanitize(html) };
    };

    const ActionsCellRenderer = (params: any) => (
        <div className="flex items-center justify-center space-x-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-full">
                <ButtonIcon
                    label="edit"
                    buttonIcon="edit"
                    color="btn-ghost"
                    buttonSize="btn-sm"
                    onClick={() => handleEditClick(params.data)}
                />
            </div>
            <div className="w-8 h-8 flex items-center justify-center rounded-full">
                <ButtonIcon
                    label="delete"
                    buttonIcon="delete"
                    color="btn-ghost"
                    buttonSize="btn-sm"
                    onClick={() => openDeleteModal(params.data)}
                />
            </div>
        </div>
    );

    const toggleRowExpansion = (applicationId: number) => {
        setExpandedRows(prevExpandedRows =>
            prevExpandedRows.includes(applicationId)
                ? prevExpandedRows.filter(id => id !== applicationId)
                : [...prevExpandedRows, applicationId]
        );

        if (gridApi) {
            gridApi.resetRowHeights();
        }
    };

    const onRowClicked = (params: any) => {
        toggleRowExpansion(params.data.applicationId);
    };

// Function to dynamically set the row height based on the text length
    const getRowHeight = (params: any) => {
        if (expandedRows.includes(params.data.applicationId)) {
            const textLength = (params.data.textData || '').length + (params.data.textHelps || '').length +
                (params.data.textSummary || '').length + (params.data.textWorks || '').length;
            const lineHeight = 20; // Approximate line height in pixels
            const padding = 20; // Additional padding
            return Math.min(Math.max((textLength / 100) * lineHeight + padding, 100), 1000);
        }
        return 50;
    };

    const columnDefs: ColDef[] = [
        { headerName: "Application Name", field: "applicationName", flex: 1 },
        { headerName: "Application Source URL", field: "applicationSourceUrl", flex: 1 },
        { headerName: "Text Data", field: "textData", flex: 1, cellRenderer: params => <div className="whitespace-normal overflow-visible" dangerouslySetInnerHTML={sanitizeHTML(params.value)} /> },
        { headerName: "Text Helps", field: "textHelps", flex: 1, cellRenderer: params => <div className="whitespace-normal overflow-visible" dangerouslySetInnerHTML={sanitizeHTML(params.value)} /> },
        { headerName: "Text Summary", field: "textSummary", flex: 1, cellRenderer: params => <div className="whitespace-normal overflow-visible" dangerouslySetInnerHTML={sanitizeHTML(params.value)} /> },
        { headerName: "Text Works", field: "textWorks", flex: 1, cellRenderer: params => <div className="whitespace-normal overflow-visible" dangerouslySetInnerHTML={sanitizeHTML(params.value)} /> },
        // { headerName: "Application News", field: "applicationNews", flex: 1, cellRenderer: params => <div className="whitespace-normal overflow-visible" dangerouslySetInnerHTML={sanitizeHTML(params.value)} /> },
        { headerName: "Actions", field: "applicationId", flex: 1, cellRenderer: ActionsCellRenderer }
    ];

    return (
        <div className='page-component dark:bg-slate-800'>
            <div className="p-10">
                <div className="col-span-1 flex items-center justify-between">
                    <h2 className="text-4xl mb-8 text-gray-800 dark:text-white">Applications Cards Admin</h2>
                    <div className="flex justify-end pt-4 space-x-2">
                        <ButtonBasic1
                            label="Add Application"
                            color="btn-primary"

                            onClick={handleAddClick}
                        />
                        <ButtonBasic1
                            label="Add Images"
                            color="btn-secondary"
                            onClick={handleAddImagesClick}
                        />

                    </div>
                </div>
                <div className={`pt-11 ${theme === 'dark' ? "ag-theme-alpine-dark custom-dark" : "ag-theme-alpine custom-light"}`}
                     style={{ height: "500px", width: "100%" }}>
                    <AgGridReact
                        rowData={data}
                        columnDefs={columnDefs}
                        onGridReady={params => setGridApi(params.api)}
                        onRowClicked={onRowClicked}
                        getRowHeight={getRowHeight}
                        domLayout="autoHeight"
                        rowSelection={"single"}
                    />
                </div>
            </div>
            {isModalOpen && (
                <ModalEditDashboard
                    closeModal={closeModal}
                    onSubmit={handleModalSubmit}
                    defaultValue={editRow}
                />
            )}
            {isAddImagesModalOpen && (
                <ModalAddImages
                    closeModal={closeAddImagesModal}
                />
            )}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg border border-gray-300 dark:border-gray-700">
                        <h2 className="text-xl mb-4">Are you sure you want to delete this application?</h2>
                        <p>This action can not be undone.</p>
                        <div className="flex justify-end space-x-4">
                            <ButtonBasic1  label="cancel" color="btn-secondary" onClick={closeDeleteModal}/>
                            <ButtonBasic1  label="delete" color="btn-primary" onClick={confirmDelete}/>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PageAdminDashboard;
