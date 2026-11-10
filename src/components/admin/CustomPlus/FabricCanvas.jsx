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

        // ================= UNDO / REDO ENGINE =================
        // Snapshot based history. Every add / move / resize / edit / delete is recorded
        // automatically, so Ctrl+Z / Ctrl+Y and the toolbar buttons all use the same stack.
        const HISTORY_LIMIT = 50;
        const EXTRA_PROPS = ["id", "name", "selectable", "evented", "lockMovementX", "lockMovementY", "lockScalingX", "lockScalingY", "lockRotation", "hasControls", "excludeFromExport"];
        const hist = { past: [], future: [], current: null, busy: false, timer: null };

        const snapshot = () => JSON.stringify(canvas.toJSON(EXTRA_PROPS));
        const syncUi = () => {
            setPast([...hist.past]);
            setFuture([...hist.future]);
        };

        const saveHistory = () => {
            if (hist.busy) return;
            clearTimeout(hist.timer);
            // small delay merges bursts (delete many, paste group, load) into one step
            hist.timer = setTimeout(() => {
                if (hist.busy) return;
                const next = snapshot();
                if (next === hist.current) return;
                if (hist.current !== null) hist.past.push(hist.current);
                if (hist.past.length > HISTORY_LIMIT) hist.past.shift();
                hist.current = next;
                hist.future = [];
                syncUi();
            }, 60);
        };

        const restore = (state) => {
            hist.busy = true;
            canvas.discardActiveObject();
            canvas.loadFromJSON(state, () => {
                canvas.renderAll();
                hist.current = state;
                hist.busy = false;
                syncUi();
            });
        };

        const undo = () => {
            clearTimeout(hist.timer);
            if (!hist.busy && hist.current !== null && snapshot() !== hist.current) {
                // flush a change that has not been recorded yet
                hist.past.push(hist.current);
                hist.current = snapshot();
            }
            if (hist.busy || hist.past.length === 0) return;
            hist.future.unshift(hist.current);
            restore(hist.past.pop());
        };

        const redo = () => {
            clearTimeout(hist.timer);
            if (hist.busy || hist.future.length === 0) return;
            hist.past.push(hist.current);
            restore(hist.future.shift());
        };

        // called after a page is loaded / switched: forget old steps, start fresh
        const resetHistory = () => {
            clearTimeout(hist.timer);
            hist.past = [];
            hist.future = [];
            hist.busy = false;
            hist.current = snapshot();
            syncUi();
        };

        canvas.__history = {
            undo,
            redo,
            save: saveHistory,
            reset: resetHistory,
            setBusy: (v) => { hist.busy = v; }
        };
        hist.current = snapshot();

        canvas.on("object:added", saveHistory);
        canvas.on("object:modified", saveHistory);
        canvas.on("object:removed", saveHistory);
        canvas.on("text:editing:exited", saveHistory);

        const handleUndoRedoKeys = (e) => {
            if (!(e.ctrlKey || e.metaKey)) return;
            const key = e.key.toLowerCase();
            if (key !== "z" && key !== "y") return;

            const tag = document.activeElement?.tagName;
            if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
            if (document.activeElement?.isContentEditable) return;

            const active = canvas.getActiveObject();
            if (active && active.isEditing) return; // let the text box use its own undo

            e.preventDefault();
            if (key === "y" || (key === "z" && e.shiftKey)) redo();
            else undo();
        };
        window.addEventListener("keydown", handleUndoRedoKeys);

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
            window.removeEventListener("keydown", handleUndoRedoKeys);
            clearTimeout(hist.timer);
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

        const history = canvas.__history;
        history?.setBusy(true); // loading a page must not count as an edit
        canvas.discardActiveObject();

        canvas.setWidth(currentPageData.width);
        canvas.setHeight(currentPageData.height);
        setCanvasSize({ width: currentPageData.width, height: currentPageData.height });

        if (currentPageData.json) {
            canvas.clear();
            canvas.loadFromJSON(currentPageData.json, () => {
                canvas.setBackgroundColor("#ffffff", canvas.renderAll.bind(canvas));
                canvas.renderAll();
                history?.reset();
            });
        } else {
            canvas.clear();
            canvas.backgroundColor = "#ffffff";
            canvas.renderAll();
            history?.reset();
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
