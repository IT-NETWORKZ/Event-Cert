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
import {
  Search,
  ArrowUp,
  ArrowDown,
  ChevronsUpDown,
} from "lucide-react";

function DataTable({ columns, data }) {
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
        pageSize: 10,
      },
    },
  });

  return (
    <div className="table-wrapper">
        <div className="table-toolbar">
  <div className="table-length">
    <select
      value={table.getState().pagination.pageSize}
      onChange={(e) => table.setPageSize(Number(e.target.value))}
    >
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value={15}>15</option>
      <option value={20}>20</option>
    </select>
    <span>Entries per page</span>
  </div>

  <div className="table-search">
    <Search size={18} />
    <input
      type="text"
      placeholder="Search..."
      value={globalFilter}
      onChange={(e) => setGlobalFilter(e.target.value)}
    />
  </div>
</div>

<div className="table-responsive">
  <table className="data-table">
    <thead>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              onClick={header.column.getToggleSortingHandler()}
            >
              <div className="th-content">
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}

                {header.column.getCanSort() &&
                  (header.column.getIsSorted() === "asc" ? (
                    <ArrowUp size={16} />
                  ) : header.column.getIsSorted() === "desc" ? (
                    <ArrowDown size={16} />
                  ) : (
                    <ChevronsUpDown size={16} />
                  ))}
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
      <td
        colSpan={columns.length}
        className="no-data"
      >
        No entries found
      </td>
    </tr>
  )}
</tbody>
  </table>
</div>

<div className="table-pagination">
  <button
    onClick={() => table.previousPage()}
    disabled={!table.getCanPreviousPage()}
  >
    Previous
  </button>

  <span>
    Page{" "}
    <strong>
      {table.getState().pagination.pageIndex + 1}
    </strong>{" "}
    of{" "}
    <strong>
      {table.getPageCount()}
    </strong>
  </span>

  <button
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