// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import axios from "../api/axios";


const API_BASE_URL = "/api/dataUpload";

export const uploadAIModel = async (formData: FormData) => {
    return await axios.post(`${API_BASE_URL}/aiUploads`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};
export const GetAIModels = async () => {
    return await axios.get(`${API_BASE_URL}/GetAIModels`);
};
export const updateAiModel = async (formData: FormData) => {
    return await axios.post(`${API_BASE_URL}/updateAiModel`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
});
};

export const deleteAiModel = async (id: string) => {
    return await axios.delete(`${API_BASE_URL}/deleteAiModel/${id}`);
};
export const getLatestDatasets = async () => {
    return await axios.get(`${API_BASE_URL}/getDataset`);
};
export const uploadDatasetModel = async (formData: FormData) => {
    return await axios.post(`${API_BASE_URL}/datasetsUploads`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};
export const updateDataset = async (formData: FormData) => {
    return await axios.put(`${API_BASE_URL}/updateDataset`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
});
};

export const deleteDataset = async (id: string) => {
    return await axios.delete(`${API_BASE_URL}/deleteDataset/${id}`);
};
export const GetModSimModels = async () => {
    return await axios.get(`${API_BASE_URL}/GetModSim`);
};
export const uploadModSimData = async (formData: FormData) => {
    return await axios.post(`${API_BASE_URL}/modSimUploads`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};
export const updateModSim = async (formData: FormData) => {
    return await axios.put(`${API_BASE_URL}/updateModSim`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
});
};

export const deleteModSim = async (id: string) => {
    return await axios.delete(`${API_BASE_URL}/deleteModSim/${id}`);
};
export const updateApplicationNews = async (formData: FormData) => {
    return await axios.post(`${API_BASE_URL}/updateAppNews`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};
export const updateCoreIINews = async (formData: FormData) => {
    return await axios.post(`${API_BASE_URL}/updateCoreIINews`,  formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};
export const getLatestCoreIINews = async () => {
    return await axios.get(`${API_BASE_URL}/getLatestCoreIINews`);
};

export const deleteCoreIINews = async (id: string) => {
    return await axios.delete(`${API_BASE_URL}/deleteCoreIINews/${id}`);
};
export const editCoreIINews = async (formData: FormData) => {
    return await axios.post(`${API_BASE_URL}/editCoreIINews`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};

export const updateExistingAppNews = async (formData: FormData) => {
    return await axios.put(`${API_BASE_URL}/updateExistingAppNews`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
});
};

export const deleteApplicationNews = async (id: string) => {
    return await axios.delete(`${API_BASE_URL}/deleteApplicationNews/${id}`);
};