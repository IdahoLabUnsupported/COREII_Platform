// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import "./index.css";

import PageDashboard from "./pages/PageDashboard";

//User Management
import UserList from "./components/user-management/user/user-list/user-list";
import RoleList from "./components/user-management/role/role-list/role-list";
import PermissionList from "./components/user-management/permission/permission-list/permission-list";
import DragDropBasic from "./components/elements/drag-drop/DragDropBasic";
import { StrictModeDroppable } from "./components/elements/drag-drop/StrictModeDroppable";
import { store } from "../app/store/index";
import ResourceLibraryPage from './pages/ResourceLibraryPage';
import PageRegister from './pages/PageRegister';
import PageUploadPdfs from './pages/PageUploadPdfs';
import Login from "./pages/PageLogin";
import PageDataUpload from "./pages/PageDataUpload";
import PageDynamicApp from "./pages/PageDynamicApp";
import PageLandingPage from "./pages/PageLandingPage";
import PageDatasets from "./pages/PageDatasets";
import "material-icons";
import "material-symbols";
import "@fontsource/source-sans-pro/400.css"; // Specify weight
import "@fontsource/source-sans-pro/400-italic.css"; // Specify weight and style
import "@fontsource/source-sans-pro/600.css"; // Specify weight
import "@fontsource/source-sans-pro/700.css"; // Specify weight
import "@fontsource/source-sans-pro/900.css"; // Specify weight
import PageRequestAccount from "./pages/PageRequestAccount";
import PageAdminDashboard from "./pages/PageAdminDashboard";
import PageUploadAppImages from "./pages/PageUploadAppImages";
import PageWhatsNewCore from "./pages/PageWhatsNewCore";
import ProtectedRoute from "./services/protectedService"

// Import Store

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter basename="">
                <App>
                    <Routes>
                        <Route path='/login' element={<Login />} />

                        <Route path="/" element={<ProtectedRoute />}>
                            <Route path="/" element={<PageLandingPage />} />
                            <Route path="/dashboard" element={<PageDashboard />} />
                            {/* <Route path="/login" element={<Login />} /> */}
                            <Route path="/users" element={<UserList />} />
                            <Route path="/roles" element={<RoleList />} />
                            <Route
                                path="/permissions"
                                element={<PermissionList />}
                            />
                            <Route path='/upload' element={<PageUploadPdfs />} />
                            <Route path='/resourceLibrary' element={<ResourceLibraryPage />} />
                            <Route path='/register' element={<PageRegister />} />
                            <Route path='/requestAccount' element={<PageRequestAccount />} />
                            <Route path='/dataUpload' element={<PageDataUpload />} />
                            <Route path='/dashboardAdmin' element={<PageAdminDashboard />} />
                            <Route path="/uploadAppImages" element={<PageUploadAppImages />} />
                            <Route path="/:appName" element={<PageDynamicApp />} />
                            <Route path="/datasets" element={<PageDatasets />} />
                            <Route path="/news" element={<PageWhatsNewCore />} />
                        </Route>
                    </Routes>

                </App>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);
