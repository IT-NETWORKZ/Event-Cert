import { useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../../components/admin/Navbar/Navbar";
import Sidebar from "../../components/admin/Sidebar/Sidebar";

import "../../css/Admin.css";

const Admin = () => {

    const [collapsed, setCollapsed] = useState(false);
    const [toggled, setToggled] = useState(false);

    return (

        <div className="admin-layout">

            <Sidebar
                collapsed={collapsed}
                toggled={toggled}
                setToggled={setToggled}
            />

            <div
                className={`admin-main ${collapsed ? "sidebar-collapsed" : ""
                    }`}
            >

                <Navbar
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    toggled={toggled}
                    setToggled={setToggled}
                />


                <main className="admin-content">

                    <Outlet />

                </main>

            </div>

        </div>

    );

};

export default Admin;

// import React from "react";
// import Sidebar from "../../components/admin/Sidebar/Sidebar";
// import { Outlet } from "react-router-dom";

// import "../../css/Admin.css";

// const Admin = () => {
//     return (
//         <div className="admin-layout">

//             <Sidebar />

//             <main className="admin-content">

//                 <Outlet />

//             </main>

//         </div>
//     );
// };

// export default Admin;