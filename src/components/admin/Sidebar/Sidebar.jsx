import React, { useState } from "react";
import "./Sidebar.css";
import {
  ProSidebarProvider,
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
} from "react-pro-sidebar";

import {
  FaBars,
  FaTimes,
  FaThLarge,
  FaCreditCard,
  FaUser,
  FaFileAlt,
  FaAward,
  FaCommentDots,
  FaReceipt,
} from "react-icons/fa";

const SidebarComponent = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false); // Default false for clean mobile view initialization

  return (
    <ProSidebarProvider>
      {/* Mobile Backdrop Overlay */}
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
        backgroundColor="transparent" /* Controlled cleanly via our CSS gradient */
        className="custom-sidebar"
      >
        {/* Top Header Section: Holds Logo & Toggle Button cleanly aligned */}
        <div className="sidebar-header">
          {!collapsed && (
            <div className="sidebar-logo">
              <img src="/images/logo.png" alt="EventCert Logo" />
            </div>
          )}

          <button
            className={`hamburger-btn ${!collapsed ? "sidebar-is-open" : "sidebar-is-collapsed"}`}
            onClick={() => {
              setCollapsed(!collapsed);
              setToggled(!toggled);
            }}
            aria-label="Toggle Sidebar"
          >
            {!collapsed ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Navigation Menu */}
        <Menu className="sidebar-menu">
          <MenuItem icon={<FaThLarge />} title="Dashboard" className="active-item">Dashboard</MenuItem>
          <MenuItem icon={<FaCreditCard />} title="Subscription">Subscription</MenuItem>
          <MenuItem icon={<FaUser />} title="Profile">Profile</MenuItem>
          <MenuItem icon={<FaUser />} title="Greeting">Greeting</MenuItem>
          <MenuItem icon={<FaFileAlt />} title="Square Certificate">Square Certificate</MenuItem>

          {/* Quick Submenu */}
          <SubMenu icon={<FaAward />} title="Quick" label="Quick">
            <MenuItem>Template 1</MenuItem>
            <MenuItem>Template 2</MenuItem>
            <MenuItem>Template 3</MenuItem>
          </SubMenu>

          {/* Advance Submenu */}
          <SubMenu icon={<FaAward />} title="Advance" label="Advance">
            <MenuItem>Certificate</MenuItem>
            <MenuItem>ID Card</MenuItem>
            <MenuItem>Badge</MenuItem>
          </SubMenu>

          <MenuItem icon={<FaFileAlt />} title="Backpage">Backpage</MenuItem>
          <MenuItem icon={<FaFileAlt />} title="Add Participants">Add Participants</MenuItem>
          <MenuItem icon={<FaCommentDots />} title="Feedback">Feedback</MenuItem>
          <MenuItem icon={<FaReceipt />} title="Payment">Payment</MenuItem>
        </Menu>
      </Sidebar>
    </ProSidebarProvider>
  );
};

export default SidebarComponent;