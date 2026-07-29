// import React, { useMemo, useState } from 'react';
// import DataTable from '../../common/Table/DataTable'; // Adjust import path according to your folder structure
// import './PromoCodeTable.css';

// const PromoCodeTable = () => {
//   // Sample initial data matching the design in your image
//   const [tableData] = useState([
//     {
//       srNo: 1,
//       date: '21/07/2026',
//       promoCode: 'Kapil100',
//       discount: '100.0000%',
//       assignType: 'Single',
//       planType: 'Event + Certificate / Card Plan - 2 Month/s',
//       validityPeriod: '21/07/2026 to 06/08/2026',
//       status: 'Enable',
//     },
//     {
//       srNo: 2,
//       date: '21/07/2026',
//       promoCode: 'Kapil',
//       discount: '100.0000%',
//       assignType: 'Single',
//       planType: 'Download Plan - 1 Month/s',
//       validityPeriod: '21/07/2026 to 06/08/2026',
//       status: 'Enable',
//     },
//     {
//       srNo: 3,
//       date: '21/07/2026',
//       promoCode: 'Manoj100',
//       discount: '100.0000%',
//       assignType: 'Single',
//       planType: 'Event + Certificate / Card Plan - 2 Month/s',
//       validityPeriod: '21/07/2026 to 06/08/2026',
//       status: 'Enable',
//     },
//     {
//       srNo: 4,
//       date: '21/07/2026',
//       promoCode: 'Manoj',
//       discount: '100.0000%',
//       assignType: 'Single',
//       planType: 'Download Plan - 1 Month/s',
//       validityPeriod: '21/07/2026 to 06/08/2026',
//       status: 'Enable',
//     },
//     {
//       srNo: 5,
//       date: '21/07/2026',
//       promoCode: 'Kavita100',
//       discount: '100.0000%',
//       assignType: 'Single',
//       planType: 'Event + Certificate / Card Plan - 2 Month/s',
//       validityPeriod: '21/07/2026 to 06/08/2026',
//       status: 'Enable',
//     },
//     {
//       srNo: 6,
//       date: '21/07/2026',
//       promoCode: 'Kavita',
//       discount: '100.0000%',
//       assignType: 'Single',
//       planType: 'Download Plan - 1 Month/s',
//       validityPeriod: '21/07/2026 to 06/08/2026',
//       status: 'Enable',
//     },
//   ]);

//   // Column definitions matching your exact required fields
//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: 'srNo',
//         header: 'Sr.No',
//         meta: { width: '70px', className: 'text-center' },
//       },
//       {
//         accessorKey: 'date',
//         header: 'Date',
//         meta: { width: '110px', className: 'text-center' },
//       },
//       {
//         accessorKey: 'promoCode',
//         header: 'Promo Code',
//         meta: { width: '130px', className: 'text-center font-weight-bold' },
//       },
//       {
//         accessorKey: 'discount',
//         header: 'Discount (%)',
//         meta: { width: '120px', className: 'text-center' },
//       },
//       {
//         accessorKey: 'assignType',
//         header: 'Assign Type',
//         meta: { width: '110px', className: 'text-center' },
//       },
//       {
//         accessorKey: 'planType',
//         header: 'Plan Type',
//         meta: { width: '250px', className: 'text-center' },
//       },
//       {
//         accessorKey: 'validityPeriod',
//         header: 'Validity Period',
//         meta: { width: '180px', className: 'text-center' },
//       },
//       {
//         accessorKey: 'status',
//         header: 'Status',
//         meta: { width: '100px', className: 'text-center' },
//         cell: ({ getValue }) => (
//           <span className="badge-status-green">
//             {getValue()}
//           </span>
//         ),
//       },
//     ],
//     []
//   );

//   return (
//     <div className="promo-table-card">
//       {/* Title Header Section matching your screenshot */}
//       <div className="promo-table-header">
//         <h2 className="promo-table-title">
//           Promo <span className="highlight">Code</span> Details
//         </h2>
//         <div className="title-underline"></div>
//       </div>

//       {/* Calling Reusable DataTable */}
//       <DataTable columns={columns} data={tableData} />
//     </div>
//   );
// };

// export default PromoCodeTable;

import React, { useMemo, useState } from 'react';
import DataTable from '../../common/Table/DataTable'; // Adjust import path if needed
import './PromoCodeTable.css';

const PromoCodeTable = () => {
  // 1. Initial State Data
  const [tableData, setTableData] = useState([
    {
      id: 1,
      srNo: 1,
      date: '21/07/2026',
      promoCode: 'Kapil100',
      discount: '100.0000%',
      assignType: 'Single',
      planType: 'Event + Certificate / Card Plan - 2 Month/s',
      validityPeriod: '21/07/2026 to 06/08/2026',
      status: 'Enable',
    },
    {
      id: 2,
      srNo: 2,
      date: '21/07/2026',
      promoCode: 'Kapil',
      discount: '100.0000%',
      assignType: 'Single',
      planType: 'Download Plan - 1 Month/s',
      validityPeriod: '21/07/2026 to 06/08/2026',
      status: 'Enable',
    },
    {
      id: 3,
      srNo: 3,
      date: '21/07/2026',
      promoCode: 'Manoj100',
      discount: '100.0000%',
      assignType: 'Single',
      planType: 'Event + Certificate / Card Plan - 2 Month/s',
      validityPeriod: '21/07/2026 to 06/08/2026',
      status: 'Enable',
    },
    {
      id: 4,
      srNo: 4,
      date: '21/07/2026',
      promoCode: 'Manoj',
      discount: '100.0000%',
      assignType: 'Single',
      planType: 'Download Plan - 1 Month/s',
      validityPeriod: '21/07/2026 to 06/08/2026',
      status: 'Enable',
    },
    {
      id: 5,
      srNo: 5,
      date: '21/07/2026',
      promoCode: 'Kavita100',
      discount: '100.0000%',
      assignType: 'Single',
      planType: 'Event + Certificate / Card Plan - 2 Month/s',
      validityPeriod: '21/07/2026 to 06/08/2026',
      status: 'Enable',
    },
    {
      id: 6,
      srNo: 6,
      date: '21/07/2026',
      promoCode: 'Kavita',
      discount: '100.0000%',
      assignType: 'Single',
      planType: 'Download Plan - 1 Month/s',
      validityPeriod: '21/07/2026 to 06/08/2026',
      status: 'Enable',
    },
  ]);

  // 2. Status Toggle Handler (Updates State)
  const handleStatusToggle = (targetId) => {
    setTableData((prevData) =>
      prevData.map((row) =>
        row.id === targetId
          ? { ...row, status: row.status === 'Enable' ? 'Disable' : 'Enable' }
          : row
      )
    );
  };

  // 3. TanStack Column Definitions
  const columns = useMemo(
    () => [
      {
        accessorKey: 'srNo',
        header: 'Sr.No',
        meta: { width: '70px', className: 'text-center' },
        cell: (info) => info.row.index + 1,
      },
      {
        accessorKey: 'date',
        header: 'Date',
        meta: { width: '120px', className: 'text-center' },
      },
      {
        accessorKey: 'promoCode',
        header: 'Promo Code',
        meta: { width: '140px', className: 'text-center font-weight-bold' },
      },
      {
        accessorKey: 'discount',
        header: 'Discount (%)',
        meta: { width: '130px', className: 'text-center' },
      },
      {
        accessorKey: 'assignType',
        header: 'Assign Type',
        meta: { width: '120px', className: 'text-center' },
      },
      {
        accessorKey: 'planType',
        header: 'Plan Type',
        meta: { width: '280px', className: 'text-start' },
      },
      {
        accessorKey: 'validityPeriod',
        header: 'Validity Period',
        meta: { width: '200px', className: 'text-center' },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        meta: { width: '120px', className: 'text-center' },
        cell: (info) => {
          const rowData = info.row.original;
          const isEnabled = rowData.status === 'Enable';

          return (
            <button
              type="button"
              className={`status-action-btn ${isEnabled ? 'btn-status-enable' : 'btn-status-disable'}`}
              onClick={() => handleStatusToggle(rowData.id)}
            >
              {rowData.status}
            </button>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="promo-table-card">
      {/* Title Header */}
      <div className="promo-table-header">
        <h2 className="promo-table-title">
          Promo <span className="highlight">Code</span> Details
        </h2>
        <div className="title-underline"></div>
      </div>

      {/* Reusable DataTable Component */}
      <DataTable columns={columns} data={tableData} />
    </div>
  );
};

export default PromoCodeTable;