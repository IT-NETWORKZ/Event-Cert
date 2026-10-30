import { useState, useEffect } from "react";
import "./FeedbackForm.css";
import { FaStar, FaPaperPlane, FaCheckCircle } from "react-icons/fa";
import { getFeedbackUser, submitFeedback } from "../../../api/feedbackService";
import { useAuth } from "../../../context/AuthContext";

const MAX_CHARS = 240;
const LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

function FeedbackForm({ userName: userNameProp = "" }) {
  const { user } = useAuth();

  const [name, setName] = useState(userNameProp || user?.fullName || "");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load the logged-in user's name from the API
  useEffect(() => {
    let cancelled = false;
    getFeedbackUser()
      .then((data) => {
        if (!cancelled && data?.userName) setName(data.userName);
      })
      .catch(() => {
        /* keep the fallback name already in state */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }

    if (!description.trim()) {
      setError("Please enter your description.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await submitFeedback({ rating, description: description.trim() });
      setSubmitted(true);
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        setError("Your session has expired. Please log in again.");
      } else {
        setError(
          err.response?.data?.message ||
            "Could not submit feedback. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setHover(0);
    setDescription("");
    setError("");
    setSubmitted(false);
  };

  const activeStars = hover || rating;
  const percent = Math.min((description.length / MAX_CHARS) * 100, 100);

  return (
    <div className="fbk-page">
      <div className="fbk-card">
        {/* Banner */}
        <div className="fbk-banner">
          <h1>Share Your Feedback</h1>
          <span className="fbk-banner-line" />
        </div>

        <div className="fbk-body">
          {submitted ? (
            <div className="fbk-success">
              <FaCheckCircle className="fbk-success-icon" />
              <h2>Thank you!</h2>
              <p>Your feedback has been submitted successfully.</p>
              <button
                type="button"
                className="fbk-submit"
                onClick={resetForm}
              >
                Submit Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="fbk-form" noValidate>
              {/* Name */}
              <div className="fbk-field">
                <label className="fbk-label" htmlFor="fbkName">
                  Name <span className="fbk-req">*</span>
                </label>
                <input
                  type="text"
                  id="fbkName"
                  className="fbk-input"
                  value={name}
                  placeholder="Your registered name"
                  readOnly
                />
              </div>

              {/* Rating */}
              <div className="fbk-rating">
                <span className="fbk-label fbk-rating-title">
                  Rate Your Experience <span className="fbk-req">*</span>
                </span>

                <div className="fbk-rating-row">
                  <div
                    className="fbk-stars"
                    role="group"
                    aria-label="Rate your experience from 1 to 5 stars"
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`fbk-star ${
                          star <= activeStars ? "is-on" : ""
                        }`}
                        onClick={() => {
                          setRating(star);
                          setError("");
                        }}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        onFocus={() => setHover(star)}
                        onBlur={() => setHover(0)}
                        aria-label={`${star} ${star === 1 ? "star" : "stars"}`}
                        aria-pressed={rating === star}
                      >
                        <FaStar />
                      </button>
                    ))}
                  </div>

                  <span className={`fbk-pill ${activeStars ? "is-on" : ""}`}>
                    {activeStars ? LABELS[activeStars] : "Select rating"}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="fbk-field">
                <label className="fbk-label" htmlFor="fbkDescription">
                  Description <span className="fbk-req">*</span>
                </label>

                <textarea
                  id="fbkDescription"
                  className="fbk-textarea"
                  placeholder="Tell us about your experience..."
                  maxLength={MAX_CHARS}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <div className="fbk-counter-row">
                  <div className="fbk-bar">
                    <span style={{ width: `${percent}%` }} />
                  </div>
                  <span className="fbk-counter">
                    {description.length} / {MAX_CHARS}
                  </span>
                </div>
              </div>

              {error && <div className="fbk-error">{error}</div>}

              {/* Submit */}
              <div className="fbk-actions">
                <button
                  type="submit"
                  className="fbk-submit"
                  disabled={loading}
                >
                  <FaPaperPlane />
                  <span>{loading ? "Submitting..." : "Submit Feedback"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default FeedbackForm;