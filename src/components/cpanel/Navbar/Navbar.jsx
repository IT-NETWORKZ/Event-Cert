import { useState, useRef, useEffect } from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { superAdminlogout } from "../../../api/authService"; // Adjust import path to match your file structure

import {
    FaBars,
    FaUserCircle,
    FaUser,
    FaLock,
    FaSignOutAlt
} from "react-icons/fa";

function Navbar({
    collapsed,
    setCollapsed,
    toggled,
    setToggled
}) {
    const [showMenu, setShowMenu] = useState(false);

    const menuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        function handleClickOutside(e) {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target)
            ) {
                setShowMenu(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    const handleResetPassword = () => {
        setShowMenu(false);
        navigate("/cpanel/resetpassword");
    };

    const handleLogout = async () => {
        setShowMenu(false);
        try {
            await superAdminlogout(); // Calls API, clears tokens and user profile data securely
        } catch (error) {
            console.error("Error during logout process:", error);
        } finally {
            navigate("/cpanel", { replace: true }); // Redirect to CPanel login page
        }
    };

    return (
        <div className="admin-navbar">
            {/* Left Section */}
            <div className="navbar-left">
                <button
                    type="button"
                    className="menu-btn"
                    onClick={() => {
                        if (window.innerWidth <= 768) {
                            setToggled(!toggled);
                        } else {
                            setCollapsed(!collapsed);
                        }
                    }}
                    aria-label="Toggle sidebar"
                >
                    <FaBars />
                </button>
            </div>

            {/* Profile Section */}
            <div
                className="navbar-profile"
                ref={menuRef}
            >
                <button
                    type="button"
                    className="profile-trigger"
                    onClick={() => setShowMenu((prev) => !prev)}
                    aria-expanded={showMenu}
                    aria-haspopup="true"
                >
                    <span>Welcome User</span>
                    <FaUserCircle className="user-icon" />
                </button>

                {showMenu && (
                    <div className="profile-dropdown">
                        <button
                            type="button"
                            onClick={handleResetPassword}
                        >
                            <FaLock />
                            <span>Reset Password</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleLogout}
                        >
                            <FaSignOutAlt />
                            <span>Logout</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Navbar;