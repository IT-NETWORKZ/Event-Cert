import React, { useState, useRef, useEffect } from "react";
import { 
  MessageCircle, 
  X, 
  Send, 
  Paperclip, 
  Smile, 
  ThumbsUp, 
  User 
} from "lucide-react";
import "./ChatBot.css";

const QUICK_OPTIONS = [
  "I have a question",
  "Services & Plans",
  "Contact Support",
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "👋 Hi! How can we help you today with EventCert?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  // Auto scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputValue.trim();
    if (!text) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue("");

    // Simulate automated static bot reply
    setTimeout(() => {
      let botResponseText = "Thanks for reaching out! Our team will assist you shortly.";

      if (text.toLowerCase().includes("question")) {
        botResponseText = "Sure! What would you like to know about our certificates or events?";
      } else if (text.toLowerCase().includes("services") || text.toLowerCase().includes("plan")) {
        botResponseText = "We offer Event, Certificate, and Greeting Card generation plans. Check our Subscription page!";
      } else if (text.toLowerCase().includes("contact") || text.toLowerCase().includes("support")) {
        botResponseText = "You can reach us at support@eventcert.com or call our hotline.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: botResponseText,
        },
      ]);
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot-root">
      {/* Floating Widget Popup Container */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar-container">
                <User size={18} className="chatbot-avatar-icon" />
              </div>
              <div className="chatbot-header-text">
                <h3>Customer Support</h3>
                <span className="chatbot-status-indicator">
                  <span className="status-dot"></span> Online
                </span>
              </div>
            </div>
            <button
              type="button"
              className="chatbot-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close Chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message-row ${
                  msg.sender === "user" ? "user-row" : "bot-row"
                }`}
              >
                {msg.sender === "bot" && (
                  <div className="bot-avatar-small">
                    <User size={14} />
                  </div>
                )}
                <div className={`message-bubble ${msg.sender}-bubble`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Quick Option Action Chips */}
            {messages.length === 1 && (
              <div className="quick-chips-container">
                {QUICK_OPTIONS.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="quick-chip"
                    onClick={() => handleSendMessage(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="chatbot-input-bar">
            <input
              type="text"
              placeholder="Type here and press enter..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="chatbot-input-actions">
              <button type="button" className="icon-action-btn" title="Like">
                <ThumbsUp size={16} />
              </button>
              <button type="button" className="icon-action-btn" title="Attach file">
                <Paperclip size={16} />
              </button>
              <button type="button" className="icon-action-btn" title="Add emoji">
                <Smile size={16} />
              </button>
              <button
                type="button"
                className="send-btn"
                onClick={() => handleSendMessage()}
                title="Send"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        type="button"
        className={`chatbot-trigger-btn ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Chat"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={26} />}
      </button>
    </div>
  );
}