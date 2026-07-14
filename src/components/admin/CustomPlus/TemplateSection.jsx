import React from "react";
import { fabric } from "fabric";
import { useCanvas } from "../../../context/CanvasContext";

const TemplateSection = ({ activeMenu, setActiveMenu }) => {
    const { canvas } = useCanvas();

    const addText = (value) => {
        if (!canvas) return;

        const textObject = new fabric.Textbox(value, {
            left: 0,
            top: 100,
            width: canvas.getWidth(), // 100% canvas width
            textAlign: "center",
            fontSize: 28,
            fontWeight: "bold",
            fontFamily: "Roboto",
            fill: "#000",
            editable: true,
            splitByGrapheme: false,
        });

        canvas.add(textObject);
        canvas.setActiveObject(textObject);
        canvas.renderAll();

        setActiveMenu("design");
    };

    if (activeMenu !== "text") return null;

    return (
        <div className="cp-template-section">
            <div className="cp-text-box">
                <h3>Your Text</h3>

                <button onClick={() => addText("{{Name}}")}>
                    {"{{Name}}"}
                </button>

                <button onClick={() => addText("{{Text1}}")}>
                    {"{{Text1}}"}
                </button>

                <button onClick={() => addText("{{Text2}}")}>
                    {"{{Text2}}"}
                </button>

                <button onClick={() => addText("{{Text3}}")}>
                    {"{{Text3}}"}
                </button>
            </div>
        </div>
    );
};

export default TemplateSection;