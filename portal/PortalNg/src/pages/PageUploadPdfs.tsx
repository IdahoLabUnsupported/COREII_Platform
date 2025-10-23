// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { fetchResourcesWithCategories, uploadFiles, updateResource, deleteResources } from '../services/resourceLibraryService';
import ButtonBasic1 from '../components/elements/ButtonBasic1';
import EditModalPdf from '../components/Modal/EditModalPdf';
import { useTheme } from "../contexts/useTheme";
import ButtonIcon from "../components/elements/ButtonIcon";

function PageUploadPdfs() {
  const { theme } = useTheme();
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editResource, setEditResource] = useState<any>(null); // For storing the resource being edited
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const gridApiRef = useRef<any>(null);
  const excludedFields = ['filePath', 'fileId', 'comments', 'categoryId', 'publishDate', 'shortName', 'description','docVersion','sourceType','name'];

  const fetchResources = async () => {
    try {
      const data = await fetchResourcesWithCategories();
      setResources(data.resources);
      setCategories(data.categories);
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
  };

  useEffect(() => {
    fetchResources().catch(error => console.error("Error in useEffect:", error));
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const pdfFiles = files.filter((file: File) => file.type === "application/pdf");

    if (pdfFiles.length !== files.length) {
      setUploadError("Only PDF files are allowed.");
    } else {
      setUploadError("");
      setIsLoading(true);
      try {
        const categoryId = editResource?.categoryId || categories[0]?.category_Id; // Ensure categoryId is available

        await uploadFiles(pdfFiles, categoryId);
        await fetchResources(); // Refresh the resources after uploading
      } catch (error) {
        setUploadError('Failed to upload files. ' + error.message);
      } finally {
        setIsLoading(false);
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEditClick = (resource: any) => {
    setEditResource(resource);
    setIsModalOpen(true);
  };

  const handleSave = async (updatedResource: any) => {
    try {
      await updateResource(updatedResource, updatedResource.fileId);
      setIsModalOpen(false);
      await fetchResources(); // Refresh the resources after saving
    } catch (error) {
      console.error('Failed to update resource:', error);
    }
  };

  const handleDelete = async () => {
    const selectedNodes = gridApiRef.current.getSelectedNodes();
    const selectedIds = selectedNodes.map((node: any) => node.data.fileId);
    try {
      await deleteResources(selectedIds);
      await fetchResources(); // Refresh the resources after deletion
    } catch (error) {
      console.error('Failed to delete resources:', error);
    }
  };
  const showDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeleteModalOpen(false);
    await handleDelete();
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };
  const capitalize = (str: string) => {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  };

  const columns = resources.length > 0 ? [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 50,
      flex: 1
    },
    ...Object.keys(resources[0]).filter(key => !excludedFields.includes(key)).map(key => ({
      headerName: capitalize(key.replace(/([A-Z])/g, ' $1').trim()),
      field: key
    })),
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params: any) => (
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
          </div>
      )
    }
  ] : [];

  return (
      <div className="page-component dark:bg-slate-800">
        <div className="p-10">
          <h2 className="text-4xl mb-8 text-gray-800 dark:text-white">Upload PDFs</h2>
          <input
              type="file"
              multiple
              accept=".pdf"
              ref={fileInputRef}
              className="file-input file-input-bordered file-input-padding file-input-primary w-full max-w-xs dark:bg-slate-800"
              onChange={handleFileChange}
          />
          {uploadError && <div className="alert alert-danger">{uploadError}</div>}
          {isLoading && (
              <div className="flex justify-center items-center mt-4">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
              </div>
          )}
          <div className="flex justify-end mb-4">
            <ButtonBasic1
                label="Delete Selected"
                color="btn-primary"
                onClick={showDeleteModal}
            />
          </div>
          <div
              className={`pt-11 ${theme === "dark" ? "ag-theme-alpine-dark custom-dark" : "ag-theme-alpine custom-light"}`}
              style={{ height: "500px", width: "100%" ,overflow: "auto"}}>
            <AgGridReact
                rowData={resources}
                columnDefs={columns}
                domLayout="autoHeight"
                pagination={false}
                paginationPageSize={10}
                rowSelection={"multiple"}
                onGridReady={params => gridApiRef.current = params.api}
            />
          </div>
          {isModalOpen && (
              <EditModalPdf
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  resource={editResource}
                  categories={categories}
                  onSave={handleSave}
              />
          )}
          {isDeleteModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div
                    className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg border border-gray-300 dark:border-gray-700">
                  <h2 className="text-xl mb-4">Are you sure you want to delete the selected items?</h2>
                  <p>This action cannot be undone.</p>
                  <div className="flex justify-end space-x-4">
                    <ButtonBasic1  label="cancel" color="btn-secondary" onClick={closeDeleteModal}/>
                    <ButtonBasic1  label="delete" color="btn-primary" onClick={confirmDelete}/>
                  </div>
                </div>
              </div>
          )}
        </div>
        </div>
        );
        }

        export default PageUploadPdfs;