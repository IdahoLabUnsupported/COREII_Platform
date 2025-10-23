// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const authIsDisabled = import.meta.env.VITE_DISABLE_AUTH === "true";
const portalApiUrl = import.meta.env.VITE_PORTAL_API_URL ?? "https://portal-api.caiser.ornlkdi.org";

const axiosInstance = axios.create({
  baseURL: portalApiUrl,
});

axiosInstance.interceptors.request.use(function (config) {
  if (config.url == "api/auth/login" || authIsDisabled) { return config }

  const token = localStorage.getItem("token")

  if (!token) {
    window.location.href = "/login"
  }

  let decodedToken = jwtDecode(token);
  let currentDate = new Date();

  // JWT exp is in seconds
  if (decodedToken.exp * 1000 < currentDate.getTime()) {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  config.headers.Authorization = "Bearer " + token;

  return config;
});

export default axiosInstance