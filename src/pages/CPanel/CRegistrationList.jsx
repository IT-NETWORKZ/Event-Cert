import React, { useMemo, useState } from "react";
import DataTable from "../../components/common/Table/DataTable";
import "../../css/CRegistrationList.css";

// 2026-10-06 -> 06-10-2026 (same format as the screenshot)
const fmt = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}-${m}-${y}`;
};

// age from the date of birth
const ageOf = (iso) => {
  if (!iso) return "";
  const dob = new Date(iso);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
};

// Sample data: replace with your API response
const sampleData = [
  { id: 1, regDate: "2026-10-06", eventCount: 0, cardCount: 0, customCount: 0, prefix: "Ms.", name: "Pooja Dikshit", designation: "student", email: "crm@nanisbuildcon.com", mobile: "888888888", dob: "2000-10-06", org: "S.B.jain", department: "IT", city: "Nagpur", enabled: true },
  { id: 2, regDate: "2026-10-05", eventCount: 0, cardCount: 0, customCount: 29, prefix: "Ms.", name: "Ritika Maskare", designation: "", email: "ritikamaskare@gmail.com", mobile: "7709082826", dob: "2000-11-23", org: "", department: "", city: "Amravati", enabled: true },
  { id: 3, regDate: "2026-10-05", eventCount: 0, cardCount: 0, customCount: 0, prefix: "Ms.", name: "Achal Shebe", designation: "", email: "achal.shebe22@gmail.com", mobile: "9022622194", dob: "2004-08-24", org: "RTMNU", department: "Department of electronics and communication", city: "Nagpur", enabled: true },
  { id: 4, regDate: "2026-10-04", eventCount: 2, cardCount: 5, customCount: 0, prefix: "Mr.", name: "Jay Kale", designation: "Student", email: "jayk282004@gmail.com", mobile: "8421467258", dob: "2004-08-28", org: "IICC", department: "IICC", city: "Nagpur", enabled: true },
  { id: 5, regDate: "2026-10-03", eventCount: 1, cardCount: 3, customCount: 4, prefix: "Ms.", name: "Pranjali Shivankar", designation: "", email: "pranjalishivankar8@gmail.com", mobile: "8552867515", dob: "2004-04-13", org: "IICC", department: "MCA", city: "Nagpur", enabled: false },
];

const CRegistrationList = ({ data = sampleData }) => {
  // keeps the Enabled / Disabled switch working until you connect your API
  const [rows, setRows] = useState(data);

  const toggleStatus = (id) => {
    // TODO: call your enable / disable API here
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };

  const columns = useMemo(
    () => [
      {
        id: "srNo",
        header: "Sr. No.",
        enableSorting: false,
        cell: ({ row }) => row.index + 1,
        meta: { className: "text-center", width: "80px" },
      },
      {
        accessorKey: "regDate",
        header: "Registration Date",
        cell: ({ getValue }) => fmt(getValue()),
        meta: { className: "text-center", width: "150px" },
      },
      {
        accessorKey: "eventCount",
        header: "Event Count",
        meta: { className: "text-center", width: "110px" },
      },
      {
        accessorKey: "cardCount",
        header: "Certificate / Cards Count",
        meta: { className: "text-center", width: "170px" },
      },
      {
        accessorKey: "customCount",
        header: "Custom Cards Count",
        meta: { className: "text-center", width: "150px" },
      },
      {
        id: "name",
        header: "Name",
        accessorFn: (r) => `${r.prefix || ""} ${r.name || ""}`.trim(),
        cell: ({ getValue }) => (
          <button type="button" className="crl-name" onClick={() => console.log("Open profile", getValue())}>
            {getValue()}
          </button>
        ),
        meta: { className: "text-center", width: "190px" },
      },
      {
        accessorKey: "designation",
        header: "Designation",
        meta: { className: "text-center", width: "150px" },
      },
      {
        accessorKey: "email",
        header: "Email Id",
        meta: { className: "text-center", width: "270px" },
      },
      {
        accessorKey: "mobile",
        header: "Mobile No.",
        meta: { className: "text-center", width: "150px" },
      },
      {
        accessorKey: "dob",
        header: "DOB",
        cell: ({ getValue }) => fmt(getValue()),
        meta: { className: "text-center", width: "130px" },
      },
      {
        id: "age",
        header: "Age",
        accessorFn: (r) => ageOf(r.dob),
        meta: { className: "text-center", width: "80px" },
      },
      {
        accessorKey: "org",
        header: "Org. Name",
        meta: { className: "text-center", width: "170px" },
      },
      {
        accessorKey: "department",
        header: "Department",
        meta: { className: "text-center", width: "200px" },
      },
      {
        accessorKey: "city",
        header: "City",
        meta: { className: "text-center", width: "130px" },
      },
      {
        id: "status",
        header: "Status",
        accessorFn: (r) => (r.enabled ? "Enabled" : "Disabled"),
        cell: ({ row }) => (
          <button
            type="button"
            className={`crl-status ${row.original.enabled ? "on" : "off"}`}
            onClick={() => toggleStatus(row.original.id)}
            title="Click to change status"
          >
            {row.original.enabled ? "Enabled" : "Disabled"}
          </button>
        ),
        meta: { className: "text-center", width: "130px" },
      },
    ],
    []
  );

  const handleExportExcel = () => {
    // TODO: connect your export-to-Excel logic
    console.log("Export admin registrations", rows);
  };

  return (
    <div className="container-fluid py-4 registration-page-wrapper">
      <div className="container-fluid px-md-4">

        {/* Heading */}
        <div className="crl-head">
          <h4 className="header-title">Admin Registration Details</h4>
          <div className="crl-line"></div>
        </div>

        {/* Table card */}
        <div className="crl-card">
          <div className="table-responsive-scroll-wrapper">
            <DataTable columns={columns} data={rows} onExportExcel={handleExportExcel} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRegistrationList;


// import React, { useMemo } from 'react';
// import DataTable from '../../components/common/Table/DataTable';
// import '../../css/CRegistrationList.css';

// const CRegistrationList = () => {
//   // 1. Columns configuration matching DataTable structures
//   const columns = useMemo(
//     () => [
//       {
//         id: "srNo",
//         header: "Sr No",
//         accessorFn: (_, index) => index + 1,
//         enableSorting: true,
//         meta: {
//           className: "text-center",
//           width: "80px",
//         },
//         cell: ({ row }) => row.index + 1,
//       },
//       {
//         accessorKey: 'registrantName',
//         header: 'Registrant Name',
//         meta: { 
//           className: 'text-start',
//           width: '180px' 
//         },
//       },
//       {
//         accessorKey: 'email',
//         header: 'Email Address',
//         meta: { 
//           className: 'text-start',
//           width: '200px' 
//         },
//       },
//       {
//         accessorKey: 'eventTitle',
//         header: 'Registered Event',
//         meta: { 
//           className: 'text-start',
//           width: '220px' 
//         },
//       },
//       {
//         accessorKey: 'registrationDate',
//         header: 'Reg. Date',
//         meta: { 
//           className: 'text-center',
//           width: '130px' 
//         },
//       },
//       {
//         accessorKey: 'amountPaid',
//         header: 'Amount',
//         meta: { 
//           className: 'text-end',
//           width: '110px' 
//         },
//         cell: (info) => {
//           const val = info.getValue();
//           return val && val !== "0" ? `₹${val}` : "Free";
//         },
//       },
//       {
//         accessorKey: 'status',
//         header: 'Status',
//         meta: { 
//           className: 'text-center',
//           width: '120px' 
//         },
//         cell: ({ row }) => {
//           const status = row.original.status || 'Active';
//           return (
//             <span className={`status-badge status-${status.toLowerCase()}`}>
//               {status}
//             </span>
//           );
//         },
//       },
//       {
//         id: 'actions',
//         header: 'Actions',
//         meta: { 
//           className: 'text-center',
//           width: '120px' 
//         },
//         cell: ({ row }) => (
//           <button
//             type="button"
//             className="btn btn-sm btn-outline-success px-3 py-1"
//             style={{ borderRadius: '15px', fontSize: '12px' }}
//             onClick={() => alert(`Viewing registration details for ${row.original.registrantName}`)}
//           >
//             Edit
//           </button>
//         ),
//       },
//     ],
//     []
//   );

//   // 2. Mock Registration Data
//   const data = useMemo(
//     () => [
//       {
//         id: 1,
//         registrantName: 'Amit Sharma',
//         email: 'amit.sharma@gmail.com',
//         eventTitle: 'Tech Summit 2026',
//         registrationDate: '2026-07-10',
//         amountPaid: '1500',
//         status: 'Active',
//       },
//       {
//         id: 2,
//         registrantName: 'Priya Patel',
//         email: 'priya.patel@yahoo.com',
//         eventTitle: 'AI & ML Workshop',
//         registrationDate: '2026-07-11',
//         amountPaid: '500',
//         status: 'Active',
//       },
//       {
//         id: 3,
//         registrantName: 'Rohan Verma',
//         email: 'rohan.v@outlook.com',
//         eventTitle: 'UI/UX Design Forum',
//         registrationDate: '2026-07-12',
//         amountPaid: '0',
//         status: 'Active',
//       },
//       {
//         id: 4,
//         registrantName: 'Sneha Reddy',
//         email: 'sneha.reddy@techcorp.com',
//         eventTitle: 'Cybersecurity Expo',
//         registrationDate: '2026-07-13',
//         amountPaid: '2000',
//         status: 'Cancelled',
//       },
//       {
//         id: 5,
//         registrantName: 'Vikram Singh',
//         email: 'vikram.singh@gmail.com',
//         eventTitle: 'Kubernetes Days',
//         registrationDate: '2026-07-14',
//         amountPaid: '300',
//         status: 'Active',
//       },
//     ],
//     []
//   );

//   // 3. Export Handler
//   const handleExportExcel = () => {
//     console.log('Exporting registration list to Excel...');
//     alert('Exporting registration data to Excel format!');
//   };

//   return (
//     <div className="container-fluid py-4 registration-page-wrapper">
//       <div className="container">
        
//         {/* Uniform Header Section */}
//         <div className="mb-4">
//           <h4 className="header-title">Event Registrations</h4>
          
//         </div>

//         {/* Responsive Horizontal Scroll Wrapper */}
//         <div className="table-responsive-scroll-wrapper">
//           <DataTable
//             columns={columns}
//             data={data}
//             onExportExcel={handleExportExcel}
//           />
//         </div>

//       </div>
//     </div>
//   );
// };

// export default CRegistrationList;