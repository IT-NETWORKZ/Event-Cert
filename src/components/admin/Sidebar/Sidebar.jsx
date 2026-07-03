import React from "react";
import "./Sidebar.css";
import logo from "../../../assets/img/logo_EventCert.png";

import {
  ProSidebarProvider,
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
} from "react-pro-sidebar";

import {
  FaThLarge,
  FaCreditCard,
  FaUser,
  FaFileAlt,
  FaAward,
  FaCommentDots,
  FaReceipt,
} from "react-icons/fa";

import { NavLink, useLocation } from "react-router-dom";

const SidebarComponent = ({ collapsed, toggled, setToggled }) => {
  const location = useLocation();

  // Helper function to check if the path matches the current route
  const isActive = (path) => location.pathname === path;

  // Helper function to check if any child of a sub-menu is active
  const isSubMenuActive = (paths) => paths.some(path => location.pathname === path);

  return (
    <ProSidebarProvider>
      {/* Mobile Overlay */}
      {toggled && (
        <div
          className="sidebar-overlay"
          onClick={() => setToggled(false)}
        />
      )}

      <Sidebar
        collapsed={collapsed}
        toggled={toggled}
        breakPoint="md"
        onBackdropClick={() => setToggled(false)}
        backgroundColor="transparent"
        className="custom-sidebar"
      >
        {/* Sidebar Header */}
        <div className="sidebar-header">
          {(!collapsed || toggled) && (
            <div className="sidebar-logo">
              <img src={logo} alt="EventCert Logo" />
            </div>
          )}

          {toggled && (
            <button
              className="sidebar-close-btn"
              onClick={() => setToggled(false)}
              aria-label="Close Menu"
            ></button>
          )}
        </div>

        {/* Navigation Links */}
        <Menu className="sidebar-menu">
          {/* Note: /admin handles both root index and dashboard */}
          <MenuItem
            icon={<FaThLarge />}
            component={<NavLink to="/admin/dashboard" />}
            className={isActive("/admin/dashboard") || isActive("/admin") ? "active-item" : ""}
          >
            Dashboard
          </MenuItem>

          <MenuItem
            icon={<FaCreditCard />}
            component={<NavLink to="/admin/subscriptionplan" />}
            className={isActive("/admin/subscriptionplan") ? "active-item" : ""}
          >
            Subscription
          </MenuItem>

          <MenuItem
            icon={<FaUser />}
            component={<NavLink to="/admin/profile" />}
            className={isActive("/admin/profile") ? "active-item" : ""}
          >
            Profile
          </MenuItem>

          <MenuItem
            icon={<FaUser />}
            component={<NavLink to="/admin/greeting" />}
            className={isActive("/admin/greeting") ? "active-item" : ""}
          >
            Greeting
          </MenuItem>

          <MenuItem
            icon={<FaFileAlt />}
            component={<NavLink to="/admin/square_certificate" />}
            className={isActive("/admin/square_certificate") ? "active-item" : ""}
          >
            Square Certificate
          </MenuItem>

          {/* Quick SubMenu */}
          <SubMenu
            icon={<FaAward />}
            label="Quick"
            className={isSubMenuActive(["/admin/quick/template1", "/admin/quick/template2", "/admin/quick/template3"]) ? "active-submenu" : ""}
          >
            <MenuItem component={<NavLink to="/admin/quick/template1" />} className={isActive("/admin/quick/template1") ? "active-item" : ""}>Template 1</MenuItem>
            <MenuItem component={<NavLink to="/admin/quick/template2" />} className={isActive("/admin/quick/template2") ? "active-item" : ""}>Template 2</MenuItem>
            <MenuItem component={<NavLink to="/admin/quick/template3" />} className={isActive("/admin/quick/template3") ? "active-item" : ""}>Template 3</MenuItem>
          </SubMenu>

          {/* Advance SubMenu */}
          <SubMenu
            icon={<FaAward />}
            label="Advance"
            className={isSubMenuActive(["/admin/advance/certificate", "/admin/advance/idcard", "/admin/advance/badge"]) ? "active-submenu" : ""}
          >
            <MenuItem component={<NavLink to="/admin/advance/certificate" />} className={isActive("/admin/advance/certificate") ? "active-item" : ""}>Certificate</MenuItem>
            <MenuItem component={<NavLink to="/admin/advance/idcard" />} className={isActive("/admin/advance/idcard") ? "active-item" : ""}>ID Card</MenuItem>
            <MenuItem component={<NavLink to="/admin/advance/badge" />} className={isActive("/admin/advance/badge") ? "active-item" : ""}>Badge</MenuItem>
          </SubMenu>

          <MenuItem 
            icon={<FaFileAlt />}
            component={<NavLink to="/admin/backpage" />}
            className={isActive("/admin/backpage") ? "active-item" : ""}
          >
            Backpage
          </MenuItem>

          <MenuItem 
            icon={<FaFileAlt />}
            component={<NavLink to="/admin/add-participants" />}
            className={isActive("/admin/add-participants") ? "active-item" : ""}
          >
            Add Participants
          </MenuItem>

          <MenuItem
            icon={<FaCommentDots />}
            component={<NavLink to="/admin/feedback" />}
            className={isActive("/admin/feedback") ? "active-item" : ""}
          >
            Feedback
          </MenuItem>

          <MenuItem 
            icon={<FaReceipt />}
            component={<NavLink to="/admin/payment" />}
            className={isActive("/admin/payment") ? "active-item" : ""}
          >
            Payment
          </MenuItem>
        </Menu>
      </Sidebar>
    </ProSidebarProvider>
  );
};

export default SidebarComponent;
