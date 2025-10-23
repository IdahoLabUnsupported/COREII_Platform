// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import * as React from "react";
import { useLocation } from "react-router-dom";
import ThemeContextComponent from "../contexts/ThemeContextComponent";

// Custom Components
import Header from "../components/core/Header";
import Drawer from "../components/core/Drawer";
import ChatComponent from "../components/Chat/ChatComponent";

type Props = { children: any };

const MainScaffold: React.FC<Props> = ({ children }) => {
    const location = useLocation();

    const showNavigation =
        location.pathname !== "/register" && location.pathname !== "/login" && location.pathname !== "/requestAccount";
const showChat=location.pathname !=="/";
    return (
        <>
            <ThemeContextComponent>
                   <div
                    className={`flex flex-col h-screen`}
                >
                    { <Header />}

                    <div
                        className={`flex relative overflow-hidden`}
                    >
                        {showNavigation &&<Drawer />}

                        <main
                            className={`flex-1 transition-all dark:bg-gray-800 dark:text-white bg-white text-black `}
                        >
                            {children}
                            {/*{showNavigation && showChat && <ChatComponent />}*/}
                        </main>
                        {/*{showChat && ( <div className="w-1/4 bg-gray-100 dark:bg-gray-900"> <ChatComponent /> </div> )}*/}
                    </div>
                </div>
            </ThemeContextComponent>
        </>
    );
};

export default MainScaffold;
