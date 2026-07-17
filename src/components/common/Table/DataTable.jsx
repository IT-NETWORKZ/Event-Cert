import { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net";

function DataTable({ columns = [], data = [] }) {
  const tableRef = useRef(null);
  const dataTableInstance = useRef(null);

  const [pageInfo, setPageInfo] = useState({
    page: 0,
    pages: 0,
    start: 0,
    end: 0,
    recordsTotal: 0,
  });

  useEffect(() => {
    // 1. Safeguard: Only initialize DataTables if we have columns
    if (!tableRef.current || !columns || columns.length === 0) {
      return;
    }

    // 2. Tear down any existing instance before rebuilding the table
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      $(tableRef.current).DataTable().destroy();
      $(tableRef.current).empty(); // Clear header/body structure to avoid duplication
    }

    const mappedColumns = columns.map((col) => ({
      title: col.header,
      data: col.accessorKey,
      createdHeader: (th) => {
        const titleText = $(th).text();
        $(th).html(
          `<div class="th-content">
            <span>${titleText}</span>
            <span class="sort-icon"></span>
          </div>`
        );
      },
    }));

    // 3. Initialize the DataTable
    const table = $(tableRef.current).DataTable({
      destroy: true,
      data: data,
      columns: mappedColumns,
      pageLength: 10,
      searching: true,
      ordering: true,
      paging: true,
      info: true,
      responsive: true,
      dom: "t", // Custom UI container: only render table body; controls are external
    });

    dataTableInstance.current = table;
    setPageInfo(table.page.info());

    // Sync page state when DataTables handles ordering or paging internally
    table.on("draw", () => {
      setPageInfo(table.page.info());
    });

    // Cleanup: destroy on unmount
    return () => {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        table.destroy(true);
      }
    };
  }, [columns, data]); // Runs on data change to safely redraw rows with new values

  // Empty placeholder guard
  if (!columns || columns.length === 0) {
    return (
      <div className="table-wrapper">
        <div className="no-data">No columns defined for this table.</div>
      </div>
    );
  }

  const handleSearch = (e) => {
    dataTableInstance.current?.search(e.target.value).draw();
  };

  const handleLengthChange = (e) => {
    dataTableInstance.current?.page.len(Number(e.target.value)).draw();
  };

  const handlePrevPage = () => {
    dataTableInstance.current?.page("previous").draw("page");
  };

  const handleNextPage = () => {
    dataTableInstance.current?.page("next").draw("page");
  };

  return (
    <div className="table-wrapper">
      {/* TOOLBAR */}
      <div className="table-toolbar">
        <div className="table-length">
          <span>Show</span>
          <select defaultValue="10" onChange={handleLengthChange}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
          <span>Entries</span>
        </div>

        <div className="table-search">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search events..."
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="table-responsive">
        <table
          ref={tableRef}
          className="data-table"
          style={{ width: "100%" }}
        />
      </div>

      {/* PAGINATION */}
      <div className="table-pagination">
        <span className="pagination-info">
          Showing {pageInfo.recordsTotal === 0 ? 0 : pageInfo.start + 1} to{" "}
          {pageInfo.end} of {pageInfo.recordsTotal} entries
        </span>
        <div className="pagination-buttons">
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={pageInfo.page === 0}
          >
            Previous
          </button>
          <button
            type="button"
            onClick={handleNextPage}
            disabled={pageInfo.page >= pageInfo.pages - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataTable;