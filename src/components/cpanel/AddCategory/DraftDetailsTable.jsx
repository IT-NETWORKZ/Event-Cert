import React, { useMemo } from "react";
import DataTable from "../../common/Table/DataTable"; 
import "./DraftDetailsTable.css";

const STATIC_DRAFT_DATA = [
  {
    id: 1,
    registeredDate: "20/07/2026",
    modifiedDate: "20/07/2026",
    category: "First Writing Ceremony",
    details: "॥ श्री गणेशाय नमः ॥ ॥ श्री सरस्वत्यै नमः ॥ अक्षरा...",
    type: "Invitation",
  },
  {
    id: 2,
    registeredDate: "20/07/2026",
    modifiedDate: "20/07/2026",
    category: "Get-Together",
    details: "॥ श्री गणेशाय नमः ॥ स्नेहमेळावा निमंत्रण लग्नसोहळ...",
    type: "Invitation",
  },
  {
    id: 3,
    registeredDate: "20/07/2026",
    modifiedDate: "20/07/2026",
    category: "Kelvan (Pre-wedding feast/celebration)",
    details: "॥ श्री गणेशाय नमः ॥ ॥ श्री सीतारामचंद्राम्यां नमः ...",
    type: "Invitation",
  },
  {
    id: 4,
    registeredDate: "20/07/2026",
    modifiedDate: "20/07/2026",
    category: "Blessing Ceremony",
    details: "॥ श्री गणेशाय नमः ॥ ॥ श्री सीतारामचंद्राम्यां नमः ...",
    type: "Invitation",
  },
  {
    id: 5,
    registeredDate: "20/07/2026",
    modifiedDate: "20/07/2026",
    category: "Wedding",
    details: "॥ श्री गणेशाय नमः ॥ ॥ श्री सीतारामचंद्राम्यां नमः ...",
    type: "Invitation",
  },
];

export default function DraftDetailsTable({ draftList = [], onEditDraft }) {
  const tableData = draftList.length > 0 ? draftList : STATIC_DRAFT_DATA;

  const columns = useMemo(
    () => [
      {
        header: "Sr. No.",
        accessorKey: "srNo",
        enableSorting: false,
        meta: { width: "90px", className: "text-center" },
        cell: (info) => info.row.index + 1,
      },
      {
        header: "Registered Date",
        accessorKey: "registeredDate",
        meta: { width: "160px", className: "text-center" },
      },
      {
        header: "Modified Date",
        accessorKey: "modifiedDate",
        meta: { width: "160px", className: "text-center" },
      },
      {
        header: "Category",
        accessorKey: "category",
        meta: { width: "240px", className: "text-start" },
      },
      {
        header: "Details",
        accessorKey: "details",
        meta: { width: "380px", className: "text-start" },
        cell: (info) => {
          const text = info.getValue() || "";
          const isLong = text.length > 45;
          const previewText = isLong ? `${text.substring(0, 45)}... ` : text;

          return (
            <div className="details-cell-content">
              <span>{previewText}</span>
              {isLong && (
                <button
                  type="button"
                  className="read-more-btn"
                  onClick={() => alert(`Full Content:\n\n${text}`)}
                >
                  Read More
                </button>
              )}
            </div>
          );
        },
      },
      {
        header: "Type",
        accessorKey: "type",
        meta: { width: "140px", className: "text-center" },
      },
      {
        header: "Edit",
        id: "editAction",
        enableSorting: false,
        meta: { width: "110px", className: "text-center" },
        cell: (info) => (
          <button
            type="button"
            className="table-edit-btn"
            onClick={() => onEditDraft && onEditDraft(info.row.original)}
          >
            Edit
          </button>
        ),
      },
    ],
    [onEditDraft]
  );

  return (
    <div className="table-responsive">
      <DataTable columns={columns} data={tableData} />
    </div>
  );
}