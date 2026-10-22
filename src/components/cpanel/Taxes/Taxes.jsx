import React, { useState } from "react";
import DataTable from "../../common/Table/DataTable";
import Button from "../../common/button/Button";
import "./Taxes.css";

const Taxes = () => {
  const [taxData, setTaxData] = useState([
    {
      id: 1,
      gst: "18.00",
      otherTaxes: "0.00",
    },
  ]);

  const handleEdit = (row) => {
    console.log("Edit tax for row:", row);
  };

  const columns = [
    {
      id: "sr_no",
      header: "Sr. No.",
      cell: ({ row, table }) => {
        const pageIndex = table.getState().pagination.pageIndex;
        const pageSize = table.getState().pagination.pageSize;
        return pageIndex * pageSize + row.index + 1;
      },
      width: "90px",
    },
    {
      id: "gst",
      header: "GST (%)",
      accessorKey: "gst",
    },
    {
      id: "other_taxes",
      header: "Other Taxes (%)",
      accessorKey: "otherTaxes",
    },
    {
      id: "edit",
      header: "Edit",
      cell: ({ row }) => (
        <Button 
          className="tax-edit-btn" 
          onClick={() => handleEdit(row.original)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="admin-tax-page-container">
      <div className="tax-table-wrap">
        <div className="tax-card">
          {/* Header & Title */}
          <div className="tax-head">
            <h2 className="tax-title">
              Tax <span>Details</span>
            </h2>
            <div className="tax-underline"></div>
          </div>

          {/* Reusable Data Table Container */}
          <div className="tax-scroll">
            <div className="table-responsive">
              <DataTable
                columns={columns}
                data={taxData}
                pagination
                responsive
                highlightOnHover
                striped={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Taxes;