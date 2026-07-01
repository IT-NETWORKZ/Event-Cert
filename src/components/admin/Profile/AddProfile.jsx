import { useState } from "react";

function AddProfile() {
  const [profileType, setProfileType] = useState("");

  return (
    <div className="profile-container">
      <div className="profile-card">

        {/* Heading */}
        <h2 className="profile-title">
          Add Profile
        </h2>

        <div className="title-line"></div>

        {/* Edit Button */}
        <button className="edit-btn">
          <i className="bi bi-pencil-square"></i> Edit
        </button>

        {/* Dropdown */}
        <div className="dropdown-wrapper">
          <select
            value={profileType}
            onChange={(e) => setProfileType(e.target.value)}
          >
            <option value="">Select Client / Org Name</option>
            <option>Your Name</option>
            <option>Org Name</option>
          </select>
        </div>

        {/* Form */}
        <div className="profile-form">

          <input
            type="text"
            placeholder="Mobile Number"
            defaultValue="7219722032"
          />

          <input
            type="email"
            placeholder="Email"
            defaultValue="bhajanekaran13@gmail.com"
          />

          <input
            type="text"
            placeholder="Designation"
          />

          <div className="input-icon">
            <input
              type="text"
              placeholder="Name"
              defaultValue="Karan"
            />
            <i className="bi bi-check-circle-fill success"></i>
          </div>

          <input
            type="text"
            placeholder="Department"
          />

          <input
            type="text"
            placeholder="City"
          />

        </div>

      </div>
    </div>
  );
}

export default AddProfile;