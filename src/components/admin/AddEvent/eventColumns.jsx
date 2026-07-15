import React from "react";
import { Pencil } from "lucide-react";

export const eventColumns = [
  {
    accessorKey: "srNo",
    header: "Sr. No.",
    cell: (info) => info.row.index + 1,
  },
  {
    accessorKey: "advStartDate",
    header: "Adv. Start Date",
  },
  {
    accessorKey: "advCompletionDate",
    header: "Adv. Completion Date",
  },
  {
    accessorKey: "eventStartDate",
    header: "Event Start Date",
  },
  {
    accessorKey: "eventCompletionDate",
    header: "Event Completion Date",
  },
  {
    accessorKey: "organizationName",
    header: "Org. Name",
  },
  {
    accessorKey: "eventTitle",
    header: "Event Title",
  },
  {
    accessorKey: "aboutEvent",
    header: "About Event",
    cell: (info) => {
      const val = info.getValue() || "";
      return val.length > 30 ? val.substring(0, 30) + "..." : val;
    },
  },
  {
    accessorKey: "setTime",
    header: "Start Time",
  },
  {
    accessorKey: "venue",
    header: "Venue",
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: (info) => {
      const city = info.row.original.city || "";
      const state = info.row.original.state || "";
      return city && state ? `${city}, ${state}` : city || state || "-";
    },
  },
  {
    accessorKey: "bannerImage",
    header: "Adv. Banner Logo",
    cell: () => "View File",
  },
  {
    accessorKey: "instructions",
    header: "Inst. / Contact Details",
    cell: (info) => {
      const val = info.getValue() || "";
      return val.length > 30 ? val.substring(0, 30) + "..." : val;
    },
  },
  {
    accessorKey: "mode",
    header: "Mode",
  },
  {
    accessorKey: "entryFee",
    header: "Entry Fee",
    cell: (info) => `₹${info.getValue()}`,
  },
  {
    id: "edit",
    header: "Edit",
    cell: (info) => (
      <button
        type="button"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
        onClick={() => console.log("Edit item data:", info.row.original)}
      >
        <Pencil size={16} color="#007bff" />
      </button>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => info.getValue(),
  },
];