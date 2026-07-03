import { useState } from "react";
import "../../../css/CustomPlus.css";
import Sidebar from "./Sidebar";
import TemplateSection from "./TemplateSection";
import PagePanel from "./PagePanel";
import CanvasArea from "./CanvasArea";



const Designer = () => {

    const [activeMenu, setActiveMenu] = useState("design");

    return (
        <>
            <div className="cp-layout">

                <Sidebar
                    activeMenu={activeMenu}
                    setActiveMenu={setActiveMenu}
                />

                <TemplateSection
                    activeMenu={activeMenu}
                />

                <PagePanel />

                <CanvasArea />

            </div>
            
        </>
    );

};

export default Designer;