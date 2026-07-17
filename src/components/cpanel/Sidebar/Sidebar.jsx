import { TbFileCertificate } from "react-icons/tb"; 
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
  FaCalendarDay
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
            component={<NavLink to="/cpanel/dashboard" />}
            className={isActive("/cpanel/dashboard") || isActive("/cpanel") ? "active-item" : ""}
          >
            Dashboard
          </MenuItem>

          <MenuItem
            icon={<FaCreditCard />}
            component={<NavLink to="/cpanel/subscriptionplan" />}
            className={isActive("/cpanel/subscriptionplan") ? "active-item" : ""}
          >
            Subscription
          </MenuItem>

          <MenuItem
            icon={<FaUser />}
            component={<NavLink to="/cpanel/profile" />}
            className={isActive("/cpanel/profile") ? "active-item" : ""}
          >
            Profile
          </MenuItem>
          <MenuItem
            icon={<TbFileCertificate />
}
            component={<NavLink to="customplus" />}
            className={isActive("/customplus") ? "active-item" : ""}
          >
            Custom Plus
          </MenuItem>

          

          <MenuItem
            icon={<FaFileAlt />}
            component={<NavLink to="/cpanel/add-participants" />}
            className={isActive("/cpanel/add-participants") ? "active-item" : ""}
          >
            Add Participants
          </MenuItem>

    

            <MenuItem
            icon={<FaCalendarDay />}
            component={<NavLink to="/cpanel/addevent" />}
            className={isActive("/cpanel/addevent") ? "active-item" : ""}
          >
            Add Event
          </MenuItem>
        </Menu>
      </Sidebar>
    </ProSidebarProvider>
  );
};

export default SidebarComponent;
