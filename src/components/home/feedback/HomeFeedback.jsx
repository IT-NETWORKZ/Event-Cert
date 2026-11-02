import React, { useEffect, useState } from "react";
import "./HomeFeedback.css";
import { getPublicFeedback } from "../../../api/feedbackService";

function HomeFeedback() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let cancelled = false;
    
    getPublicFeedback()
      .then((list) => {
        if (!cancelled && Array.isArray(list)) {
          setItems(list);
        }
      })
      .catch((err) => {
        console.error("Failed to load public feedback:", err);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Nothing to show -> don't render the section
  if (!items || items.length === 0) return null;

  return (
    <section className="hf-section">
      <div className="container">
        <div className="hf-head">
          <h2>What Our <span>Users Say</span></h2>
          <p>Real feedback from people using EventCert</p>
        </div>

        <div className="hf-grid">
          {items.map((f) => (
            <div className="hf-card" key={f.feedbackId || Math.random()}>
              <div className="hf-stars">
                {"★".repeat(f.rating || 5)}
                {"☆".repeat(5 - (f.rating || 5))}
              </div>

              <p className="hf-text">“{f.description}”</p>

              <div className="hf-user">
                <div className="hf-avatar">
                  {f.userName?.charAt(0).toUpperCase() || "U"}
                </div>
                <strong>{f.userName || "Anonymous"}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeFeedback;
