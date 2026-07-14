import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

// Importing the shared components from your common folder
import Navbar from "../../components/cpanel/Navbar/Navbar";
import Sidebar from "../../components/cpanel/Sidebar/Sidebar";

import "../../css/Admin.css";

const CPanel = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [toggled, setToggled] = useState(false);

    const location = useLocation();

    // Check if the current route is customplus under cpanel
    const isCustomPlus = location.pathname === "/cpanel/customplus";

    return (
        <div className="admin-layout">

            {/* Hide Sidebar on customplus page */}
            {!isCustomPlus && (
                <Sidebar
                    collapsed={collapsed}
                    toggled={toggled}
                    setToggled={setToggled}
                />
            )}

            <div
                className={`admin-main ${
                    !isCustomPlus && collapsed ? "sidebar-collapsed" : ""
                }`}
            >
                {/* Hide Navbar on customplus page */}
                {!isCustomPlus && (
                    <Navbar
                        collapsed={collapsed}
                        setCollapsed={setCollapsed}
                        toggled={toggled}
                        setToggled={setToggled}
                    />
                )}

                <main
                    className={
                        isCustomPlus
                            ? "customplus-page"
                            : "admin-content"
                    }
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default CPanel;