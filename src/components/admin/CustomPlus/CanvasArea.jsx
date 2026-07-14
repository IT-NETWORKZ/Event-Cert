import React, { useState } from "react";
import {
    FaSearchPlus,
    FaSearchMinus,
    FaExpand,
    FaCrosshairs,
} from "react-icons/fa";
import CanvasToolbar from "./CanvasToolbar";
import FabricCanvas from "./FabricCanvas";
import { useCanvas } from "../../../context/CanvasContext";


const CanvasArea = () => {
const {

canvas,
zoom,
setZoom,
setCanvas


}=useCanvas();

    const zoomIn = () => {
        if (!canvas) return;

        const value = Math.min(300, zoom + 10);

        canvas.setZoom(value / 100);

        setZoom(value);
    };

    const zoomOut = () => {
        if (!canvas) return;

        const value = Math.max(20, zoom - 10);

        canvas.setZoom(value / 100);

        setZoom(value);
    };

    const resetZoom = () => {
        if (!canvas) return;

        canvas.setZoom(1);

        setZoom(100);
    };

    return (
        <div className="cp-canvas-area">

            <CanvasToolbar canvas={canvas} />

            <div className="cp-workspace">

                <FabricCanvas setCanvas={setCanvas} />


            </div>
           
           

        </div>
    );
};

export default CanvasArea;

