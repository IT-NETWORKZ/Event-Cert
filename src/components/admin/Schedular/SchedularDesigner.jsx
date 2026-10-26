import { useMemo, useState } from "react";
import "../../../css/CustomPlus.css";
import Sidebar from "./Sidebar";
import PagePanel from "./PagePanel";
import CanvasArea from "./CanvasArea";
import TemplateSection from "./TemplateSection";
import SchedularDataTable, { SAMPLE_ROWS } from "./SchedularDataTable";

const SchedularDesigner = () => {
    const [activeMenu, setActiveMenu] = useState("design");

    // Excel rows live here so the table (source) and Preview (consumer) share them
    const [rows, setRows] = useState(SAMPLE_ROWS);
    const [selectedIds, setSelectedIds] = useState([]);

    // Preview uses the ticked rows; if none are ticked, every row
    const previewRows = useMemo(
        () => (selectedIds.length ? rows.filter((r) => selectedIds.includes(r.id)) : rows),
        [rows, selectedIds]
    );

    // Download uses only the ticked rows (none ticked -> plain design download)
    const selectedRows = useMemo(
        () => rows.filter((r) => selectedIds.includes(r.id)),
        [rows, selectedIds]
    );

    return (
        <div className="dsg-page">
            <div className="cp-layout">
                {/* left rail (bottom bar on phones) */}
                <Sidebar
                    activeMenu={activeMenu}
                    setActiveMenu={setActiveMenu}
                    rows={previewRows}
                    selectedRows={selectedRows}
                />

                {/* right side scrolls as one page: editor row, then table */}
                <div className="cp-main">
                    <div className="cp-editor">
                        <TemplateSection
                            activeMenu={activeMenu}
                            setActiveMenu={setActiveMenu}
                        />
                        <PagePanel />
                        <CanvasArea />
                    </div>

                    <div className="dsg-table-wrap">
                        <SchedularDataTable
                            rows={rows}
                            setRows={setRows}
                            selectedIds={selectedIds}
                            setSelectedIds={setSelectedIds}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchedularDesigner;
