import React, { useMemo, useState } from 'react';
import DataTable from '../../common/Table/DataTable';
import './AddTemplateTable.css';

const LIMIT = 50; // Text longer than this gets Read more / Read less

// Expandable text cell for long messages
const ExpandText = ({ text }) => {
  const [open, setOpen] = useState(false);
  const value = text || '';
  const long = value.length > LIMIT;
  const shown = long && !open ? `${value.slice(0, LIMIT)}…` : value;

  return (
    <div className="cap-text">
      <span>{shown}</span>
      {long && (
        <button type="button" className="cap-more" onClick={() => setOpen((o) => !o)}>
          {open ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
};

const AddTemplateTable = ({ onEdit, onToggleStatus }) => {
  const [tableData, setTableData] = useState([
    {
      id: 1,
      srNo: 1,
      userName: 'CertWala',
      name: 'temp_cert12',
      utilityType: 'Yes',
      marketingType: '-',
      details: 'textdocument',
      message: 'Hello, we are pleased to share {{1}} {{2}} in {{3}}. Please find it attached. Regards, Regards, {{4}}. Thanks.',
      withUserName: 'Yes',
      withParameters: 4,
      enabled: true,
    },
    {
      id: 2,
      srNo: 2,
      userName: 'CertWala',
      name: 'temp_cert11',
      utilityType: 'Yes',
      marketingType: '-',
      details: 'textvideo',
      message: 'Hello, we are pleased to share {{1}} {{2}} in {{3}}. Please find it attached.',
      withUserName: 'Yes',
      withParameters: 4,
      enabled: true,
    },
  ]);

  const toggleStatus = (id) => {
    setTableData((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
    if (onToggleStatus) onToggleStatus(id);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'srNo',
        header: 'Sr. No.',
        enableSorting: false,
        cell: ({ row }) => row.index + 1,
        meta: { width: '80px', className: 'text-center' },
      },
      {
        accessorKey: 'userName',
        header: 'User Name',
        meta: { width: '130px', className: 'text-center' },
      },
      {
        accessorKey: 'name',
        header: 'Name',
        meta: { width: '150px', className: 'text-center' },
      },
      {
        accessorKey: 'utilityType',
        header: 'Utility Type',
        cell: ({ getValue }) => getValue() || '-',
        meta: { width: '110px', className: 'text-center' },
      },
      {
        accessorKey: 'marketingType',
        header: 'Marketing Type',
        cell: ({ getValue }) => getValue() || '-',
        meta: { width: '130px', className: 'text-center' },
      },
      {
        accessorKey: 'details',
        header: 'Details',
        meta: { width: '130px', className: 'text-center' },
      },
      {
        accessorKey: 'message',
        header: 'Message',
        cell: ({ getValue }) => <ExpandText text={getValue()} />,
        meta: { width: '280px', className: 'text-start' },
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
        enableSorting: false,
        cell: ({ row }) => (
          <button
            type="button"
            className="cap-edit"
            onClick={() => onEdit ? onEdit(row.original) : console.log("Edit", row.original)}
          >
            Edit
          </button>
        ),
        meta: { width: '100px', className: 'text-center' },
      },
      {
        id: 'status',
        header: 'Status',
        enableSorting: false,
        cell: ({ row }) => (
          <button
            type="button"
            className={`cap-status ${row.original.enabled ? "on" : "off"}`}
            onClick={() => toggleStatus(row.original.id)}
            title="Click to change status"
          >
            {row.original.enabled ? "Enabled" : "Disabled"}
          </button>
        ),
        meta: { width: '130px', className: 'text-center' },
      },
    ],
    [onEdit]
  );

  const handleExportExcel = () => {
    console.log("Export template details", tableData);
  };

  return (
    <div className="c-addplans-wrapper">
      <div className="container-fluid px-md-4">
        
        {/* Header Heading */}
        <div className="cap-head">
          <h4 className="header-title">Template Details</h4>
          <div className="cap-line"></div>
        </div>

        {/* Table Card */}
        <div className="cap-card">
          <div className="table-responsive-scroll-wrapper">
            <DataTable
              columns={columns}
              data={tableData}
              onExportExcel={handleExportExcel}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddTemplateTable;