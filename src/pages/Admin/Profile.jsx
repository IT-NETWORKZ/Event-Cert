import React from "react";
import AddProfile from "../../components/admin/Profile/AddProfile";
import LogoUpload from "../../components/admin/Profile/LogoUpload";
import AddSignatories from "../../components/admin/Profile/AddSignatories";
import "../../css/Profile.css";

const Profile = () => {
  return (
    <div className="profile-wrapper">

    <div className="profile-page">

      <AddProfile />

      <LogoUpload />

      <AddSignatories />

    </div>
    </div>
  );
};

export default Profile;