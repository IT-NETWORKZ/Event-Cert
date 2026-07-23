import React, { useMemo, useState } from 'react';
import DataTable from '../../common/Table/DataTable'; // Adjust import path according to your folder structure
import Button from '../../common/button/Button'; // Adjust import path according to your folder structure
import './AddTemplateTable.css';

const AddTemplateTable = ({ onEdit, onToggleStatus }) => {
  // Initial state containing template data matching your screenshots
  const [tableData] = useState([
    {
      srNo: 1,
      userName: 'Arun',
      name: 'dbgr',
      utilityType: 'Yes',
      marketingType: '-',
      details: 'textimage',
      message: 'DSFS',
      withUserName: 'Yes',
      withParameters: 1,
      status: 'Enable',
    },
    {
      srNo: 2,
      userName: 'Arun',
      name: 'dbgr',
      utilityType: 'Yes',
      marketingType: '-',
      details: 'textimage',
      message: 'DSFS',
      withUserName: 'Yes',
      withParameters: 1,
      status: 'Enable',
    },
    {
      srNo: 3,
      userName: 'Vala',
      name: 'pay_cofrm_msg_5',
      utilityType: 'Yes',
      marketingType: '-',
      details: 'text',
      message:
        'Hello, We have received your payment successfully. Your transaction has been processed and the service is now active. Thank you for completing the payment.',
      withUserName: '-',
      withParameters: 0,
      status: 'Enable',
    },
  ]);

  // Column definitions matching your exact required fields
  const columns = useMemo(
    () => [
      {
        accessorKey: 'srNo',
        header: 'Sr. No.',
        meta: { width: '80px', className: 'text-center' },
      },
      {
        accessorKey: 'userName',
        header: 'User Name',
        meta: { width: '120px', className: 'text-start' },
      },
      {
        accessorKey: 'name',
        header: 'Name',
        meta: { width: '140px', className: 'text-start' },
      },
      {
        accessorKey: 'utilityType',
        header: 'Utility Type',
        meta: { width: '110px', className: 'text-center' },
        cell: ({ getValue }) => getValue() || '-',
      },
      {
        accessorKey: 'marketingType',
        header: 'Marketing Type',
        meta: { width: '130px', className: 'text-center' },
        cell: ({ getValue }) => getValue() || '-',
      },
      {
        accessorKey: 'details',
        header: 'Details',
        meta: { width: '110px', className: 'text-start' },
      },
      {
        accessorKey: 'message',
        header: 'Message',
        meta: { width: '220px', className: 'text-start' },
        cell: ({ getValue }) => (
          <div className="message-cell-content">
            {getValue()}
          </div>
        ),
      },
      {
        accessorKey: 'withUserName',
        header: 'With User Name',
        meta: { width: '130px', className: 'text-center' },
      },
      {
        accessorKey: 'withParameters',
        header: 'With Parameters',
        meta: { width: '130px', className: 'text-center' },
      },
      {
        id: 'edit',
        header: 'Edit',
        meta: { width: '90px', className: 'text-center' },
        cell: ({ row }) => (
          <Button
            type="button"
            className="btn btn-primary btn-sm rounded-pill px-3"
            onClick={() => onEdit && onEdit(row.original)}
          >
            Edit
          </Button>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        meta: { width: '100px', className: 'text-center' },
        cell: ({ row }) => {
          const isActive = row.original.status === 'Enable' || row.original.status === true;
          return (
            <Button
              type="button"
              className={`btn btn-sm rounded-pill px-3 ${
                isActive ? 'btn-success' : 'btn-secondary'
              }`}
              onClick={() => onToggleStatus && onToggleStatus(row.original)}
            >
              {isActive ? 'Enable' : 'Disable'}
            </Button>
          );
        },
      },
    ],
    [onEdit, onToggleStatus]
  );

  return (
    <div className="promo-table-card">
      {/* Title Header Section matching PromoCodeTable style */}
      <div className="promo-table-header">
        <h2 className="promo-table-title">
          Template <span className="highlight">Details</span>
        </h2>
        <div className="title-underline"></div>
      </div>

      {/* Calling Reusable DataTable */}
      <DataTable columns={columns} data={tableData} />
    </div>
  );
};

export default AddTemplateTable;