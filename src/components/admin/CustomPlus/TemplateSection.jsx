import React from "react";
import { fabric } from "fabric";
import { useCanvas } from "../../../context/CanvasContext";

const TemplateSection = ({ activeMenu,setActiveMenu }) => {

    const { canvas } = useCanvas();

    const addText = (value) => {

        if (!canvas) return;

        const text = new fabric.IText(value, {
            left: 100,
            top: 100,
            fontSize: 28,
            fontWeight: "bold",
            fontFamily: "Roboto",
            fill: "black",
            editable: true,
        });

        canvas.add(text);
        canvas.setActiveObject(text);
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