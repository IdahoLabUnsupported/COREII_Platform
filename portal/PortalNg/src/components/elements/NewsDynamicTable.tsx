// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import EditModal from "../Modal/NewsEditModal";
import DeleteModal from "../Modal/NewsDeleteModal";

interface DynamicTableProps {
    fetchData: () => Promise<any[]>;
    columnDefs: ColDef[];
    updateData: (updatedItem: any) => Promise<void>;
    deleteData: (id: number) => Promise<void>;
    fields: { label: string; key: string }[];
}

const NewsDynamicTable: React.FC<DynamicTableProps> = ({ fetchData, columnDefs, updateData, deleteData, fields }) => {
    const [rowData, setRowData] = useState<any[]>([]);
    const [selectedRow, setSelectedRow] = useState<any | null>(null);
    const [deleteRow, setDeleteRow] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await fetchData();
                setRowData(data);
            } catch (error) {
                console.error("Error loading table data:", error);
            }
            setLoading(false);
        };

        loadData();
    }, [fetchData]);

    return (
        <div className="ag-theme-alpine dark:ag-theme-alpine-dark" style={{ height: "500px", width: "100%" }}>
    {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-300">Loading data...</p>
    ) : (
        <AgGridReact
            rowData={rowData}
            columnDefs={[
                ...columnDefs,
                {
                    headerName: "Actions",
                field: "actions",
                cellRenderer: (params) => (
                <div className="flex space-x-2">
                <button className="btn btn-sm btn-primary" onClick={() => setSelectedRow(params.data)}>
                Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => setDeleteRow(params.data)}>
                Delete
                </button>
                </div>
                ),
            },
                ]}
            domLayout="autoHeight"
                    rowSelection="single"
                />
    )}

    {selectedRow && (
        //@ts-ignore
        <EditModal item={selectedRow} fields={fields} updateData={updateData} closeModal={() => setSelectedRow(null)} />
    )}

    {deleteRow && (
        //@ts-ignore
        <DeleteModal item={deleteRow} confirmDelete={() => deleteData(deleteRow.id)} closeModal={() => setDeleteRow(null)} />
    )}
</div>
);
};

export default NewsDynamicTable;