import { useState } from "react";
import "../../../css/CustomPlus.css";
import { CanvasProvider } from "../../../context/CanvasContext";
import Sidebar from "./Sidebar";
import PagePanel from "./PagePanel";
import CanvasArea from "./CanvasArea";
import BottomToolbar from "./BottomToolbar";
import TemplateSection from "./TemplateSection";
import SchedularDataTable from "./SchedularDataTable";

const SchedularDesigner = () => {
    const [activeMenu, setActiveMenu] = useState("design");

    return (
        <CanvasProvider>
            <div className="sd-page">

                {/* Editor block */}
                <div className="cp-layout">
                    <Sidebar
                        activeMenu={activeMenu}
                        setActiveMenu={setActiveMenu}
                    />

                    <div className="cp-main">
                        <div className="cp-editor">
                            <TemplateSection
                                activeMenu={activeMenu}
                                setActiveMenu={setActiveMenu}
                            />

                            <PagePanel />

                            <CanvasArea />
                        </div>

                        <BottomToolbar />
                    </div>
                </div>

                {/* Table block: sibling of cp-layout, not inside it */}
                <SchedularDataTable />

            </div>
        </CanvasProvider>
    );
};

export default SchedularDesigner;


