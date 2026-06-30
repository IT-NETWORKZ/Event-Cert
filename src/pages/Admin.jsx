import React from "react";
import Sidebar from "../components/admin/Sidebar/Sidebar";
import Dashboard from "../components/admin/Dashboard/Dashboard";
import "../css/Admin.css";

const Admin = () => {
    return (
        <div className="admin-layout">
            <Sidebar />

            <main className="admin-content">
                <Dashboard />
            </main>
        </div>
    );
};

export default Admin;