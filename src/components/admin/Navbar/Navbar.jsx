import "./Navbar.css";
import logo from "../../../assets/img/logo_EventCert.png";

import {
    FaBars,
    FaUserCircle
} from "react-icons/fa";

function Navbar({
    collapsed,
    setCollapsed,
    toggled,
    setToggled
}) {

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

                <img
                    src={logo}
                    alt=""
                    className="navbar-logo"
                />

            </div>

            <div className="navbar-right">

                <span>

                    Welcome Saumya

                </span>

                <FaUserCircle className="user-icon"/>

            </div>

        </div>

    )

}

export default Navbar;