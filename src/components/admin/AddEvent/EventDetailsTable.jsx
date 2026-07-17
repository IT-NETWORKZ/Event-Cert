import React from "react";
import DataTable from "../../common/Table/DataTable.jsx"; 
import { eventColumns } from "./eventColumns.jsx";   
import { mockEventData } from "./eventData";
import "./AddEvent.css"; 

const EventDetailsTable = () => {
  return (
    <div className="event-details-section-wrapper" style={{ marginTop: "40px" }}>
      
      
      <div 
        className="table-scroll-container event-details-large-grid" 
        style={{ 
          width: "100%", 
          overflowX: "auto",
          WebkitOverflowScrolling: "touch" 
        }}
      >
        <h3 className="form-main-title" style={{ textAlign: "center", fontSize: "1.8rem", fontFamily: "cursive", marginTop: "20px" }}>
        Event Details
      </h3>
        <style>{`
          /* Targets the actual table element inside your custom DataTable component */
          .event-details-large-grid table {
            min-width: 2200px !important;
            width: 100% !important;
            table-layout: auto !important;
          }
          /* Gives headers and data cells enough safe space to spread out horizontally */
          .event-details-large-grid th,
          .event-details-large-grid td {
            white-space: nowrap !important;
            padding: 12px 16px !important;
          }
        `}</style>
        
        <DataTable columns={eventColumns} data={mockEventData} />
      </div>
    </div>
  );
};

export default EventDetailsTable;