import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext"; // adjust path if needed
import { getAdminProfile, AdminProfile, toImageUrl } from "../../../api/adminService";

const emptyForm = {
  phoneNumber: "",
  organizationName: "",
  designation: "",
  department: "",
  city: "",
};

function AddProfile() {
  const { user } = useAuth();

  const [profileType, setProfileType] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  // Read-only account info
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneLocked, setPhoneLocked] = useState(false);

  const [isProfileCreated, setIsProfileCreated] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const applyProfile = (profile) => {
    if (!profile) return;

    setFormData({
      phoneNumber: profile.phoneNumber || "",
      organizationName: profile.organizationName || "",
      designation: profile.designation || "",
      department: profile.department || "",
      city: profile.city || "",
    });

    setFullName(profile.fullName || profile.name || user?.fullName || "");
    setEmail(profile.email || user?.email || "");
    setPhoneLocked(!!profile.phoneNumber);
    setImagePreview(toImageUrl(profile.profileImageUrl));
  };

  // Load profile on mount
  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const res = await getAdminProfile();
        if (!active) return;

        setIsProfileCreated(!!res.isProfileCreated);
        applyProfile(res.profile);
        setIsEditing(!res.isProfileCreated);

        if (!res.isProfileCreated) setMessage(res.message || "");
      } catch (err) {
        if (!active) return;
        setError(
          err.response?.data?.message ||
            err.response?.data?.title ||
            err.message ||
            "Failed to load profile."
        );
      } finally {
        if (active) setPageLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Only JPG, JPEG, PNG and WEBP images are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must not exceed 5MB.");
      e.target.value = "";
      return;
    }

    setError("");
    setProfileImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleEdit = () => {
    setMessage("");
    setError("");
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await AdminProfile({
        values: formData,
        imageFile: profileImage,
      });

      applyProfile(res.profile);
      setProfileImage(null);
      setIsProfileCreated(true);
      setIsEditing(false);
      setMessage(res?.message || "Profile saved successfully!");
    } catch (err) {
      console.error("Profile Error:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.title ||
          err.message ||
          "Failed to save profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const disabled = !isEditing || loading;

  if (pageLoading) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <h2 className="profile-title">Loading profile...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">
          {isProfileCreated ? "Profile" : "Add Profile"}
        </h2>

        <div className="title-line"></div>

        {isProfileCreated && !isEditing && (
          <button type="button" className="edit-btn" onClick={handleEdit}>
            <i className="bi bi-pencil-square"></i> Edit
          </button>
        )}

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="dropdown-wrapper">
            <select
              value={profileType}
              onChange={(e) => setProfileType(e.target.value)}
              disabled={disabled}
            >
              <option value="">Select Client / Org Name</option>
              <option value="Your Name">Your Name</option>
              <option value="Org Name">Org Name</option>
            </select>
          </div>

          <div className="profile-form">
            {/* Name - read only */}
            <div className="input-icon">
              <input
                type="text"
                placeholder="Name"
                value={fullName}
                readOnly
              />
              <i className="bi bi-check-circle-fill success"></i>
            </div>

            {/* Email - read only */}
            <div className="input-icon">
              <input
                type="email"
                placeholder="Email"
                value={email}
                readOnly
              />
              <i className="bi bi-check-circle-fill success"></i>
            </div>

            {/* Mobile - read only once available */}
            <input
              type="text"
              name="phoneNumber"
              placeholder="Mobile Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              maxLength={10}
              readOnly={phoneLocked}
              disabled={!phoneLocked && disabled}
              required
            />

            <input
              type="text"
              name="organizationName"
              placeholder="Organization Name"
              value={formData.organizationName}
              onChange={handleChange}
              disabled={disabled}
              required
            />

            <input
              type="text"
              name="designation"
              placeholder="Designation"
              value={formData.designation}
              onChange={handleChange}
              disabled={disabled}
              required
            />

            <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
              disabled={disabled}
              required
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              disabled={disabled}
              required
            />

            <div className="profile-image-upload full-width">
              <label>Profile Image</label>

              <div className="image-upload-content">
                <div className="image-preview-box">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile Preview" />
                  ) : (
                    <i className="bi bi-person-circle preview-placeholder"></i>
                  )}
                </div>

                <div className="upload-details">
                  <label
                    htmlFor="profile-image"
                    className="image-upload-btn"
                    style={disabled ? { pointerEvents: "none", opacity: 0.6 } : undefined}
                  >
                    <i className="bi bi-cloud-arrow-up"></i>
                    Choose Image
                  </label>

                  <input
                    type="file"
                    id="profile-image"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleImageChange}
                    disabled={disabled}
                    hidden
                  />

                  <span className="image-hint">
                    JPG, JPEG, PNG or WEBP (Max 5MB)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {isEditing && (
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Saving..." : "Save Profile"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default AddProfile;