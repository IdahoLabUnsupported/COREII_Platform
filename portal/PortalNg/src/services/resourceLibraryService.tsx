// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import axios from '../api/axios'; 

export const uploadFiles = async (files, categoryId) => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }
  formData.append('categoryId', categoryId);

  try {
    const response = await axios.post('api/resourceLibrary/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; 
  } catch (error) {
    console.error('Upload error:', error.response.data);
    throw error; 
  }
};

// Function to fetch resources with their categories
export const fetchResourcesWithCategories = async () => {
  try {
    const response = await axios.get('/api/ResourceLibrary/');
    return response.data;
  } catch (error) {
    console.error("Could not fetch resources:", error);
    throw error;
  }
};

export const updateResource = async (resource, id) => {
  try {
      const url = `/api/resourceLibrary/update/${id}`;
      const response = await axios.post(url, resource);
      return response.data;
  } catch (error) {
      console.error('Update error:', error);
      console.error('Update error details:', error.response ? error.response.data : 'No response data');
      throw error;
  }
};

export const searchResources = async (searchTerm) => {
  try {
    const response = await axios.get(`/api/resourceLibrary/search`, {
      params: { term: searchTerm }
    });
    return response.data;
  } catch (error) {
    console.error("Error searching resources:", error);
    throw error;
  }

};
export const deleteResources = async (ids) => {
  try {
    const response = await axios.delete('/api/resourceLibrary/deleteList', {
      data: ids,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to delete resources: ${error.response ? error.response.data : error.message}`);
  }

}