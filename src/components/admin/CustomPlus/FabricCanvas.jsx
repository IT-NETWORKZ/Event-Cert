import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { useCanvas } from "../../../context/CanvasContext";

const FabricCanvas = () => {

    const { canvasSize, setCanvas } = useCanvas();

    const canvasRef = useRef(null);

    const viewportRef = useRef(null);

    const fabricRef = useRef(null);

    const [scale, setScale] = useState(1);

    // ================= INIT CANVAS =================

    useEffect(() => {

        const canvas = new fabric.Canvas(canvasRef.current, {

            width: canvasSize.width,

            height: canvasSize.height,

            backgroundColor: "#ffffff",

            preserveObjectStacking: true,

            selection: true

        });

        fabricRef.current = canvas;

        setCanvas(canvas);

        fabric.Object.prototype.transparentCorners = false;
        fabric.Object.prototype.cornerStyle = "circle";
        fabric.Object.prototype.cornerColor = "#2563eb";
        fabric.Object.prototype.cornerStrokeColor = "#fff";
        fabric.Object.prototype.borderColor = "#2563eb";
        fabric.Object.prototype.cornerSize = 10;

        const handleDelete = (e) => {

            if (e.key !== "Delete" && e.key !== "Backspace") return;

            const active = canvas.getActiveObject();

            if (!active) return;

            const tag = document.activeElement?.tagName;

            if (tag === "INPUT" || tag === "TEXTAREA") return;

            if (active.isEditing) return;

            canvas.remove(active);
            canvas.requestRenderAll();

        };

        window.addEventListener("keydown", handleDelete);

        return () => {

            window.removeEventListener("keydown", handleDelete);

            canvas.dispose();

        };

    }, []);

    // ================= RESIZE CANVAS (REAL SIZE) =================

    useEffect(() => {

        if (!fabricRef.current) return;

        const canvas = fabricRef.current;

        canvas.setDimensions({
            width: canvasSize.width,
            height: canvasSize.height
        });

        canvas.requestRenderAll();

    }, [canvasSize]);

    // ================= AUTO FIT SCALE =================

    useEffect(() => {

        const PADDING = 80;

        const MIN_SCALE = 0.2;

        const MAX_SCALE = 1;

        const calculateScale = () => {

            if (!viewportRef.current) return;

            const w = viewportRef.current.clientWidth - PADDING;

            const h = viewportRef.current.clientHeight - PADDING;

            if (w <= 0 || h <= 0) return;

            const scaleX = w / canvasSize.width;

            const scaleY = h / canvasSize.height;

            let newScale = Math.min(scaleX, scaleY);

            newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

            setScale(newScale);

        };

        calculateScale();

        const observer = new ResizeObserver(calculateScale);

        if (viewportRef.current) {
            observer.observe(viewportRef.current);
        }

        window.addEventListener("resize", calculateScale);

        return () => {

            observer.disconnect();

            window.removeEventListener("resize", calculateScale);

        };

    }, [canvasSize]);

    return (

        <div ref={viewportRef} className="cp-canvas-wrapper">

            <div
                className="cp-canvas-wrapper"
                style={{
                    width: canvasSize.width,
                    height: canvasSize.height,
                    transform: `scale(${scale})`,
                    transformOrigin: "center center"
                }}
            >

                <canvas ref={canvasRef} />

            </div>

            {scale < 1 && (

                <div className="cp-zoom-badge">
                    {Math.round(scale * 100)}%
                </div>

            )}
    
        </div>

    );

};

export default FabricCanvas;