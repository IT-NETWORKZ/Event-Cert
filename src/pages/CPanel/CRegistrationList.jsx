import React, { useMemo } from 'react';
import DataTable from '../../components/common/Table/DataTable';
import '../../css/CRegistrationList.css';

const CRegistrationList = () => {
  // 1. Columns configuration matching DataTable structures
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
        accessorKey: 'registrantName',
        header: 'Registrant Name',
        meta: { 
          className: 'text-start',
          width: '180px' 
        },
      },
      {
        accessorKey: 'email',
        header: 'Email Address',
        meta: { 
          className: 'text-start',
          width: '200px' 
        },
      },
      {
        accessorKey: 'eventTitle',
        header: 'Registered Event',
        meta: { 
          className: 'text-start',
          width: '220px' 
        },
      },
      {
        accessorKey: 'registrationDate',
        header: 'Reg. Date',
        meta: { 
          className: 'text-center',
          width: '130px' 
        },
      },
      {
        accessorKey: 'amountPaid',
        header: 'Amount',
        meta: { 
          className: 'text-end',
          width: '110px' 
        },
        cell: (info) => {
          const val = info.getValue();
          return val && val !== "0" ? `₹${val}` : "Free";
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        meta: { 
          className: 'text-center',
          width: '120px' 
        },
        cell: ({ row }) => {
          const status = row.original.status || 'Active';
          return (
            <span className={`status-badge status-${status.toLowerCase()}`}>
              {status}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        meta: { 
          className: 'text-center',
          width: '120px' 
        },
        cell: ({ row }) => (
          <button
            type="button"
            className="btn btn-sm btn-outline-success px-3 py-1"
            style={{ borderRadius: '15px', fontSize: '12px' }}
            onClick={() => alert(`Viewing registration details for ${row.original.registrantName}`)}
          >
            Edit
          </button>
        ),
      },
    ],
    []
  );

  // 2. Mock Registration Data
  const data = useMemo(
    () => [
      {
        id: 1,
        registrantName: 'Amit Sharma',
        email: 'amit.sharma@gmail.com',
        eventTitle: 'Tech Summit 2026',
        registrationDate: '2026-07-10',
        amountPaid: '1500',
        status: 'Active',
      },
      {
        id: 2,
        registrantName: 'Priya Patel',
        email: 'priya.patel@yahoo.com',
        eventTitle: 'AI & ML Workshop',
        registrationDate: '2026-07-11',
        amountPaid: '500',
        status: 'Active',
      },
      {
        id: 3,
        registrantName: 'Rohan Verma',
        email: 'rohan.v@outlook.com',
        eventTitle: 'UI/UX Design Forum',
        registrationDate: '2026-07-12',
        amountPaid: '0',
        status: 'Active',
      },
      {
        id: 4,
        registrantName: 'Sneha Reddy',
        email: 'sneha.reddy@techcorp.com',
        eventTitle: 'Cybersecurity Expo',
        registrationDate: '2026-07-13',
        amountPaid: '2000',
        status: 'Cancelled',
      },
      {
        id: 5,
        registrantName: 'Vikram Singh',
        email: 'vikram.singh@gmail.com',
        eventTitle: 'Kubernetes Days',
        registrationDate: '2026-07-14',
        amountPaid: '300',
        status: 'Active',
      },
    ],
    []
  );

  // 3. Export Handler
  const handleExportExcel = () => {
    console.log('Exporting registration list to Excel...');
    alert('Exporting registration data to Excel format!');
  };

  return (
    <div className="container-fluid py-4 registration-page-wrapper">
      <div className="container">
        
        {/* Uniform Header Section */}
        <div className="mb-4">
          <h4 className="header-title">Event Registrations</h4>
          
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

export default CRegistrationList;