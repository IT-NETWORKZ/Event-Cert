import { useState } from "react";
import "../../../css/CustomPlus.css";
import Sidebar from "./Sidebar";
import PagePanel from "./PagePanel";
import CanvasArea from "./CanvasArea";
import TemplateSection from "./TemplateSection";
import DesignerTable from "./DesignerTable";

const Designer = () => {
    const [activeMenu, setActiveMenu] = useState("design");

    return (
        <div className="dsg-page">
            <div className="cp-layout">
                {/* left rail, scrolls on its own */}
                <Sidebar
                    activeMenu={activeMenu}
                    setActiveMenu={setActiveMenu}
                />

                {/* right side, scrolls as one page: editor row, then table */}
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
                        <DesignerTable />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Designer;


// import { useState } from "react";
// import "../../../css/CustomPlus.css";
// import Sidebar from "./Sidebar";
// import PagePanel from "./PagePanel";
// import CanvasArea from "./CanvasArea";
// import BottomToolbar from "./BottomToolbar";
// import TemplateSection from "./TemplateSection";
// import DesignerTable from "./DesignerTable";

// const Designer = () => {
//     const [activeMenu, setActiveMenu] = useState("design");

//     return (
//         <div className="dsg-page">
//             <div className="cp-layout">
//                 <Sidebar
//                     activeMenu={activeMenu}
//                     setActiveMenu={setActiveMenu}
//                 />

//                 <div className="cp-main">
//                     <div className="cp-editor">
//                         <TemplateSection
//                             activeMenu={activeMenu}
//                             setActiveMenu={setActiveMenu}
//                         />

//                         <PagePanel />

//                         <CanvasArea />
//                     </div>

//                     {/* <BottomToolbar /> */}
//                 </div>
//             </div>

//             <DesignerTable />
//         </div>
//     );
// };

// export default Designer;