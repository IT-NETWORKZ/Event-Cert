export const paymentColumns = [
  {
    accessorKey: "srNo",
    header: "Sr No",
    enableSorting: true,
  },
  {
    accessorKey: "orderedDate",
    header: "Ordered Date",
    enableSorting: true,
  },
  {
    accessorKey: "selectedPlan",
    header: "Selected Plan",
    enableSorting: true,
  },
  {
    accessorKey: "orgName",
    header: "Organization",
    enableSorting: true,
  },
  {
    accessorKey: "department",
    header: "Department",
    enableSorting: true,
  },
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: true,
  },
  {
    accessorKey: "total",
    header: "Total",
    enableSorting: true,
    cell: ({ row }) => `₹${row.original.total}`,
  },
  {
    accessorKey: "gstNo",
    header: "GST No",
    enableSorting: true,
  },
  {
    accessorKey: "paymentStatus",
    header: "Status",
    enableSorting: true,
  },
];