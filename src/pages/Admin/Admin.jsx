import React from "react";
import Sidebar from "../../components/admin/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

import "../../css/Admin.css";

const Admin = () => {
    return (
        <div className="admin-layout">

            <Sidebar />

            <main className="admin-content">

                <Outlet />

            </main>

        </div>
    );
};

export default Admin;