import { useEffect, useState } from "react";
import "./HomeFeedback.css";
import { getPublicFeedback } from "../../../api/feedbackService";

function HomeFeedback() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let cancelled = false;
    getPublicFeedback()
      .then((list) => !cancelled && setItems(list))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // nothing approved yet -> don't show the section
  if (items.length === 0) return null;

  return (
    <section className="hf-section">
      <div className="container">
        <div className="hf-head">
          <h2>What Our <span>Users Say</span></h2>
          <p>Real feedback from people using EventCert</p>
        </div>

        <div className="hf-grid">
          {items.map((f) => (
            <div className="hf-card" key={f.feedbackId}>
              <div className="hf-stars">
                {"★".repeat(f.rating)}
                {"☆".repeat(5 - f.rating)}
              </div>

              <p className="hf-text">“{f.description}”</p>

              <div className="hf-user">
                <div className="hf-avatar">
                  {f.userName?.charAt(0).toUpperCase()}
                </div>
                <strong>{f.userName}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeFeedback;