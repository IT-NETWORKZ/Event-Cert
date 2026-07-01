import { useState } from "react";
import { BsImage } from "react-icons/bs";

export default function AddSignatories() {
  const [signatories, setSignatories] = useState(
    Array.from({ length: 5 }, () => ({
      image: null,
      preview: "",
      name: "",
      designation: "",
      organization: "",
    }))
  );

  const handleImage = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const updated = [...signatories];
    updated[index].image = file;
    updated[index].preview = URL.createObjectURL(file);

    setSignatories(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...signatories];
    updated[index][field] = value;
    setSignatories(updated);
  };

  return (
    <div className="signatories-container">
      <h2 className="page-title">Add Signatories</h2>

      <div className="title-line"></div>

      {signatories.map((item, index) => (
        <div className="signatory-card" key={index}>
          <h4 className="signatory-title">
            Signatory {index + 1}
            {index === 0 && <span className="required"> *</span>}
          </h4>

          <div className="signatory-grid">
            {/* Left Side */}
            <div className="left-side">
              <div className="upload-row">
                <input
                  type="file"
                  accept=".png,.svg"
                  onChange={(e) => handleImage(index, e)}
                />

                <div className="preview-box">
                  {item.preview ? (
                    <img src={item.preview} alt="Preview" />
                  ) : (
                    <BsImage size={30} color="#999" />
                  )}
                </div>
              </div>

              <input
                type="text"
                placeholder="Designation"
                value={item.designation}
                onChange={(e) =>
                  handleChange(index, "designation", e.target.value)
                }
              />
            </div>

            {/* Right Side */}
            <div className="right-side">
              <input
                type="text"
                placeholder="Signatory Name"
                value={item.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
              />

              <input
                type="text"
                placeholder="Organization"
                value={item.organization}
                onChange={(e) =>
                  handleChange(index, "organization", e.target.value)
                }
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}