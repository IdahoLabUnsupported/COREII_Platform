// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import axiosInstance from '../api/axios'; 

const authService = {
  async login({ userName, password }) {
    try {
      const response = await axiosInstance.post('api/auth/login', JSON.stringify({
        userName,
        password
      }), {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async register({ userName, password, firstName, lastName }) {
    try {
      // Assuming REGISTER_URL is your endpoint concatenated with axios' baseURL
      const REGISTER_URL = 'api/auth/register'; 
      const response = await axiosInstance.post(REGISTER_URL, JSON.stringify({
        userName,
        password,
        firstName,
        lastName
      }), {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default authService;
