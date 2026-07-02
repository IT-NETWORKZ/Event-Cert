import { useState, useRef, useEffect } from "react";
import "./Navbar.css";
import { NavLink } from "react-router-dom";

import {
    FaBars,
    FaUserCircle,
    FaUser,
    FaSignOutAlt,
    FaChevronDown
} from "react-icons/fa";

function Navbar({
    collapsed,
    setCollapsed,
    toggled,
    setToggled
}) {

    const [showMenu, setShowMenu] = useState(false);

    const menuRef = useRef(null);

    useEffect(() => {

        function handleClickOutside(e){

            if(menuRef.current && !menuRef.current.contains(e.target)){

                setShowMenu(false);

            }

        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {

            document.removeEventListener("mousedown", handleClickOutside);

        };

    }, []);

    return (

        <div className="admin-navbar">

            <div className="navbar-left">

                <button
                    className="menu-btn"
                    onClick={() => {

                        if(window.innerWidth <= 768){

                            setToggled(!toggled);

                        }else{

                            setCollapsed(!collapsed);

                        }

                    }}
                >

                    <FaBars/>

                </button>

               

            </div>

            <div
                className="navbar-profile"
                ref={menuRef}
            >

                <div
                    className="profile-trigger"
                    onClick={() => setShowMenu(!showMenu)}
                >

                    <span>

                        Welcome Saumya

                    </span>

                    <FaUserCircle className="user-icon"/>

                    {/* <FaChevronDown
                        className={`arrow ${showMenu ? "rotate" : ""}`}
                    /> */}

                </div>

                {showMenu && (

                    <div className="profile-dropdown">

                        <button>

                            <FaUser/>

                            My Profile

                        </button>

                        <button>

                            <FaSignOutAlt/>

                            Logout

                        </button>

                    </div>
                    

                )}

            </div>

        </div>

    );

}

export default Navbar;