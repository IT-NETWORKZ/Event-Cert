import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { useCanvas } from "../../../context/CanvasContext";
import ObjectActionBar from "./ObjectActionBar";

// On-screen canvas size:
// HEIGHT is fixed (550px on a normal desktop), WIDTH follows the page shape.
//   landscape -> wide canvas, portrait -> narrow canvas, blank -> square.
// On short screens the height is reduced (55% of window height) so it never looks oversized.
// The real canvas size (used for PNG / PDF export) is never changed by this.
const DISPLAY_HEIGHT = 550;
const HEIGHT_RATIO = 0.55;
// Small gap kept around the canvas inside the workspace
const EDGE_GAP = 8;

const FabricCanvas = () => {
    const {
        canvasSize,
        setCanvas,
        activePage,
        pages,
        setCanvasSize,
        setPast,
        setFuture
    } = useCanvas();

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
        fabric.Object.prototype.cornerSize = 18;

        // Delete / Backspace removes everything that is selected (one object or many)
        const handleDelete = (e) => {
            if (e.key !== "Delete" && e.key !== "Backspace") return;

            const tag = document.activeElement?.tagName;
            if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

            const active = canvas.getActiveObject();
            if (!active || active.isEditing) return;

            const selected = canvas.getActiveObjects();
            canvas.discardActiveObject();
            selected.forEach((o) => canvas.remove(o));
            canvas.requestRenderAll();
        };

        window.addEventListener("keydown", handleDelete);

        return () => {
            window.removeEventListener("keydown", handleDelete);
            canvas.dispose();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ================= MULTI-PAGE PAGE SWITCHING SYNC =================
    useEffect(() => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        const currentPageData = pages.find((p) => p.id === activePage);
        if (!currentPageData) return;

        canvas.discardActiveObject();
        setPast([]);
        setFuture([]);

        canvas.setWidth(currentPageData.width);
        canvas.setHeight(currentPageData.height);
        setCanvasSize({ width: currentPageData.width, height: currentPageData.height });

        if (currentPageData.json) {
            canvas.clear();
            canvas.loadFromJSON(currentPageData.json, () => {
                canvas.setBackgroundColor("#ffffff", canvas.renderAll.bind(canvas));
                canvas.renderAll();
            });
        } else {
            canvas.clear();
            canvas.backgroundColor = "#ffffff";
            canvas.renderAll();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activePage]);

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

    // ================= DISPLAY SCALE =================
    useEffect(() => {
        const calculateScale = () => {
            const el = viewportRef.current;
            if (!el) return;

            // available room = the workspace that holds the canvas
            const parent = el.parentElement || el;
            const cs = window.getComputedStyle(parent);
            const availW =
                parent.clientWidth -
                parseFloat(cs.paddingLeft || 0) -
                parseFloat(cs.paddingRight || 0) -
                EDGE_GAP;
            const availH =
                parent.clientHeight -
                parseFloat(cs.paddingTop || 0) -
                parseFloat(cs.paddingBottom || 0) -
                EDGE_GAP;

            // 1. fixed height
            let targetH = Math.min(DISPLAY_HEIGHT, window.innerHeight * HEIGHT_RATIO);
            if (availH > 0) targetH = Math.min(targetH, availH);

            let newScale = targetH / canvasSize.height;

            // 2. too wide for the screen -> shrink by width instead
            if (availW > 0 && canvasSize.width * newScale > availW) {
                newScale = availW / canvasSize.width;
            }

            setScale(newScale);
        };

        calculateScale();

        const observer = new ResizeObserver(calculateScale);
        if (viewportRef.current) {
            observer.observe(viewportRef.current);
            if (viewportRef.current.parentElement) {
                observer.observe(viewportRef.current.parentElement);
            }
        }

        window.addEventListener("resize", calculateScale);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", calculateScale);
        };
    }, [canvasSize]);

    const boxWidth = canvasSize.width * scale;
    const boxHeight = canvasSize.height * scale;

    return (
        <div ref={viewportRef} className="cp-canvas-wrapper">
            {/* outer box = real on-screen size, so layout never overflows */}
            <div
                className="cp-canvas-frame"
                style={{
                    width: boxWidth,
                    height: boxHeight,
                    flexShrink: 0
                }}
            >
                <div
                    className="cp-canvas-scaled-box"
                    style={{
                        width: canvasSize.width,
                        height: canvasSize.height,
                        transform: `scale(${scale})`,
                        transformOrigin: "top left"
                    }}
                >
                    <canvas ref={canvasRef} />
                </div>

                {/* Copy / Duplicate / Delete + colour, floating above the selected object */}
                <ObjectActionBar scale={scale} boxWidth={boxWidth} boxHeight={boxHeight} />
            </div>
        </div>
    );
};

export default FabricCanvas;
