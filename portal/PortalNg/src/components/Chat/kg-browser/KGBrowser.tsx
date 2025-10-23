// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import { useEffect, useState } from 'react';
import { KGObject } from '../shared/interfaces';
import { BACKEND_RESOURCES } from '../shared/constants';
import KGObjectDisplay from './KGObjectDisplay';
import DataSourceList from './DataSourceList';
import Breadcrumbs from './Breadcrumbs';
import Ping from '../Ping';


export default function KGBrowser({
    activeObject,
    paginationPage,
    onUpdateActiveObject,    
    onUpdatePaginationPage,
} : {
    activeObject: KGObject | null,
    paginationPage: number,    
    onUpdateActiveObject: (newValue: KGObject | null) => void,
    onUpdatePaginationPage: (newValue: number) => void,

}) {

    const [dataSources, setDataSources] = useState<KGObject[]>([])

    // fetch the top-level data sources for browsing when the page opens
    useEffect(() => {
        const getDataSources = async () => {
            const url = BACKEND_RESOURCES.kg.url + `list-data-sources`;
            const response = await fetch(url)
            const data = await response.json();
            setDataSources(data)
        }
        getDataSources();
    }, []);


    return (
        <div>
            <div>
                {activeObject ? (
                    <div>
                        <Breadcrumbs
                            activeObject={activeObject}
                            onUpdateActiveObject={onUpdateActiveObject}

                        />
                        <div>
                            {!activeObject.title ? (
                                <div className="mx-auto mt-12">
                                    <div className="flex justify-center">
                                        <Ping />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {activeObject && (
                                        <div className="mt-6">
                                            <KGObjectDisplay
                                                activeObject={activeObject}
                                                paginationPage={paginationPage}
                                                onUpdateActiveObject={onUpdateActiveObject}
                                                onUpdatePaginationPage={onUpdatePaginationPage}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <DataSourceList
                        dataSources={dataSources}
                        onUpdateActiveObject={onUpdateActiveObject}
                    />
                )}
            </div>
        </div>
    )
}
