import React from 'react';
import "./eventinfo.css";
import { Search } from "lucide-react";

function Eventinfo() {
  return (
    <section className="eventinfo-section py-4">
      <div className="container">

        {/* Heading */}
        <div className="row">
          <div className="col-12 text-center">
            <h2 className="about-title">
              Get your <span className="highlight">EVENT</span> info here
            </h2>
            <div className="title-line"></div>
          </div>
        </div>

        {/* Search Area */}
        <div className="row justify-content-center mt-4">
          <div className="col-xl-9 col-lg-10">
            <div className="row g-3">
              {/* State */}
              <div className="col-md-4">
                <select className="form-select search-input">
                  <option>State</option>
                </select>
              </div>

              {/* City */}
              <div className="col-md-4">
                <select className="form-select search-input">
                  <option>City</option>
                </select>
              </div>

              {/* Event Search */}
              <div className="col-md-4">
                <div className="event-search">
                  <input
                    type="text"
                    placeholder="Event Name"
                    className="event-input"
                  />
                  <div className="search-btn">
                    <Search size={22} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State - Tightly controlled margin spaces */}
        <div className="row mt-4 mb-2">
          <div className="col-12">
            <p className="empty-event mb-0">
              No events found.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Eventinfo;