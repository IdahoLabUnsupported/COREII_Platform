// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import axios from '../api/axios'; 

export const getApplicationByName = async (appName:string) => {
    try {
      const response = await axios.get('/api/application/getapp/'+ appName);
      return response.data;
    } catch (error) {
      console.error("Could not fetch resources:", error);
      throw error;
    }
  };

  export const getApplications = async() => {
    try{
      const response = await axios.get('/api/application/getapps')
      return response.data;
    } catch  (error) {
      console.error("Could not fetch resources:", error);
      throw error;
    }
  }

export const editApplication = async ( data:any) => {
  try {
    if (!Array.isArray(data.applicationImages)) {
      data.applicationImages = [];
    }
    const response = await axios.post('/api/application/editapp', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Could not edit application:', error);
    throw error;
  }
};
  export const deleteApplication = async (id:number) => {
    try {
      const response = await axios.delete('/api/application/deleteapp/'+ id);
      return response.data;
    } catch (error) {
      console.error("Could not delete application:", error);
      throw error;
    }
  };


export const addApplication = async (data: any) => {
  try {

    const response = await axios.post('/api/application/addapp', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Could not add application:', error);
    throw error;
  }
};


export const addImages = async (data: FormData) => {
  try {
    const response = await axios.post('/api/application/addimages', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Could not add images:', error);
    throw error;
  }
};
export const uploadIcon = async (applicationId: number, icon: File) => {
  try {
    const formData = new FormData();
    formData.append('applicationId', applicationId.toString());
    formData.append('icon', icon);

    await axios.post('/api/application/uploadicon', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    console.error('Error uploading icon image:', error);
    throw error;
  }
};
export const GetLatestApplications = async() => {
  try{
    const response = await axios.get('/api/application/getlatesApps')
    return response.data;
  } catch  (error) {
    console.error("Could not fetch resources:", error);
    throw error;
  }
}
