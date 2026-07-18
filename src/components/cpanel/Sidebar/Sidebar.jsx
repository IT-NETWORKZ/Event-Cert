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
  FaUser,
  FaFile,
  FaAward,
  FaCommentDots,
  FaReceipt,
  FaCalendarDay,
  FaPhoneAlt,
  FaList,
  FaGift,
  FaFileImage,
  FaCashRegister, 
  FaStackExchange,
  
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
            icon={<FaList />
            }
           
            className={isActive("/cpanel/registrationlist") ? "active-item" : ""}
          >
            Registration List
          </MenuItem>


          <MenuItem
            icon={<TbFileCertificate />
            }
            
            className={isActive("/cpanel/certificate") ? "active-item" : ""}
          >
            Certificate
          </MenuItem>

       



          <MenuItem
            icon={<FaFile />}
            component={<NavLink to="/cpanel/add-plans" />}
            className={isActive("/cpanel/add-plans") ? "active-item" : ""}
          >
            Add Plans
          </MenuItem>
{/* 
           <MenuItem
            icon={<FaUser />}
            component={<NavLink to="/cpanel/profile" />}
            className={isActive("/cpanel/profile") ? "active-item" : ""}
          >
            Profile
          </MenuItem> */}

          <MenuItem
            icon={<FaCalendarDay />}
            component={<NavLink to="/cpanel/addevent" />}
            className={isActive("/cpanel/addevent") ? "active-item" : ""}
          >
            Add Event
          </MenuItem>

           <MenuItem
            icon={<FaGift />}
            component={<NavLink to="/cpanel/addpromocode" />}
            className={isActive("/cpanel/addpromocode") ? "active-item" : ""}
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
