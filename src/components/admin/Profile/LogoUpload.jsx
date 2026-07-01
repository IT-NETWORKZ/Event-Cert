import { useState } from "react";

const LogoInput = ({ title, required = false }) => {
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="logo-box">
      <label className="logo-title">
        {title} {required && <span>*</span>}
      </label>

      <div className="upload-row">
        <input
          type="file"
          accept=".png,.svg"
          onChange={handleChange}
        />

        <div className="preview-box">
          {preview ? (
            <img src={preview} alt="preview" />
          ) : (
            <div className="placeholder">
              <i className="bi bi-image"></i>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function LogoUpload() {
  return (
    <div className="logo-page">

      {/* Instructions */}

      <div className="instruction-section">

        <h2>
          Instructions
        </h2>

        <div className="heading-line"></div>

        <div className="instruction-grid">

          <ul>
            <li>Kindly use only SVG or transparent PNG image for logo & signature.</li>
            <li>1st image in logo will be used as profile picture.</li>
          </ul>

          <ul>
            <li>Logos in certificate will be shown as sequence below.</li>
            <li>Image size should be max 300KB.</li>
          </ul>

        </div>

      </div>

      {/* Top Logos */}

      <div className="logo-card">

        <h2>Add Logos (Top)</h2>

        <div className="heading-line"></div>

        <div className="logo-grid">

          <LogoInput
            title="Logo 1 (Profile Image)"
            required
          />

          <LogoInput title="Logo 2" />

          <LogoInput title="Logo 3" />

          <LogoInput title="Logo 4" />

        </div>

      </div>

      {/* Bottom Logos */}

      <div className="logo-card">

        <h2>Sponsor Logos (Bottom)</h2>

        <div className="heading-line"></div>

        <div className="logo-grid">

          <LogoInput title="Logo 5" />

          <LogoInput title="Logo 6" />

          <LogoInput title="Logo 7" />

          <LogoInput title="Logo 8" />

          <LogoInput title="Logo 9" />

          <LogoInput title="Logo 10" />

        </div>

      </div>

    </div>
  );
}