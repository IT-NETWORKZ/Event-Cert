import { useState } from "react";
import "./FeedbackForm.css";
import { FaCloudUploadAlt, FaStar } from "react-icons/fa";
import logo from "../../../assets/img/logo_EventCert.png";

function FeedbackForm() {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, rating, description, file });
  };

  return (
    <div className="feedback-page-container">
      <div className="feedback-card">
        <div className="feedback-header">
          <img src={logo} alt="EventCert Logo" className="feedback-logo" />
          <h1>Feedback</h1>
        </div>

        <div className="star-rating-container">
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <label key={index} className="star-label">
                <input
                  type="radio"
                  name="rating"
                  value={ratingValue}
                  onClick={() => setRating(ratingValue)}
                  style={{ display: "none" }}
                />
                <FaStar
                  className="star-icon"
                  color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(0)}
                />
              </label>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="input-group">
            <label htmlFor="userName">
              Name <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              id="userName"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="userDescription">
              Description <span className="required-asterisk">*</span>
            </label>
            <textarea
              id="userDescription"
              placeholder="Tell us about your experience"
              maxLength={240}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <div className="character-counter">
              {description.length} / 240 characters
            </div>
          </div>

          <div className="file-upload-container">
            <input
              type="file"
              id="fileUpload"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <label htmlFor="fileUpload" className="file-upload-label">
              <FaCloudUploadAlt className="upload-icon" />
              <span>
                {file ? `Selected: ${file.name}` : "Click to upload or drag and drop"}
              </span>
            </label>
          </div>

          <div className="btn-wrapper">
            <button type="submit" className="feedback-submit-btn">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FeedbackForm;