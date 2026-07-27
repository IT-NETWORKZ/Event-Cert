import React, { useState } from "react";
import "../../css/CProfile.css";

const CProfile = () => {
  const [companyName] = useState("ITNetworkZ");
  const [isEditing, setIsEditing] = useState(false);

  // Initializing with null previews so only uploaded/valid images render
  const [logos, setLogos] = useState([
    { id: 1, file: null, preview: null },
    { id: 2, file: null, preview: null },
    { id: 3, file: null, preview: null },
    { id: 4, file: null, preview: null },
  ]);

  const handleEditToggle = (e) => {
    e.preventDefault();

    if (isEditing) {
      // Logic when saving / updating
      console.log("Saving changes...", { companyName, logos, signatories });
      alert("Profile updated successfully!");
      setIsEditing(false); // Switch back to 'Edit' mode
    } else {
      // Switch to 'Update' mode
      setIsEditing(true);
    }
  };

  const [signatories, setSignatories] = useState([
    {
      id: 1,
      name: "Rajiv Verma",
      designation: "Technical Head",
      organization: "IT-NetworkZ",
      signature: null,
      preview: null,
    },
    {
      id: 2,
      name: "Elavarasan Varadharajan",
      designation: "Director",
      organization: "Kavin India Pvt Ltd",
      signature: null,
      preview: null,
    },
    {
      id: 3,
      name: "Deepak Dhote",
      designation: "Operations Manager",
      organization: "IT-NetworkZ",
      signature: null,
      preview: null,
    },
    {
      id: 4,
      name: "Hemant Nande",
      designation: "Developer",
      organization: "IT NetworkZ",
      signature: null,
      preview: null,
    },
    {
      id: 5,
      name: "",
      designation: "",
      organization: "",
      signature: null,
      preview: null,
    },
  ]);

  // Handle Logo File Upload
  const handleLogoChange = (index, file) => {
    if (file) {
      const updatedLogos = [...logos];
      updatedLogos[index].file = file;
      updatedLogos[index].preview = URL.createObjectURL(file);
      setLogos(updatedLogos);
    }
  };

  // Handle Signatory Inputs
  const handleSignatoryChange = (index, field, value) => {
    const updated = [...signatories];
    updated[index][field] = value;
    setSignatories(updated);
  };

  // Handle Signature Upload
  const handleSignatureUpload = (index, file) => {
    if (file) {
      const updated = [...signatories];
      updated[index].signature = file;
      updated[index].preview = URL.createObjectURL(file);
      setSignatories(updated);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saved Profile Details:", { companyName, logos, signatories });
    alert("Profile saved successfully!");
  };

  return (
    <div className="profile-page-wrapper">
      <div className="card profile-main-card border-0 shadow-sm">
        <div className="card-body p-4 p-md-5">
          
          {/* Header Row */}
          <div className="profile-header text-center mb-4 position-relative">
            <h2 className="profile-title d-inline-block fw-bold">
              Add Profile
            </h2>
        <button
              type="button"
              className={`btn edit-btn position-absolute top-0 end-0 ${
                isEditing ? "btn-success" : "btn-primary"
              }`}
              onClick={handleEditToggle}
            >
              {isEditing ? "Update" : "Edit"}
            </button>
          </div>

          {/* Sub-Header / Company Name */}
          <div className="text-center mb-4">
            <h4 className="company-name-heading fw-bold">{companyName}</h4>
          </div>

          {/* Instructions Box */}
          <div className="instructions-section mb-4">
            <h5 className="section-subtitle fw-bold mb-3">Instructions</h5>
            <div className="row g-3 instructions-list">
              <div className="col-md-6">
                <ul className="mb-0 ps-3">
                  <li className="mb-2">
                    Kindly use only SVG or transparent PNG image for logo & signature.
                  </li>
                  <li>
                    1st image in logo will be used as profile picture.
                  </li>
                </ul>
              </div>
              <div className="col-md-6">
                <ul className="mb-0 ps-3">
                  <li className="mb-2">
                    Logos in certificate will be shown as sequence below.
                  </li>
                  <li>Image size should be max 300KB.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* SECTION: Add Logos */}
          <div className="logos-section mb-5">
            <h5 className="section-subtitle fw-bold mb-3">Add Logos</h5>
            <div className="sub-card p-3 p-md-4">
              <div className="row g-4">
                {logos.map((logo, index) => (
                  <div key={logo.id} className="col-md-6">
                    <label className="form-label fw-semibold text-dark mb-2">
                      Logo {logo.id}
                    </label>
                    <div className="d-flex align-items-center gap-3">
                      <div className="flex-grow-1">
                        <input
                          type="file"
                          accept=".svg,.png"
                          className="form-control custom-file-input"
                          onChange={(e) =>
                            handleLogoChange(index, e.target.files[0])
                          }
                        />
                      </div>
                      
                      {/* Logo Image Preview Box (Renders image ONLY) */}
                      <div className="logo-preview-box d-flex align-items-center justify-content-center">
                        {logo.preview && (
                          <img
                            src={logo.preview}
                            alt=""
                            className="img-fluid logo-img"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION: Add Signatories */}
          <div className="signatories-section">
            <h5 className="section-subtitle fw-bold mb-3">Add Signatories</h5>

            {signatories.map((sig, index) => (
              <div key={sig.id} className="sub-card p-3 p-md-4 mb-4">
                <h6 className="fw-bold text-dark mb-3">
                  Signatory {sig.id}
                </h6>
                <div className="row g-3">
                  
                  {/* File Upload + Signature Preview Box */}
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-3">
                      <div className="flex-grow-1">
                        <input
                          type="file"
                          accept=".svg,.png"
                          className="form-control custom-file-input"
                          onChange={(e) =>
                            handleSignatureUpload(index, e.target.files[0])
                          }
                        />
                      </div>

                      {/* Signature Image Preview Box (Renders image ONLY) */}
                      <div className="signature-preview-box d-flex align-items-center justify-content-center">
                        {sig.preview && (
                          <img
                            src={sig.preview}
                            alt=""
                            className="img-fluid signature-img"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Name Input */}
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control custom-input"
                      placeholder="Name"
                      value={sig.name}
                      onChange={(e) =>
                        handleSignatoryChange(index, "name", e.target.value)
                      }
                    />
                  </div>

                  {/* Designation Input */}
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control custom-input"
                      placeholder="Designation"
                      value={sig.designation}
                      onChange={(e) =>
                        handleSignatoryChange(
                          index,
                          "designation",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  {/* Organization Name Input */}
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control custom-input"
                      placeholder="Organization Name"
                      value={sig.organization}
                      onChange={(e) =>
                        handleSignatoryChange(
                          index,
                          "organization",
                          e.target.value
                        )
                      }
                    />
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CProfile;