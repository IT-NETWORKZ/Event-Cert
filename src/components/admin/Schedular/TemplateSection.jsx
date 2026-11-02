import React from "react";
import { fabric } from "fabric";
import { FaTimes, FaFont, FaUser, FaHashtag } from "react-icons/fa";
import { useCanvas } from "../../../context/CanvasContext";

// Each button drops a text box on the page.
// {{NAME}}, {{TEXT1}} ... are replaced with the Excel row values in Preview.
const ITEMS = [
    { key: "custom", label: "Your Text", hint: "Type your own content", value: "Your Text", icon: <FaFont /> },
    { key: "name", label: "{{NAME}}", hint: "Name column of Excel", value: "{{NAME}}", icon: <FaUser /> },
    { key: "text1", label: "{{TEXT1}}", hint: "Text1 column of Excel", value: "{{TEXT1}}", icon: <FaHashtag /> },
    { key: "text2", label: "{{TEXT2}}", hint: "Text2 column of Excel", value: "{{TEXT2}}", icon: <FaHashtag /> },
    { key: "text3", label: "{{TEXT3}}", hint: "Text3 column of Excel", value: "{{TEXT3}}", icon: <FaHashtag /> },
];

const TemplateSection = ({ activeMenu, setActiveMenu }) => {
    const { canvas } = useCanvas();

    const addText = (item) => {
        if (!canvas) {
            alert("Canvas is not ready yet.");
            return;
        }

        const w = canvas.getWidth();
        const isCustom = item.key === "custom";

        // readable on big canvases too (28px on a 1400px page is tiny)
        const fontSize = Math.max(28, Math.min(64, Math.round(w / 22)));

        const width = isCustom ? Math.round(w * 0.7) : w;

        const textObject = new fabric.Textbox(item.value, {
            left: 0,
            top: 0,
            width,
            textAlign: "center",
            fontSize,
            fontWeight: "bold",
            fontFamily: "Arial",
            fill: "#000000",
            editable: true,
            splitByGrapheme: false,
        });

        canvas.add(textObject);
        canvas.centerObject(textObject); // middle of the canvas
        textObject.setCoords();
        canvas.setActiveObject(textObject);

        // "Your Text": start typing straight away
        if (isCustom) {
            textObject.enterEditing();
            textObject.selectAll();
            if (textObject.hiddenTextarea) textObject.hiddenTextarea.focus({ preventScroll: true });
        }

        canvas.requestRenderAll();
        // the panel stays open so you can add several texts in a row
    };

    if (activeMenu !== "text") return null;

    return (
        <aside className="cp-text-panel" aria-label="Add text">
            <div className="cp-text-panel-head">
                <h3>Text</h3>
                <button
                    type="button"
                    className="cp-text-panel-close"
                    onClick={() => setActiveMenu("design")}
                    aria-label="Close text panel"
                >
                    <FaTimes />
                </button>
            </div>

            <div className="cp-text-panel-list">
                {ITEMS.map((item) => (
                    <button
                        key={item.key}
                        type="button"
                        className={`cp-text-item ${item.key === "custom" ? "is-custom" : ""}`}
                        onClick={() => addText(item)}
                    >
                        <span className="cp-text-item-icon">{item.icon}</span>
                        <span className="cp-text-item-body">
                            <strong>{item.label}</strong>
                            <small>{item.hint}</small>
                        </span>
                    </button>
                ))}
            </div>

            <p className="cp-text-panel-note">
                Placeholders are replaced with your Excel data when you click <b>Preview</b>.
            </p>
        </aside>
    );
};

export default TemplateSection;
