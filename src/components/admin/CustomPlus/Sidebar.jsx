import React, { useRef, useState } from "react";
import {
    FaBars,
    FaExpandArrowsAlt,
    FaImages,
    FaFont,
    FaIcons,
    FaUpload,
    FaSearchPlus,
    FaEnvelopeOpenText,
    FaRegImage,
    FaCertificate,
    FaFileImage,
    FaFilePdf,
} from "react-icons/fa";
import { fabric } from "fabric";
import { useCanvas } from "../../../context/CanvasContext";
import Resize from "./Resize"; // adjust path if needed

const Sidebar = ({ activeMenu, setActiveMenu }) => {

    const {
        canvas,
        setCanvasSize
    } = useCanvas();

    const [showResize, setShowResize] = useState(false);

    const designFileInputRef = useRef(null);

    // ============ TEXT ============

    const addHeading = () => {

        if (!canvas)
            return;

        const text = new fabric.IText("Add Heading", {
            left: 100,
            top: 100,
            fontSize: 36,
            fontWeight: "bold",
            fontFamily: "Arial",
            fill: "#000",
            editable: true,
        });

        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.renderAll();

    };

    // ============ DESIGN (open file explorer) ============

    const handleDesignClick = () => {

        if (designFileInputRef.current) {
            designFileInputRef.current.value = null; // allow re-selecting same file
            designFileInputRef.current.click();
        }

    };

    const handleDesignFileChange = (e) => {

        const file = e.target.files[0];

        if (!file)
            return;

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file.");
            return;
        }

        if (!canvas) {
            alert("Canvas is not ready yet.");
            return;
        }

        const reader = new FileReader();

        reader.onload = (evt) => {

            const dataUrl = evt.target.result;

            fabric.Image.fromURL(dataUrl, (img) => {

                const canvasWidth = canvas.getWidth();

                const canvasHeight = canvas.getHeight();

                // fit image exactly to canvas size (full width & height)

                img.set({

                    left: 0,

                    top: 0,

                    scaleX: canvasWidth / img.width,

                    scaleY: canvasHeight / img.height,

                    selectable: true,

                    evented: true,

                    hasControls: true,

                    hasBorders: true,

                    isDesignImage: true // tag so Reset button can find it later

                });

                canvas.add(img);

                canvas.setActiveObject(img);

                canvas.renderAll();

                setActiveMenu("design");

            }, { crossOrigin: "anonymous" });

        };

        reader.readAsDataURL(file);

    };

    // ============ SIDEBAR CLICK ROUTER ============

    const handleClick = (id) => {

        switch (id) {

            case "resize":
                setShowResize(true);
                break;

            case "design":
                handleDesignClick();
                break;

            case "text":
                addHeading();
                setActiveMenu(id);
                break;

            default:
                setActiveMenu(id);
                break;

        }

    };

    const menu = [
        { id: "menu", icon: <FaBars />, title: "Menu" },
        { id: "resize", icon: <FaExpandArrowsAlt />, title: "Resize" },
        { id: "design", icon: <FaImages />, title: "Design" },
        { id: "text", icon: <FaFont />, title: "Text" },
        { id: "sticker", icon: <FaIcons />, title: "Sticker" },
        { id: "upload", icon: <FaUpload />, title: "Upload" },
        { id: "preview", icon: <FaSearchPlus />, title: "Preview" },
        { id: "invitation", icon: <FaEnvelopeOpenText />, title: "Invitation" },
        { id: "greeting", icon: <FaRegImage />, title: "Greeting" },
        { id: "certificate", icon: <FaCertificate />, title: "Certificate" },
        { id: "png", icon: <FaFileImage />, title: "PNG" },
        { id: "pdf", icon: <FaFilePdf />, title: "PDF" },
    ];

    return (

        <>

            <div className="cp-sidebar">

                {menu.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleClick(item.id)}
                        className={`cp-sidebar-item ${activeMenu === item.id ? "active" : ""}`}
                    >
                        <div className="cp-sidebar-icon">{item.icon}</div>
                        <span>{item.title}</span>
                    </button>
                ))}

                {/* Hidden file input for Design — stays invisible, triggered programmatically */}

                <input
                    type="file"
                    accept="image/*"
                    ref={designFileInputRef}
                    style={{ display: "none" }}
                    onChange={handleDesignFileChange}
                />
             
            </div>

            <Resize
                open={showResize}
                onClose={() => setShowResize(false)}
            />

        </>

    );

};

export default Sidebar;