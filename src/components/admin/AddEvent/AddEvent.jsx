import React, { useState } from "react";
import "./AddEvent.css";
import EventDetailsTable from "./EventDetailsTable";
import { div } from "framer-motion/client";

const AddEvent = () => {
  const [formData, setFormData] = useState({
    duration: "1 Weeks",
    mode: "",
    organizationName: "",
    eventTitle: "",
    advStartDate: "",
    advCompletionDate: "",
    eventStartDate: "",
    eventCompletionDate: "",
    setTime: "",
    venue: "",
    city: "",
    state: "",
    country: "",
    bannerImage: null,
    aboutEvent: "",
    instructions: "",
    entryFee: "",
    paymentMode: "",
    eventType: "Individual", // New Field: Individual or Group
    minTeamSize: "1",         // New Field: Default min size
    maxTeamSize: "1",         // New Field: Default max size
    showPaymentDetails: false,
    paymentMethod: "GPay", 
    upiId: "",
    mobileNo: "",
    qrCode: null,
    bankHolderName: "",
    bankName: "",
    accountNo: "",
    ifscCode: "",
  });

  const durationOptions = [
    "1 Weeks", "6 Weeks", "2 Month", "3 Months", "4 Months", "6 Months", "1 Year"
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      // Reset team sizes back to 1 if the manager switches back to Individual
      if (name === "eventType" && value === "Individual") {
        updatedData.minTeamSize = "1";
        updatedData.maxTeamSize = "1";
      }

      return updatedData;
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  const selectPaymentMethod = (method) => {
    setFormData((prev) => ({ ...prev, paymentMethod: method }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Event Data Form: ", formData);
  };

  return (
    <div>
    <div className="add-event-container">
      <h2 className="form-main-title">Add Event</h2>
      
      <form onSubmit={handleSubmit} className="event-form">
        
        {/* Instructions Block */}
        <div className="instructions-section">
          <h3>Instructions</h3>
          <ul>
            <li>Kindly use only <strong>PNG</strong> or <strong>JPG</strong> image for the banner.</li>
            <li>Image size should be maximum <strong>2MB</strong>.</li>
          </ul>
        </div>

        {/* Duration Radio Options Grid */}
        <div className="duration-grid">
          {durationOptions.map((opt) => (
            <label key={opt} className={`duration-label ${formData.duration === opt ? 'active' : ''}`}>
              <input
                type="radio"
                name="duration"
                value={opt}
                checked={formData.duration === opt}
                onChange={handleChange}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>

        {/* 2-Column Standard Responsive Fields Grid */}
        <div className="form-fields-grid">
          
          <div className="form-group full-width-mobile">
            <label>Mode <span className="required">*</span></label>
            <select name="mode" value={formData.mode} onChange={handleChange} required>
              <option value="">Select Mode</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div className="form-group">
            <label>Organization Name <span className="required">*</span></label>
            <input type="text" name="organizationName" value={formData.organizationName} onChange={handleChange} required placeholder="Organization Name" />
          </div>

          <div className="form-group">
            <label>Event Title <span className="required">*</span></label>
            <input type="text" name="eventTitle" value={formData.eventTitle} onChange={handleChange} required placeholder="Event Title" />
          </div>

          <div className="form-group">
            <label>Adv. Start Date <span className="required">*</span></label>
            <input type="date" name="advStartDate" value={formData.advStartDate} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Adv. Completion Date <span className="required">*</span></label>
            <input type="date" name="advCompletionDate" value={formData.advCompletionDate} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Event Start Date <span className="required">*</span></label>
            <input type="date" name="eventStartDate" value={formData.eventStartDate} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Event Completion Date <span className="required">*</span></label>
            <input type="date" name="eventCompletionDate" value={formData.eventCompletionDate} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Set Time <span className="required">*</span></label>
            <input type="time" name="setTime" value={formData.setTime} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Venue <span className="required">*</span></label>
            <input type="text" name="venue" value={formData.venue} onChange={handleChange} required placeholder="Event Venue" />
          </div>

          <div className="form-group">
            <label>City <span className="required">*</span></label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} required placeholder="City" />
          </div>

          <div className="form-group">
            <label>State <span className="required">*</span></label>
            <input type="text" name="state" value={formData.state} onChange={handleChange} required placeholder="State" />
          </div>

          <div className="form-group">
            <label>Country <span className="required">*</span></label>
            <input type="text" name="country" value={formData.country} onChange={handleChange} required placeholder="Country" />
          </div>

          <div className="form-group">
            <label>Upload Image <span className="required">*</span></label>
            <input type="file" name="bannerImage" accept="image/jpeg, image/png" onChange={handleFileChange} required />
          </div>

          {/* New Event Type Field */}
          <div className="form-group">
            <label>Event Type <span className="required">*</span></label>
            <select name="eventType" value={formData.eventType} onChange={handleChange} required>
              <option value="Individual">Individual</option>
              <option value="Group">Group / Team</option>
            </select>
          </div>
        </div>

        {/* Conditional Team Sizes Setup */}
        {formData.eventType === "Group" && (
          <div className="form-fields-grid conditional-team-section">
            <div className="form-group">
              <label>Min Team Size <span className="required">*</span></label>
              <input 
                type="number" 
                name="minTeamSize" 
                min="1" 
                value={formData.minTeamSize} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Max Team Size <span className="required">*</span></label>
              <input 
                type="number" 
                name="maxTeamSize" 
                min={formData.minTeamSize || "1"} 
                value={formData.maxTeamSize} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>
        )}

        {/* Text Areas Section */}
        <div className="textarea-group">
          <label>About Event <span className="required">*</span></label>
          <textarea
            name="aboutEvent"
            maxLength="300"
            value={formData.aboutEvent}
            onChange={handleChange}
            required
            placeholder="About Event"
          />
          <div className="char-counter">{formData.aboutEvent.length}/300 Characters</div>
        </div>

        <div className="textarea-group">
          <label>Instructions / Contact Details <span className="required">*</span></label>
          <textarea
            name="instructions"
            maxLength="300"
            value={formData.instructions}
            onChange={handleChange}
            required
            placeholder="Instructions / Contact Details"
          />
          <div className="char-counter">{formData.instructions.length}/300 Characters</div>
        </div>

        {/* Fees and Base Payment Mode */}
        <div className="form-fields-grid">
          <div className="form-group">
            <label>Entry Fee <span className="required">*</span></label>
            <input type="number" name="entryFee" value={formData.entryFee} onChange={handleChange} required placeholder="Fee" />
          </div>

          <div className="form-group">
            <label>Payment Mode <span className="required">*</span></label>
            <select name="paymentMode" value={formData.paymentMode} onChange={handleChange} required>
              <option value="">Payment Mode</option>
              <option value="Cash">Cash</option>
              <option value="Online">Online</option>
            </select>
          </div>
        </div>

        {/* Dynamic Add Payment Details Checkbox toggle */}
        <div className="checkbox-container">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="showPaymentDetails"
              checked={formData.showPaymentDetails}
              onChange={handleChange}
            />
            <span className="checkbox-custom-box"></span>
            Add Payment Details
          </label>
        </div>

        {/* Conditional Payment Methods block */}
        {formData.showPaymentDetails && (
          <div className="payment-details-section">
            <h4 className="payment-title">Select Payment Method</h4>
            
            <div className="payment-methods-row">
              <button
                type="button"
                className={`pay-method-btn ${formData.paymentMethod === "GPay" ? "selected" : ""}`}
                onClick={() => selectPaymentMethod("GPay")}
              >
                <span className="pay-icon gpay-icon">G Pay</span>
              </button>
              <button
                type="button"
                className={`pay-method-btn ${formData.paymentMethod === "PhonePe" ? "selected" : ""}`}
                onClick={() => selectPaymentMethod("PhonePe")}
              >
                <span className="pay-icon phonepe-icon">PhonePe</span>
              </button>
              <button
                type="button"
                className={`pay-method-btn ${formData.paymentMethod === "Paytm" ? "selected" : ""}`}
                onClick={() => selectPaymentMethod("Paytm")}
              >
                <span className="pay-icon paytm-icon">Paytm</span>
              </button>
            </div>

            <div className="form-fields-grid">
              <div className="form-group">
                <label>UPI ID</label>
                <input type="text" name="upiId" value={formData.upiId} onChange={handleChange} placeholder="UPI ID" />
              </div>
              <div className="form-group">
                <label>Mobile No.</label>
                <input type="text" name="mobileNo" value={formData.mobileNo} onChange={handleChange} placeholder="Mobile No." />
              </div>
              <div className="form-group full-width">
                <label>Upload QR Code</label>
                <input type="file" name="qrCode" accept="image/*" onChange={handleFileChange} />
              </div>
            </div>

            <h4 className="payment-title sub-title">Bank Details</h4>
            <div className="form-fields-grid">
              <div className="form-group">
                <label>Bank Holder Name</label>
                <input type="text" name="bankHolderName" value={formData.bankHolderName} onChange={handleChange} placeholder="Bank Holder Name" />
              </div>
              <div className="form-group">
                <label>Bank Name</label>
                <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} placeholder="Bank Name" />
              </div>
              <div className="form-group">
                <label>Account No.</label>
                <input type="text" name="accountNo" value={formData.accountNo} onChange={handleChange} placeholder="Account No." />
              </div>
              <div className="form-group">
                <label>IFSC Code</label>
                <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleChange} placeholder="IFSC Code" />
              </div>
            </div>
          </div>
        )}

        {/* Submit Actions Button */}
        <div className="form-actions">
          <button type="submit" className="btn-submit-event">Create Event</button>
        </div>


      </form>
       </div>

<EventDetailsTable />

      
    </div>
    
    
  );
};

export default AddEvent;