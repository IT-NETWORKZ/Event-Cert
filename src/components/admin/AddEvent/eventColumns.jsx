// Keep it as eventColumns.js by returning strings instead of HTML markup components:
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
    // No JSX tags here! Just pure JavaScript text manipulation
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
    cell: (info) => `${info.row.original.city}, ${info.row.original.state}`,
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
    cell: () => "✏️", // Just plain text emoji string
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => info.getValue(),
  },
];