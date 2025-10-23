// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import React, { useState, useEffect } from 'react';
import { fetchResourcesWithCategories, searchResources } from '../services/resourceLibraryService';
import axiosInstance from '../api/axios';
import ButtonBasic1 from "../components/elements/ButtonBasic1";

interface Resource {
  fileId: string;
  fileName: string;
  description?: string;
  categoryName?: string;
}

function ResourceLibraryPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Resource[]>([]);

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleSearch = async () => {
    if (searchTerm) {
      try {
        const results = await searchResources(searchTerm);
        setSearchResults(results);
      } catch (error) {
        console.error("Error during the search:", error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchResourcesWithCategories();
        setResources(data.resources);
        if (data.resources.length > 0 && data.resources[0].categoryName) {
          setExpandedCategory(data.resources[0].categoryName);
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    };

    fetchData();
  }, []);

  return (
      <div className='page-component dark:bg-slate-800'>
        <div className="p-10">
          <h2 className="text-4xl mb-8 text-gray-800 dark:text-white">Resource Library</h2>
          <div className="flex mb-8">
            <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="input input-bordered input-lg dark:bg-gray-700 border-gray-300 rounded-md px-3 py-2"
            />

           <div className="ml-5"> <ButtonBasic1  label="Search" color="btn-primary" onClick={handleSearch}/></div>
          </div>
          {!searchTerm && (
              <div className='mt-6'>
                {resources.length === 0 ? (
                    <div className="text-center text-gray-800 dark:text-white">
                      There are no documents to show.
                    </div>
                ) : (Object.entries(resources.reduce((acc, resource) => {
                  const { categoryName = 'No category' } = resource;
                  acc[categoryName] = acc[categoryName] || [];
                  acc[categoryName].push(resource);
                  return acc;
                }, {} as Record<string, Resource[]>)).map(([category, resources]) => (
                    <div key={category} className='mt-4'>
              <span className={`text-lg my-2 cursor-pointer ${expandedCategory === category ? 'font-semibold' : ''}`}
                    onClick={() => toggleCategory(category)}>
                {expandedCategory === category ? '(-)' : '(+)'} {category}
              </span>
                      {expandedCategory === category && (
                          <div className="pl-5">
                            {resources.map(resource => (
                                <div key={resource.fileId} className="mb-4 hover:bg-gray-300 dark:hover:bg-gray-700 p-6">
                                  <strong>File:</strong> {resource.fileName}
                                  <div className="dark:text-gray-300">
                                    <strong>Description:</strong> {resource.description || 'No description'}
                                  </div>
                                  <a href={`${axiosInstance.defaults.baseURL}/Documents/${resource.fileName}`}
                                     target="_blank" rel="noopener noreferrer" className="link link-primary">view pdf</a>
                                </div>
                            ))}
                          </div>
                      )}
                    </div>
                )))}
              </div>
          )}
          {searchTerm && (
              <div className='m-11 mt-6'>
                {searchResults.map(resource => (
                    <div key={resource.fileId} className="mb-4 rounded hover:bg-gray-300 dark:hover:bg-gray-700 p-6">
                      <strong>File:</strong> {resource.fileName}
                      <div className="dark:text-gray-300">
                        <strong>Description:</strong> {resource.description || 'No description'}
                      </div>
                      <a href={`${axiosInstance.defaults.baseURL}/Documents/${resource.fileName}`} target="_blank"
                         rel="noopener noreferrer" className="link link-primary">view pdf</a>
                    </div>
                ))}
              </div>
          )}
        </div>

      </div>
  );
}

export default ResourceLibraryPage;