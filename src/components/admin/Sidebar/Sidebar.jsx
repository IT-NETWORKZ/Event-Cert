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


import { NavLink } from "react-router-dom";

const SidebarComponent = ({
    collapsed,
    toggled,
    setToggled,
}) => {
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
          {/* Show logo when NOT collapsed OR when explicitly toggled on mobile */}
          {(!collapsed || toggled) && (
            <div className="sidebar-logo">
              <img
                src={logo}
                alt="EventCert Logo"
              />
            </div>
          )}

          {/* Close Cross Button - Only visible on mobile/tablets when sidebar is pulled open */}
          {toggled && (
            <button 
              className="sidebar-close-btn" 
              onClick={() => setToggled(false)}
              aria-label="Close Menu"
            >
              
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <Menu className="sidebar-menu">

          <MenuItem
            icon={<FaThLarge />}
            component={<NavLink to="/admin/dashboard" />}
            className="active-item"
          >
            Dashboard
          </MenuItem>

          <MenuItem
            icon={<FaCreditCard />}
            component={<NavLink to="/admin/subscriptionplan" />}
          >
            Subscription
          </MenuItem>

          <MenuItem
            icon={<FaUser />}
            component={<NavLink to="/admin/profile" />}
          >
            Profile
          </MenuItem>

          <MenuItem
            icon={<FaUser />}
            component={<NavLink to="/admin/greeting" />}
          >
            Greeting
          </MenuItem>

          <MenuItem
            icon={<FaFileAlt />}
            component={<NavLink to="/admin/square_certificate" />}
          >
            Square Certificate
          </MenuItem>

          <SubMenu
            icon={<FaAward />}
            label="Quick"
          >
            <MenuItem>Template 1</MenuItem>
            <MenuItem>Template 2</MenuItem>
            <MenuItem>Template 3</MenuItem>
          </SubMenu>

          <SubMenu
            icon={<FaAward />}
            label="Advance"
          >
            <MenuItem>Certificate</MenuItem>
            <MenuItem>ID Card</MenuItem>
            <MenuItem>Badge</MenuItem>
          </SubMenu>

          <MenuItem icon={<FaFileAlt />}>
            Backpage
          </MenuItem>

          <MenuItem icon={<FaFileAlt />}>
            Add Participants
          </MenuItem>

          <MenuItem icon={<FaCommentDots />}  
          component={<NavLink to="/admin/feedback" />}>
          
            Feedback
          </MenuItem>

          <MenuItem icon={<FaReceipt />}>
            Payment
          </MenuItem>

        </Menu>

      </Sidebar>

    </ProSidebarProvider>
  );
};

export default SidebarComponent;


