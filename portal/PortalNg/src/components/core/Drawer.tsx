// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../../../app/hooks/reduxTypescriptHooks';
import { RootState } from '../../../app/store';
import { getApplications } from '../../services/pageAppService';
import { setApplications } from '../../../app/store/applicationsSlice';
import { ThemeContextBlock } from "../../contexts/ThemeContextBlock";

const Drawer = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const applications = useAppSelector((state: RootState) => state.applications.applications);
    const { isDrawerCollapsed, setIsDrawerCollapsed, setIsChatOpen } = React.useContext(ThemeContextBlock);
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
        '1': true,
        '2': false,
        '3': false,
    });



    const toggleDropdown = (id: string) => {
        setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const toggleCollapse = () => {

        setIsDrawerCollapsed(!isDrawerCollapsed);
        if (!isDrawerCollapsed) {
            setIsChatOpen(false)
        }
    };

    const handleIconClick = (id: string, link: string) => {
        if (isDrawerCollapsed) {
            navigate(link)
            setIsChatOpen(false)
            setOpenSections({ ...openSections, [id]: true });

        } else {
            toggleDropdown(id);
        }
    };

    const isActive = (path: string) => {
        const currentPath = location.pathname;
        return currentPath === path ? 'bg-gray-300 dark:bg-gray-700' : '';
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await getApplications();
            dispatch(setApplications(data));
        };
        fetchData();
    }, [dispatch]);
    const Accordion = ({
        id,
        title,
        content,
        actionButtonComponent = null,
        hasActionButton = true,
        customIcon = <span className="material-icons">folder</span>, // Default icon
    }: {
        id: number;
        title: string;
        content: React.ReactNode;
        actionButtonComponent?: React.ReactNode;
        hasActionButton?: boolean;
        customIcon?: React.ReactNode; // Allows passing a custom icon
    }) => {
        return (
            <li className={`rounded-lg hover:bg-slate-300 dark:hover:bg-slate-800 ${openSections[id] ? 'open' : ''}`}>
                <div className="px-2 flex justify-between items-center cursor-pointer" onClick={() => toggleAccordion(id)}>
                    <span className="flex items-center h-[32px]">
                        {/* Render custom icon */}
                        {customIcon}
                        {!isDrawerCollapsed && <span className="ml-2">{title}</span>}
                    </span>
                    {!isDrawerCollapsed && (
                        <div className="flex items-center gap-1">
                            {hasActionButton && actionButtonComponent}
                            <span className={`material-icons ${openSections[id] ? 'rotate-180' : ''} transition-transform`}>expand_more</span>
                        </div>
                    )}
                </div>
                {!isDrawerCollapsed && openSections[id] && <ul className="pl-3">{content}</ul>}
            </li>
        );
    };
    // Expand drawer if it's collapsed and an accordion is clicked; open the accordion if closed
    const toggleAccordion = (id: number) => {
        // If the drawer is collapsed, expand it and ensure the accordion is open
        if (isDrawerCollapsed) {
            setIsDrawerCollapsed(false)
            setOpenSections((prevState) => ({ ...prevState, [id]: true })); // Ensure the accordion is open
        } else {
            // Only toggle the accordion if it's not open
            setOpenSections((prevState) => ({ ...prevState, [id]: !prevState[id] }));
        }
    };

    return (
        <aside className={`bg-slate-300 dark:bg-gray-950 text-base-content ${isDrawerCollapsed ? 'w-18' : 'w-80'}  flex-shrink-0`} style={{ height: '100%' }} >
            {/*style={{ height: 'calc(100vh - 64px)' }}*/}
            <div className="flex flex-col justify-between h-full">
                <div>
                    <ul className="menu text-gray-800 dark:text-gray-200">
                        <li>
                            <button
                                onClick={toggleCollapse}
                                className="flex items-center justify-center w-[40px] h-[40px] rounded-lg ml-auto my-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                            >
                                <span className="material-icons">
                                    {isDrawerCollapsed ? 'menu' : 'menu_open'}
                                </span>
                            </button>
                        </li>
                        <li>
                            <Link
                                to={'/'}
                                className={`px-2 h-[48px] !gap-0 flex items-center hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive('/')}`}
                            >
                                <span className="material-icons">
                                    {isDrawerCollapsed ? 'dashboard' : 'dashboard'}
                                </span>
                                {!isDrawerCollapsed &&
                                    <span className={`whitespace-nowrap overflow-hidden ml-2`}>GETTING STARTED</span>}
                            </Link>
                        </li>
                        <li className={`py-2  ${isDrawerCollapsed ? 'w-[40px]' : ''} rounded ${openSections['1'] ? 'open' : ''}`}>
                            <div className={`px-2 !gap-0 flex justify-between items-center cursor-pointer`}

                                onClick={() => handleIconClick('1', '/dashboard')}>
                                <span className="flex items-center h-[32px]">
                                    <span className="material-icons">
                                        {isDrawerCollapsed ? 'folder' : 'folder'}
                                    </span>
                                    {!isDrawerCollapsed && <span className="ml-2">CORE II APPLICATIONS</span>}
                                </span>
                                {!isDrawerCollapsed && (
                                    <span
                                        className={`material-icons ${openSections['1'] ? 'rotate-180' : ''} transition-transform`}>expand_more</span>
                                )}
                            </div>
                            {!isDrawerCollapsed && openSections['1'] && (
                                <ul className="pl-4 link-container">

                                    <li className="mb-1 rounded">

                                        <Link to="/dashboard"
                                            className={`px-2 !gap-0 text-black dark:text-white ${isActive("/dashboard")}`}>
                                            APPLICATIONS DASHBOARD
                                        </Link>
                                    </li>
                                    {applications.map(app => (
                                        <li key={app.applicationId}
                                            className="mb-1 rounded pl-3">
                                            <Link to={`/${app.applicationName.toLowerCase()}`}
                                                className={`px-2 !gap-0 text-black dark:text-white ${isActive(`/${app.applicationName.toLowerCase()}`)}`}>
                                                {app.applicationName}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                        {/* <li>
                            <Link
                                to={"/resourceLibrary"}
                                className={`px-2 h-[48px] !gap-0 flex items-center hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive('/resourceLibrary')}`}
                            >
                                <span className="material-icons">
                                    {isDrawerCollapsed ? 'library_books' : 'library_books'}
                                </span>
                                {!isDrawerCollapsed &&
                                    <span className={`whitespace-nowrap overflow-hidden ml-2`}>RESOURCE LIBRARY</span>}
                            </Link>
                        </li> */}
                        <li className={`${isDrawerCollapsed ? 'w-[40px]' : ''} rounded ${openSections['2'] ? 'open' : ''}`}>
                            <div className={`px-2 mb-1 !gap-0 flex justify-between items-center cursor-pointer`}
                                onClick={() => handleIconClick('2', '/dashboardAdmin')}>
                                <span className="flex items-center h-[32px]">
                                    <span className="material-icons">
                                        {isDrawerCollapsed ? 'build' : 'build'}
                                    </span>
                                    {!isDrawerCollapsed && <span className="ml-2">TOOLS</span>}
                                </span>
                                {!isDrawerCollapsed && (
                                    <span
                                        className={`material-icons ${openSections['2'] ? 'rotate-180' : ''} transition-transform`}>expand_more</span>
                                )}
                            </div>
                            {!isDrawerCollapsed && openSections['2'] && (
                                <ul className="pl-4">
                                    {/* <li className="mb-1 rounded">
                                        <Link to={"/upload"}
                                            className={`px-2 !gap-0 text-black dark:text-white ${isActive("/upload")}`}>
                                            <span className="material-icons mr-2">file_upload</span>
                                            RESOURCE LIBRARY UPLOADS
                                        </Link>
                                    </li>
                                    <li className="mb-1 rounded">
                                        <Link to={"/dataupload"}
                                            className={`px-2 !gap-0 text-black dark:text-white ${isActive("/dataupload")}`}>
                                            <span className="material-icons mr-2">file_upload</span>
                                            AI/ML DATA UPLOADS
                                        </Link>
                                    </li> */}
                                    <li className="hover:bg-slate-200 dark:hover:bg-slate-800 rounded">
                                        <Link to={"/dashboardAdmin"}
                                            className={`px-2 !gap-0 text-black dark:text-white ${isActive("/dashboardAdmin")}`}>
                                            <span className="material-icons mr-2">edit</span>
                                            APPLICATIONS CARD ADMIN
                                        </Link>
                                    </li>
                                    <li className="hover:bg-slate-200 dark:hover:bg-slate-800 rounded">
                                        <Link to={"/news"}
                                            className={`px-2 !gap-0 text-black dark:text-white ${isActive("/news")}`}>
                                            <span className="material-icons mr-2">edit</span>
                                            WHAT'S NEW IN COREII
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>
                    </ul>
                </div>
                {!isDrawerCollapsed && (
                    <div>
                        <span
                            className="copyright-box p-2">&copy;{new Date().getFullYear()} Idaho National Laboratory</span>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Drawer;
