import React, { useMemo, useState } from "react";
import "./DataTable.css";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUp, ArrowDown, ChevronsUpDown } from "lucide-react";
import Button from "../../common/button/Button"

function DataTable({ columns = [], data = [], onExportExcel, onViewAllDetails }) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // 1. Properly anchor and memoize the data and column configurations
  const memoizedData = useMemo(() => data, [data]);
  const memoizedColumns = useMemo(() => columns, [columns]);

  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  const currentPage = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();
  const pageSize = table.getState().pagination.pageSize;
  const rows = table.getRowModel().rows;

  // 2. Compute how many blank filler rows are needed so every page renders
  // the same number of rows -> table height stays constant -> no "shake"
  // when navigating pages (only applied when there IS data to show).
  const fillerCount = rows.length > 0 ? Math.max(0, pageSize - rows.length) : 0;

  const pageNumbers = useMemo(() => {
    const pages = [];
    for (let i = 0; i < pageCount; i++) {
      pages.push(i);
    }
    return pages;
  }, [pageCount]);

  return (
    <div className="table-wrapper container-fluid">
      {/* Action Controls Header Area */}
      <div className="table-header-control-bar d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
    <div className="d-flex gap-2">
  {onExportExcel && (
    <Button
      type="button"
      className="btn btn-success action-btn-green"
      onClick={onExportExcel}
    >
      Export to Excel
    </Button>
  )}
  
  {onViewAllDetails && (
    <Button
      type="button"
      className="btn btn-success action-btn-green"
      onClick={onViewAllDetails}
    >
      All Event Reg. Details
    </Button>
  )}
</div>

        <div className="d-flex align-items-center gap-3">
          <div className="table-length d-flex align-items-center gap-2">
            <select
              className="form-select form-select-sm"
              style={{ width: "auto" }}
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
            </select>
            <span className="text-muted small text-nowrap">Entries per page</span>
          </div>

          <div className="table-search">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Structurally Clean Table */}
      <div className="table-responsive table-card-border">
        <table className="table table-hover align-middle data-table m-0">
          <colgroup>
            {memoizedColumns.map((col) => (
              <col
                key={col.id || col.accessorKey}
                style={{ width: col.meta?.width || "150px" }}
              />
            ))}
          </colgroup>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const alignmentClass = header.column.columnDef.meta?.className || "text-start";

                  return (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className={alignmentClass}
                      style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                    >
                      <div className={`th-content-wrapper d-flex align-items-center gap-1 ${
                        alignmentClass === 'text-end' ? 'justify-content-end' :
                        alignmentClass === 'text-center' ? 'justify-content-center' :
                        'justify-content-start'
                      }`}>
                        <span className="th-text">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </span>

                        {header.column.getCanSort() && (
                          <span className="sort-arrow-side d-inline-flex align-items-center">
                            {header.column.getIsSorted() === "asc" && (
                              <ArrowUp size={13} className="active-arrow" />
                            )}
                            {header.column.getIsSorted() === "desc" && (
                              <ArrowDown size={13} className="active-arrow" />
                            )}
                            {!header.column.getIsSorted() && (
                              <ChevronsUpDown size={13} className="dimmed-arrow" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows && rows.length > 0 ? (
              <>
                {rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      const alignmentClass = cell.column.columnDef.meta?.className || "text-start";
                      return (
                        <td key={cell.id} className={alignmentClass}>
                          <div className="td-content-clip">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Invisible filler rows: keep row count == pageSize so the
                    table height never changes between pages (fixes shake) */}
                {Array.from({ length: fillerCount }).map((_, idx) => (
                  <tr key={`filler-${idx}`} className="filler-row" aria-hidden="true">
                    {memoizedColumns.map((col, colIdx) => (
                      <td key={col.id || col.accessorKey || colIdx}>&nbsp;</td>
                    ))}
                  </tr>
                ))}
              </>
            ) : (
              <tr>
                <td colSpan={columns?.length || 1} className="no-data text-center py-5 text-muted">
                  No records found matching criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Structured Footer Controls */}
      <div className="table-pagination d-flex justify-content-between align-items-center mt-3 pt-2 flex-wrap gap-2">
        <span className="small text-muted">
          Showing <strong className="text-dark">{rows.length}</strong> of{" "}
          <strong className="text-dark">{table.getFilteredRowModel().rows.length}</strong> entries
        </span>

        <nav aria-label="Table navigation">
          <ul className="pagination pagination-sm m-0 gap-1">
            <li className={`page-item ${!table.getCanPreviousPage() ? "disabled" : ""}`}>
              <button
                type="button"
                className="page-link custom-page-btn"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                &lsaquo;
              </button>
            </li>

            {pageNumbers.map((pageIdx) => (
              <li
                key={pageIdx}
                className={`page-item ${currentPage === pageIdx ? "active" : ""}`}
              >
                <button
                  type="button"
                  className="page-link custom-page-btn"
                  onClick={() => table.setPageIndex(pageIdx)}
                >
                  {pageIdx + 1}
                </button>
              </li>
            ))}

            <li className={`page-item ${!table.getCanNextPage() ? "disabled" : ""}`}>
              <button
                type="button"
                className="page-link custom-page-btn"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                &rsaquo;
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default DataTable;