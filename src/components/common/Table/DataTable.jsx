import "./DataTable.css";
import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUp, ArrowDown } from "lucide-react";

function DataTable({ columns, data, onExportExcel, onViewAllDetails }) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data: useMemo(() => data, [data]),
    columns,
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
        pageSize: 5, // Updated default to 25 to match the screenshot layout
      },
    },
  });

  return (
    <div className="table-wrapper container-fluid">
      {/* Action Buttons Bar matching screenshot layout */}
      <div className="d-flex gap-2 mb-3 justify-content-start">
        <button 
          className="btn btn-success action-btn-green" 
          onClick={onExportExcel}
        >
          Export to Excel
        </button>
        <button 
          className="btn btn-success action-btn-green" 
          onClick={onViewAllDetails}
        >
          All Event Reg. Details
        </button>
      </div>

      <div className="table-toolbar d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
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
          <span className="text-secondary small">Entries per page</span>
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

      <div className="table-responsive">
        <table className="table table-hover align-middle data-table m-0">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                  >
                    <div className="th-content-wrapper">
                      {/* Top Arrow */}
                      <span className="sort-arrow-top">
                        {header.column.getCanSort() && (
                          <ArrowUp 
                            size={10} 
                            className={header.column.getIsSorted() === "asc" ? "active-arrow" : "dimmed-arrow"} 
                          />
                        )}
                      </span>
                      
                      {/* Header Text */}
                      <div className="th-text">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>

                      {/* Bottom Arrow */}
                      <span className="sort-arrow-bottom">
                        {header.column.getCanSort() && (
                          <ArrowDown 
                            size={10} 
                            className={header.column.getIsSorted() === "desc" ? "active-arrow" : "dimmed-arrow"} 
                          />
                        )}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="no-data text-end py-5 text-muted">
                  No entries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-pagination d-flex justify-content-between align-items-center mt-3">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </button>

        <span className="small text-muted">
          Page{" "}
          <strong className="text-dark">
            {table.getState().pagination.pageIndex + 1}
          </strong>{" "}
          of{" "}
          <strong className="text-dark">
            {table.getPageCount()}
          </strong>
        </span>

        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default DataTable;