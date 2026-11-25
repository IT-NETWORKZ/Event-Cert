
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./EventFeedback.css";
const location = useLocation();
const navigate = useNavigate();

const eventName = location.state?.eventName || "";

const [event, setEvent] = useState("");

const EventFeedback = () => {
    const [event, setEvent] = useState("");
    const [overallRating, setOverallRating] = useState(0);
    const [ratings, setRatings] = useState({
        organization: 0,
        speakers: 0,
        venue: 0,
        content: 0
    });

    const [experience, setExperience] = useState("");
    const [suggestions, setSuggestions] = useState("");
    const [recommend, setRecommend] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const events = [
        "Annual Tech Fest 2026",
        "Web Development Workshop",
        "AI & Machine Learning Seminar",
        "Innovation Summit 2026"
    ];

    const ratingCategories = [
        { key: "organization", label: "Event Organization", icon: "fa-calendar-check" },
        { key: "speakers", label: "Speakers & Presentations", icon: "fa-microphone-lines" },
        { key: "venue", label: "Venue & Facilities", icon: "fa-location-dot" },
        { key: "content", label: "Event Content", icon: "fa-book-open" }
    ];

    const handleCategoryRating = (category, value) => {
        setRatings(prev => ({
            ...prev,
            [category]: value
        }));
    };

    const renderStars = (rating, onRate, size = "") => (
        <div className={`rating-stars ${size}`}>
            {[1, 2, 3, 4, 5].map(star => (
                <button
                    type="button"
                    key={star}
                    className={`rating-star ${star <= rating ? "active" : ""}`}
                    onClick={() => onRate(star)}
                    aria-label={`Rate ${star} out of 5`}
                >
                    <i className="fa-solid fa-star"></i>
                </button>
            ))}
        </div>
    );

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!event) {
            alert("Please select an event.");
            return;
        }

        if (!overallRating) {
            alert("Please provide your overall event rating.");
            return;
        }

        if (!experience) {
            alert("Please select your event experience.");
            return;
        }

        if (!recommend) {
            alert("Please select whether you would recommend this event.");
            return;
        }

        const feedbackData = {
            event,
            overallRating,
            ratings,
            experience,
            suggestions,
            recommend
        };

        console.log("Feedback Data:", feedbackData);

        // Connect your API here
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <section className="feedback-section">
                <div className="container">
                    <div className="feedback-success">
                        <div className="success-icon">
                            <i className="fa-solid fa-check"></i>
                        </div>
                        <h2>Thank You!</h2>
                        <h4>Your Feedback Has Been Submitted</h4>
                        <p>
                            We appreciate your time and valuable feedback.
                            Your response helps us make future events better.
                        </p>
                        <button
                            className="feedback-submit-btn"
                            onClick={() => {
                                setSubmitted(false);
                                setEvent("");
                                setOverallRating(0);
                                setRatings({
                                    organization: 0,
                                    speakers: 0,
                                    venue: 0,
                                    content: 0
                                });
                                setExperience("");
                                setSuggestions("");
                                setRecommend("");
                            }}
                        >
                            <i className="fa-solid fa-arrow-left"></i>
                            Submit Another Feedback
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="feedback-section">
            <div className="container">

                {/* Heading */}
                <div className="feedback-heading">
                    <span className="feedback-eyebrow">
                        <i className="fa-solid fa-comment-dots"></i>
                        YOUR EXPERIENCE MATTERS
                    </span>

                    <h2 className="about-title">
                        Event <span className="highlight">Feedback</span>
                    </h2>

                    <div className="title-line"></div>

                    <p className="feedback-subtitle">
                        Share your experience with us. Your feedback helps us
                        create better and more memorable events.
                    </p>
                </div>

                {/* Event Selection */}
                <div className="feedback-event-select">
                    <div className="feedback-select-icon">
                        <i className="fa-solid fa-calendar-check"></i>
                    </div>

                    <div className="feedback-select-content">
                        <label htmlFor="eventSelect">Select Event <span>*</span></label>
                        <select
                            id="eventSelect"
                            className="feedback-event-dropdown"
                            value={event}
                            onChange={(e) => setEvent(e.target.value)}
                        >
                            <option value="">-- Select Your Event --</option>
                            {events.map((item, index) => (
                                <option key={index} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <form className="feedback-card" onSubmit={handleSubmit}>

                    {/* Card Header */}
                    <div className="feedback-card-header">
                        <div>
                            <span className="feedback-tag">
                                WE VALUE YOUR OPINION
                            </span>
                            <h3>How was your experience?</h3>
                            <p>Tell us how much you enjoyed the event.</p>
                        </div>

                        <div className="feedback-header-icon">
                            <i className="fa-solid fa-star"></i>
                        </div>
                    </div>

                    {/* Overall Rating */}
                    <div className="feedback-question overall-question">
                        <label className="question-title">
                            Overall Event Experience <span>*</span>
                        </label>

                        {renderStars(overallRating, setOverallRating, "large")}

                        <span className="rating-caption">
                            {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][overallRating]}
                            {overallRating > 0 && ` (${overallRating}/5)`}
                        </span>
                    </div>

                    <div className="feedback-divider"></div>

                    {/* Category Ratings */}
                    <div className="feedback-question">
                        <div className="question-heading">
                            <div>
                                <h4>Rate Different Aspects</h4>
                                <p>Help us understand what worked well.</p>
                            </div>
                            <span className="optional-label">OPTIONAL</span>
                        </div>

                        <div className="rating-category-grid">
                            {ratingCategories.map(category => (
                                <div className="rating-category" key={category.key}>
                                    <div className="category-info">
                                        <div className="category-icon">
                                            <i className={`fa-solid ${category.icon}`}></i>
                                        </div>
                                        <span>{category.label}</span>
                                    </div>

                                    {renderStars(
                                        ratings[category.key],
                                        (value) => handleCategoryRating(category.key, value)
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="feedback-divider"></div>

                    {/* Experience */}
                    <div className="feedback-question">
                        <div className="question-heading">
                            <div>
                                <h4>How would you describe your experience?</h4>
                                <p>Select the option that best describes your experience.</p>
                            </div>
                            <span className="required-label">REQUIRED</span>
                        </div>

                        <div className="experience-options">
                            {[
                                { value: "Excellent", icon: "fa-face-laugh-beam" },
                                { value: "Good", icon: "fa-face-smile" },
                                { value: "Average", icon: "fa-face-meh" },
                                { value: "Needs Improvement", icon: "fa-face-frown" }
                            ].map(item => (
                                <button
                                    type="button"
                                    key={item.value}
                                    className={`experience-option ${
                                        experience === item.value ? "selected" : ""
                                    }`}
                                    onClick={() => setExperience(item.value)}
                                >
                                    <i className={`fa-solid ${item.icon}`}></i>
                                    <span>{item.value}</span>
                                    {experience === item.value && (
                                        <i className="fa-solid fa-circle-check selected-check"></i>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="feedback-divider"></div>

                    {/* Suggestions */}
                    <div className="feedback-question">
                        <div className="question-heading">
                            <div>
                                <h4>Any Suggestions or Comments?</h4>
                                <p>Share your thoughts or suggestions for improvement.</p>
                            </div>
                            <span className="optional-label">OPTIONAL</span>
                        </div>

                        <textarea
                            className="feedback-textarea"
                            placeholder="Write your feedback or suggestions here..."
                            rows="5"
                            maxLength="1000"
                            value={suggestions}
                            onChange={(e) => setSuggestions(e.target.value)}
                        ></textarea>

                        <div className="textarea-footer">
                            <span>
                                <i className="fa-solid fa-lightbulb"></i>
                                Your suggestions help us improve.
                            </span>
                            <span>{suggestions.length}/1000</span>
                        </div>
                    </div>

                    <div className="feedback-divider"></div>

                    {/* Recommendation */}
                    <div className="feedback-question">
                        <div className="question-heading">
                            <div>
                                <h4>Would you recommend this event to others?</h4>
                                <p>Your recommendation means a lot to us.</p>
                            </div>
                            <span className="required-label">REQUIRED</span>
                        </div>

                        <div className="recommend-options">
                            <button
                                type="button"
                                className={`recommend-btn ${recommend === "Yes" ? "selected" : ""}`}
                                onClick={() => setRecommend("Yes")}
                            >
                                <i className="fa-solid fa-thumbs-up"></i>
                                Yes, Definitely
                            </button>

                            <button
                                type="button"
                                className={`recommend-btn ${recommend === "No" ? "selected" : ""}`}
                                onClick={() => setRecommend("No")}
                            >
                                <i className="fa-solid fa-thumbs-down"></i>
                                Not Really
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="feedback-submit-area">
                        <p>
                            <i className="fa-solid fa-shield-halved"></i>
                            Your feedback is valuable and will be used to improve future events.
                        </p>

                        <button type="submit" className="feedback-submit-btn">
                            Submit Feedback
                            <i className="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>

                </form>

                <div className="feedback-bottom-note">
                    <i className="fa-solid fa-heart"></i>
                    Thank you for being a part of our event!
                </div>

            </div>
        </section>
    );
};

export default EventFeedback;
