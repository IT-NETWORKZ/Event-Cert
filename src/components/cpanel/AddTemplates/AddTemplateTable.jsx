import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DataTable from '../../common/Table/DataTable';
import './AddTemplateTable.css';
import { SEND_TYPES } from './templateOptions';
import { getTemplates } from '../../../api/superAdminService.js'; // adjust path if needed

const LIMIT = 50; // Text longer than this gets Read more / Read less

const labelOf = (list, value) =>
  list.find((o) => o.value === Number(value))?.label ?? '-';

const getErrorMessage = (err, fallback) => {
  const data = err.response?.data;
  return data?.message || data?.title || err.message || fallback;
};

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
          {open ? 'Read less' : 'Read more'}
        </button>
      )}
    </div>
  );
};

// API row -> table row (change property names here if your API differs)
const normalizeTemplate = (t, index) => {
  const type = Number(t.templateType);
  return {
    id: t.templateId ?? t.id ?? index,
    userName: t.userName ?? t.adminName ?? t.templateAdminName ?? t.templateAdminId ?? '-',
    name: t.templateName ?? '',
    utilityType: type === 1 ? 'Yes' : '-',
    marketingType: type === 2 ? 'Yes' : '-',
    details: labelOf(SEND_TYPES, t.sendType),
    message: t.message ?? '',
    withUserName: t.withUserName ? 'Yes' : 'No',
    withParameters: t.noOfParameters ?? 0,
    enabled: t.isEnabled ?? t.nBit ?? t.enabled ?? t.isActive ?? true,
    raw: t,
  };
};

const AddTemplateTable = ({ templates, loading: loadingProp, onEdit, onToggleStatus }) => {
  // if the parent passes `templates`, use them; otherwise fetch here
  const selfFetch = templates === undefined;

  const [fetched, setFetched] = useState([]);
  const [fetching, setFetching] = useState(selfFetch);
  const [error, setError] = useState('');
  const [statusOverrides, setStatusOverrides] = useState({});

  const load = useCallback(async () => {
    setError('');
    try {
      const list = await getTemplates();
      console.log('Templates API response:', list); // check field names here
      setFetched(list);
    } catch (err) {
      console.error('Load Templates Error:', err, err.response?.data);
      setError(getErrorMessage(err, 'Failed to load templates.'));
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (selfFetch) load();
  }, [selfFetch, load]);

  const source = selfFetch ? fetched : templates;
  const loading = selfFetch ? fetching : !!loadingProp;

  const tableData = useMemo(
    () =>
      source.map((t, i) => {
        const row = normalizeTemplate(t, i);
        return row.id in statusOverrides
          ? { ...row, enabled: statusOverrides[row.id] }
          : row;
      }),
    [source, statusOverrides]
  );

  // local only until a status endpoint exists
  const toggleStatus = (row) => {
    setStatusOverrides((prev) => ({ ...prev, [row.id]: !row.enabled }));
    if (onToggleStatus) onToggleStatus(row.raw, !row.enabled);
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
      { accessorKey: 'userName', header: 'User Name', meta: { width: '130px', className: 'text-center' } },
      { accessorKey: 'name', header: 'Name', meta: { width: '150px', className: 'text-center' } },
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
      { accessorKey: 'details', header: 'Details', meta: { width: '150px', className: 'text-center' } },
      {
        accessorKey: 'message',
        header: 'Message',
        cell: ({ getValue }) => <ExpandText text={getValue()} />,
        meta: { width: '280px', className: 'text-start' },
      },
      { accessorKey: 'withUserName', header: 'With User Name', meta: { width: '130px', className: 'text-center' } },
      { accessorKey: 'withParameters', header: 'With Parameters', meta: { width: '130px', className: 'text-center' } },
      {
        id: 'edit',
        header: 'Edit',
        enableSorting: false,
        cell: ({ row }) => (
          <button
            type="button"
            className="cap-edit"
            onClick={() => (onEdit ? onEdit(row.original.raw) : console.log('Edit', row.original.raw))}
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
            className={`cap-status ${row.original.enabled ? 'on' : 'off'}`}
            onClick={() => toggleStatus(row.original)}
            title="Click to change status"
          >
            {row.original.enabled ? 'Enabled' : 'Disabled'}
          </button>
        ),
        meta: { width: '130px', className: 'text-center' },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onEdit, onToggleStatus]
  );

  const handleExportExcel = () => {
    console.log('Export template details', tableData);
  };

  return (
    <div className="c-addplans-wrapper">
      <div className="container-fluid px-md-4">

        <div className="cap-head">
          <h4 className="header-title">Template Details</h4>
          <div className="cap-line"></div>
        </div>

        <div className="cap-card">
          <div className="table-responsive-scroll-wrapper">
            {loading ? (
              <p className="text-center py-4 mb-0">Loading templates...</p>
            ) : error ? (
              <div className="text-center py-4">
                <p className="text-danger mb-2">{error}</p>
                <button type="button" className="cap-edit" onClick={() => { setFetching(true); load(); }}>
                  Retry
                </button>
              </div>
            ) : tableData.length === 0 ? (
              <p className="text-center py-4 mb-0">No templates found.</p>
            ) : (
              <DataTable
                columns={columns}
                data={tableData}
                onExportExcel={handleExportExcel}
              />
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddTemplateTable;