import React, { useMemo } from "react";
import DataTable from "../../components/common/Table/DataTable";
import "../../css/CPContact.css";

const CPContact = () => {
  const columns = useMemo(
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
        accessorKey: "name",
        header: "Contact Name",
        meta: {
          className: "text-start",
          width: "180px",
        },
      },
      {
        accessorKey: "email",
        header: "Email Address",
        meta: {
          className: "text-start",
          width: "240px",
        },
      },
      {
        accessorKey: "phone",
        header: "Phone Number",
        meta: {
          className: "text-center",
          width: "160px",
        },
      },
      {
        accessorKey: "company",
        header: "Company / Agency",
        meta: {
          className: "text-start",
          width: "200px",
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        meta: {
          className: "text-center",
          width: "120px",
        },
        cell: ({ row }) => row.original.status || "Active",
      },
      {
        id: "actions",
        header: "Actions",
        meta: {
          className: "text-center",
          width: "120px",
        },
        cell: ({ row }) => (
          <button
            type="button"
            className="btn btn-sm btn-outline-success px-3 py-1"
            style={{
              borderRadius: "15px",
              fontSize: "12px",
            }}
            onClick={() => alert(`Editing details for ${row.original.name}`)}
          >
            Edit
          </button>
        ),
      },
    ],
    []
  );

  const data = useMemo(
    () => [
      {
        id: 1,
        name: "Alex Johnson",
        email: "alex.j@partnercorp.com",
        phone: "+1 (555) 019-2834",
        company: "PartnerCorp Ltd",
        status: "Active",
      },
      {
        id: 2,
        name: "Sarah Smith",
        email: "sarah.smith@innovate.io",
        phone: "+1 (555) 014-9921",
        company: "Innovate Solutions",
        status: "Active",
      },
      {
        id: 3,
        name: "Michael Brown",
        email: "m.brown@vertexagency.com",
        phone: "+1 (555) 017-4839",
        company: "Vertex Agency",
        status: "Inactive",
      },
      {
        id: 4,
        name: "Emily Davis",
        email: "emily.d@nexustech.org",
        phone: "+1 (555) 012-7743",
        company: "Nexus Technologies",
        status: "Active",
      },
      {
        id: 5,
        name: "David Wilson",
        email: "d.wilson@alphagroup.com",
        phone: "+1 (555) 015-3211",
        company: "Alpha Group",
        status: "Inactive",
      },
    ],
    []
  );

  const handleExportExcel = () => {
    alert("Exporting contacts to Excel...");
  };

  return (
    <div className="container-fluid py-4 cp-page-wrapper">
      <div className="container">
        
        {/* Uniform Header Section */}
        <div className="mb-4">
          <h4 className="header-title">Contact Details</h4>
      
        </div>

        {/* Responsive Horizontal Scroll Wrapper */}
        <div className="table-responsive-scroll-wrapper">
          <DataTable
            columns={columns}
            data={data}
            onExportExcel={handleExportExcel}
          />
        </div>

      </div>
    </div>
  );
};

export default CPContact;