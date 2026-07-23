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
  FaFile,
  FaAward,
  FaCalendarDay,
  FaPhoneAlt,
  FaList,
  FaGift,
  FaFileImage,
  FaCashRegister,
  FaStackExchange,
  FaGraduationCap,
  FaUserPlus,
} from "react-icons/fa";

import { NavLink, useLocation } from "react-router-dom";

const SidebarComponent = ({ collapsed, toggled, setToggled }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const isSubMenuActive = (paths) => paths.some((path) => location.pathname === path);

  const certSubPaths = [
    "/cpanel/certificate/profile",
    "/cpanel/certificate/add-category",
    "/cpanel/certificate/add-draft",
    "/cpanel/certificate/select-letterhead",
    "/cpanel/certificate/add-participants",
    "/cpanel/certificate/history",
    "/cpanel/certificate/referral-registrations",
  ];

  return (
    <ProSidebarProvider>
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
        {/* Header */}
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

        {/* Menu */}
        <Menu className="sidebar-menu">
          <MenuItem
            icon={<FaThLarge />}
            component={<NavLink to="/cpanel/dashboard" />}
            className={isActive("/cpanel/dashboard") || isActive("/cpanel") ? "active-item" : ""}
          >
            Home
          </MenuItem>

          <MenuItem
            icon={<FaPhoneAlt />}
            component={<NavLink to="/cpanel/contact" />}
            className={isActive("/cpanel/contact") ? "active-item" : ""}
          >
            Contact
          </MenuItem>

          <MenuItem
            icon={<FaList />}
            component={<NavLink to="/cpanel/registrationList" />}
            className={isActive("/cpanel/registrationList") ? "active-item" : ""}
          >
            Registration List
          </MenuItem>

          {/* CERTIFICATE SUBMENU */}
          <SubMenu
            icon={<FaAward />}
            label="Certificate"
            className={isSubMenuActive(certSubPaths) ? "active-submenu" : ""}
            /* Force solid brown background on floating popup portal */
            rootStyles={{
              ['& .ps-submenu-content']: {
                backgroundColor: collapsed ? ' #60b0a9 !important' : 'transparent',
              },
            }}
          >
            <MenuItem
              icon={<FaGraduationCap />}
              component={<NavLink to="/cpanel/certificate/profile" />}
              className={isActive("/cpanel/certificate/profile") ? "active-item" : ""}
            >
              Profile
            </MenuItem>
            <MenuItem
              icon={<FaGraduationCap />}
              component={<NavLink to="/cpanel/certificate/add-category" />}
              className={isActive("/cpanel/certificate/add-category") ? "active-item" : ""}
            >
              Add Category
            </MenuItem>
            <MenuItem
              icon={<FaGraduationCap />}
              component={<NavLink to="/cpanel/certificate/add-draft" />}
              className={isActive("/cpanel/certificate/add-draft") ? "active-item" : ""}
            >
              Add Draft
            </MenuItem>
            <MenuItem
              icon={<FaGraduationCap />}
              component={<NavLink to="/cpanel/certificate/select-letterhead" />}
              className={isActive("/cpanel/certificate/select-letterhead") ? "active-item" : ""}
            >
              Select Letterhead
            </MenuItem>
            <MenuItem
              icon={<FaGraduationCap />}
              component={<NavLink to="/cpanel/certificate/add-participants" />}
              className={isActive("/cpanel/certificate/add-participants") ? "active-item" : ""}
            >
              Add Participants
            </MenuItem>
            <MenuItem
              icon={<FaGraduationCap />}
              component={<NavLink to="/cpanel/certificate/history" />}
              className={isActive("/cpanel/certificate/history") ? "active-item" : ""}
            >
              Admin Certificate History
            </MenuItem>
            <MenuItem
              icon={<FaUserPlus />}
              component={<NavLink to="/cpanel/certificate/referral-registrations" />}
              className={isActive("/cpanel/certificate/referral-registrations") ? "active-item" : ""}
            >
              Referral Registrations
            </MenuItem>
          </SubMenu>

          <MenuItem
            icon={<FaFile />}
            component={<NavLink to="/cpanel/addplans" />}
            className={isActive("/cpanel/addplans") ? "active-item" : ""}
          >
            Add Plans
          </MenuItem>

          {/* <MenuItem
            icon={<FaCalendarDay />}
            component={<NavLink to="/cpanel/addevent" />}
            className={isActive("/cpanel/addevent") ? "active-item" : ""}
          >
            Add Event
          </MenuItem> */}

          <MenuItem
            icon={<FaGift />}
            component={<NavLink to="/cpanel/promocode" />}
            className={isActive("/cpanel/promocode") ? "active-item" : ""}
          >
            Add promo Code
          </MenuItem>

          <MenuItem
            icon={<FaFileImage />}
            component={<NavLink to="/cpanel/addtemplate" />}
            className={isActive("/cpanel/addtemplate") ? "active-item" : ""}
          >
            Add Template
          </MenuItem>

          <MenuItem
            icon={<FaCashRegister />}
            component={<NavLink to="/cpanel/transaction" />}
            className={isActive("/cpanel/transaction") ? "active-item" : ""}
          >
            Admin Transaction
          </MenuItem>

          <MenuItem
            icon={<FaStackExchange />}
            component={<NavLink to="/cpanel/taxes" />}
            className={isActive("/cpanel/taxes") ? "active-item" : ""}
          >
            Taxes
          </MenuItem>
        </Menu>
      </Sidebar>
    </ProSidebarProvider>
  );
};

export default SidebarComponent;
