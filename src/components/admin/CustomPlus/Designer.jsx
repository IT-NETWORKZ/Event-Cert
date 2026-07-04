import { useState } from "react";
import "../../../css/CustomPlus.css";
import Sidebar from "./Sidebar";
import PagePanel from "./PagePanel";
import CanvasArea from "./CanvasArea";
import BottomToolbar from "./BottomToolbar";



const Designer = () => {

    const [activeMenu, setActiveMenu] = useState("design");

    return (
        <>

            <div className="cp-layout">

                <Sidebar
                    activeMenu={activeMenu}
                    setActiveMenu={setActiveMenu}
                />



                <div className="cp-main">

                    <div className="cp-editor">

                        <PagePanel />

                        <CanvasArea />

                    </div>

                    <BottomToolbar />

                </div>

            </div>
        </>
    );

};

export default Designer;