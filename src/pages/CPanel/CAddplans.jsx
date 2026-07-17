import React, { useMemo, useState } from "react";
import DataTable from "../../components/common/Table/DataTable";
import Addplans from "../../components/cpanel/Addplans/Addplans";
import "../../css/CAddplans.css"
const initialDummyPlans = [
    {
        id: 1,
        planType: "Certificate",
        durationNum: "12",
        durationUnit: "Month/s",
        certificateQuantity: "5000",
        eventQuantity: "0",
        price: "4999",
        title: "Pro Creator",
        status: "Active"
    },
    {
        id: 2,
        planType: "Event + Certificate",
        durationNum: "6",
        durationUnit: "Month/s",
        certificateQuantity: "1500",
        eventQuantity: "10",
        price: "2499",
        title: "Starter Bundle",
        status: "Active"
    },
    {
        id: 3,
        planType: "Event",
        durationNum: "1",
        durationUnit: "Year/s",
        certificateQuantity: "0",
        eventQuantity: "50",
        price: "8999",
        title: "Enterprise Events",
        status: "Active"
    }
];

const CAddplans = () => {
    const [plansList, setPlansList] = useState(initialDummyPlans);

    // Handle addition of a new plan from the child card
    const handleAddPlan = (newPlan) => {
        setPlansList((prev) => [newPlan, ...prev]);
    };

    // Configure DataTable columns
    const planColumns = useMemo(
        () => [
            {
                id: "srNo",
                header: "Sr No",
                accessorFn: (_, index) => index + 1,
                enableSorting: true,
                meta: {
                    className: "text-center",
                    width: "80px",
                },
                cell: ({ row }) => row.index + 1,
            },
            {
                accessorKey: "title",
                header: "Plan Title",
                meta: { className: "text-start", width: "150px" },
            },
            {
                accessorKey: "planType",
                header: "Type",
                meta: { className: "text-start", width: "180px" },
            },
            {
                header: "Duration",
                id: "durationDisplay",
                meta: { className: "text-center", width: "120px" },
                cell: ({ row }) => `${row.original.durationNum} ${row.original.durationUnit}`,
            },
            {
                accessorKey: "certificateQuantity",
                header: "Cert. Qty",
                meta: { className: "text-center", width: "110px" },
            },
            {
                accessorKey: "eventQuantity",
                header: "Event Qty",
                meta: { className: "text-center", width: "110px" },
            },
            {
                accessorKey: "price",
                header: "Price",
                meta: { className: "text-end", width: "110px" },
                cell: (info) => {
                    const val = info.getValue();
                    return val && val !== "0" ? `₹${val}` : "Free";
                },
            },
            {
                accessorKey: "status",
                header: "Status",
                meta: { className: "text-center", width: "120px" },
                cell: ({ row }) => {
                    const status = row.original.status || "Active";
                    return (
                        <span className={`status-badge status-${status.toLowerCase()}`}>
                            {status}
                        </span>
                    );
                },
            },
            {
                id: "actions",
                header: "Actions",
                meta: { className: "text-center", width: "120px" },
                cell: ({ row }) => (
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-success px-3 py-1"
                        style={{ borderRadius: "15px", fontSize: "12px" }}
                        onClick={() => alert(`Details for: ${row.original.title}`)}
                    >
                        View
                    </button>
                ),
            },
        ],
        []
    );

    const handleExportExcel = () => {
        alert("Exporting plans data to Excel!");
    };
    return (
        <div className="container-fluid py-4 c-addplans-wrapper">

            <div className="container">

                {/* ==========================
          Add Plan Form
      =========================== */}
                <section className="mb-4">
                    <Addplans onAddPlan={handleAddPlan} />
                </section>

                {/* ==========================
          Plans Table
      =========================== */}
                <section className="table-card-wrapper shadow-sm p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                        <div>
                            <h4 className="fw-bold mb-1">Registered Plans</h4>

                        </div>
                    </div>

                    <DataTable
                        columns={planColumns}
                        data={plansList}
                        onExportExcel={handleExportExcel}
                    />
                </section>

            </div>

        </div>
    );
};

export default CAddplans;