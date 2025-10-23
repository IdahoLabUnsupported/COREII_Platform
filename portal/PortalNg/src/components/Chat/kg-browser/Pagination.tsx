// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import { KGObject } from '../shared/interfaces';

export default function Pagination({
        activeObject,
        paginationPage,
        onUpdatePaginationPage,
 } : {
        activeObject: KGObject,
        paginationPage: number,
        onUpdatePaginationPage: (newValue: number) => void,
}) {

    return (
        <div className="flex space-x-4 justify-between text-sm">
            <div className="flex space-x-4">
                <div className="text-muted">
                    Page {paginationPage + 1} / {(activeObject?.pagination?.lastPage ?? 0) + 1}
                </div>    
                {activeObject?.pagination?.firstPage !== activeObject?.pagination?.lastPage && (
                    <div className="flex space-x-4">
                        <div className="min-w-10">
                            {paginationPage > 0 && (
                                <button className="link" onClick={() => {onUpdatePaginationPage(paginationPage - 1)}}>
                                    <span className="mr-1">&#8249;</span>
                                    <span>Prev</span>
                                </button>
                            )}
                        </div>
                        {paginationPage !== activeObject?.pagination?.lastPage && (
                            <button className="link" onClick={() => {onUpdatePaginationPage(paginationPage + 1)}}>
                                <span>Next</span>
                                <span className="ml-1">&#8250;</span>
                            </button>
                        )}
                    </div>
                )}
            </div>
            <div className="text-muted space-x-1">
                <span>Showing items</span>
                <span className="font-bold">{1 + paginationPage * (activeObject?.pagination?.pageSize || 1)}</span>
                <span>-</span>
                <span className="font-bold">{Math.min(((paginationPage + 1) * (activeObject?.pagination?.pageSize ?? 1)), (activeObject?.pagination?.totalCount || 0)) }</span>
                <span>of</span>
                <span>{activeObject?.pagination?.totalCount || 0}</span>
            </div>
        </div>
    );
}