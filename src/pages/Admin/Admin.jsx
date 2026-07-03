import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Navbar from "../../components/admin/Navbar/Navbar";
import Sidebar from "../../components/admin/Sidebar/Sidebar";

import "../../css/Admin.css";

const Admin = () => {

    const [collapsed, setCollapsed] = useState(false);
    const [toggled, setToggled] = useState(false);

    const location = useLocation();

    const isCustomPlus = location.pathname === "/admin/customplus";

    return (

        <div className="admin-layout">

            {/* Hide Sidebar */}
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

                {/* Hide Navbar */}
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

export default Admin;