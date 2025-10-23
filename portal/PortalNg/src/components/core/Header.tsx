// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
// React
import * as React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
// Custom Components
import ThemeToggle from "./ThemeToggle";

type Props = object;

const Header: React.FC<Props> = () => {
    // const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        // logout(); // Clear authentication state
        navigate("/login"); // Redirect to login page
    };

    return (
        <>
            <div className="navbar bg-primary text-primary-content sticky top-0 z-1000">
                <Link
                    to="/"
                    className="btn btn-ghost ml-2 p-0 normal-case rounded-full border-none logo-btn"
                >
                     <img className="h-8" src={import.meta.env.BASE_URL + "/white-onyx.png"} alt="CyOTE logo" />
                </Link>

                <Link
                    to="/"
                    className="btn btn-ghost px-2 mx-1 normal-case btn-sm text-xl text-white"
                >
                    COREII Portal
                </Link>
                <div className="ml-auto">
                    <ThemeToggle />
                </div>
                <div>
                    {/* {user ? (
        <div>
          Welcome, {user.userName}! <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div><Link to='/login'> Please log in</Link></div>
      )} */}
                </div>
            </div>
        </>
    );
};

export default Header;
