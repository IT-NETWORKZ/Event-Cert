import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { FaRegCopy, FaClone, FaPaste, FaTrashAlt, FaCheck } from "react-icons/fa";
import { useCanvas } from "../../../context/CanvasContext";

// Floating Canva-style bar shown above the selected object:
//   Copy | Paste | Duplicate | Delete   (+ colour picker and "apply to all text" for text)
// Keyboard: Ctrl/Cmd + C, V, D

const TEXT_TYPES = ["i-text", "textbox", "text"];
const isText = (o) => !!o && TEXT_TYPES.includes(o.type);

// uploaded pictures (logo / sticker), but not the full-page background design
const isUploadedImage = (o, canvas) => {
    if (!o || o.type !== "image" || o.isDesignImage) return false;
    const w = (o.width || 0) * (o.scaleX || 1);
    const h = (o.height || 0) * (o.scaleY || 1);
    const coversPage = canvas && w >= canvas.getWidth() * 0.98 && h >= canvas.getHeight() * 0.98;
    return !coversPage;
};

// the bar is shown only for text and uploaded images
const isEditable = (obj, canvas) => {
    if (!obj) return false;
    if (obj.type === "activeSelection") {
        return obj.getObjects().every((x) => isText(x) || isUploadedImage(x, canvas));
    }
    return isText(obj) || isUploadedImage(obj, canvas);
};

const getTextTargets = (obj) => {
    if (!obj) return [];
    if (obj.type === "activeSelection") return obj.getObjects().filter(isText);
    return isText(obj) ? [obj] : [];
};

// <input type="color"> only accepts #rrggbb
const toHex = (c) => {
    if (typeof c !== "string") return null;
    if (/^#[0-9a-f]{6}$/i.test(c)) return c.toLowerCase();
    if (/^#[0-9a-f]{3}$/i.test(c)) {
        return "#" + c.slice(1).split("").map((ch) => ch + ch).join("").toLowerCase();
    }
    const m = c.match(/^rgba?\(\s*(\d+)\D+(\d+)\D+(\d+)/i);
    if (m) {
        return "#" + [m[1], m[2], m[3]].map((n) => Number(n).toString(16).padStart(2, "0")).join("");
    }
    return null;
};

// shared between pages, so you can copy on page 1 and paste on page 2
let clipboard = null;

const ObjectActionBar = ({ scale = 1, boxWidth = 0, boxHeight = 0 }) => {
    const { canvas, saveState } = useCanvas();

    const barRef = useRef(null);
    const draggingRef = useRef(false);
    const saveTimer = useRef(null);
    const copiedTimer = useRef(null);

    const [pos, setPos] = useState(null); // { x, top, bottom } in on-screen px
    const [hidden, setHidden] = useState(false);
    const [size, setSize] = useState({ w: 260, h: 44 });
    const [info, setInfo] = useState({ text: false, color: "#000000" });
    const [applyAll, setApplyAll] = useState(false);
    const [hasClip, setHasClip] = useState(!!clipboard);
    const [copied, setCopied] = useState(false);

    // ---------- keep the bar glued to the selected object ----------
    const update = useCallback(() => {
        if (!canvas || draggingRef.current) return;

        const obj = canvas.getActiveObject();
        if (!obj || canvas.isDrawingMode || !isEditable(obj, canvas)) {
            setPos((p) => (p ? null : p));
            return;
        }

        const r = obj.getBoundingRect();
        const next = {
            x: Math.round((r.left + r.width / 2) * scale),
            top: Math.round(r.top * scale),
            bottom: Math.round((r.top + r.height) * scale),
        };
        setPos((p) =>
            p && p.x === next.x && p.top === next.top && p.bottom === next.bottom ? p : next
        );

        const texts = getTextTargets(obj);
        const color = texts.length ? toHex(texts[0].fill) || "#000000" : "#000000";
        setInfo((i) => (i.text === texts.length > 0 && i.color === color ? i : { text: texts.length > 0, color }));
    }, [canvas, scale]);

    useEffect(() => {
        if (!canvas) return undefined;

        const hide = () => {
            draggingRef.current = true;
            setHidden(true);
        };
        const show = () => {
            draggingRef.current = false;
            setHidden(false);
            update();
        };
        const cleared = () => setPos(null);

        canvas.on("after:render", update);
        canvas.on("object:moving", hide);
        canvas.on("object:scaling", hide);
        canvas.on("object:rotating", hide);
        canvas.on("mouse:up", show);
        canvas.on("selection:cleared", cleared);

        return () => {
            canvas.off("after:render", update);
            canvas.off("object:moving", hide);
            canvas.off("object:scaling", hide);
            canvas.off("object:rotating", hide);
            canvas.off("mouse:up", show);
            canvas.off("selection:cleared", cleared);
        };
    }, [canvas, update]);

    useLayoutEffect(() => {
        const el = barRef.current;
        if (!el) return;
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        setSize((s) => (s.w === w && s.h === h ? s : { w, h }));
    });

    useEffect(
        () => () => {
            clearTimeout(saveTimer.current);
            clearTimeout(copiedTimer.current);
        },
        []
    );

    // ---------- actions ----------
    const addClone = (cloned) => {
        canvas.discardActiveObject();
        cloned.set({ left: (cloned.left || 0) + 20, top: (cloned.top || 0) + 20, evented: true });

        if (cloned.type === "activeSelection") {
            cloned.canvas = canvas;
            cloned.forEachObject((o) => canvas.add(o));
            cloned.setCoords();
        } else {
            canvas.add(cloned);
        }

        canvas.setActiveObject(cloned);
        canvas.requestRenderAll();
    };

    const duplicate = () => {
        const obj = canvas?.getActiveObject();
        if (!obj) return;
        obj.clone(addClone);
    };

    const copy = () => {
        const obj = canvas?.getActiveObject();
        if (!obj) return;
        obj.clone((c) => {
            clipboard = c;
            setHasClip(true);
            setCopied(true);
            clearTimeout(copiedTimer.current);
            copiedTimer.current = setTimeout(() => setCopied(false), 1200);
        });
    };

    const paste = () => {
        if (!canvas || !clipboard) return;
        clipboard.clone((c) => {
            addClone(c);
            // next paste lands a little lower, so copies don't stack exactly
            clipboard.set({ left: (clipboard.left || 0) + 20, top: (clipboard.top || 0) + 20 });
        });
    };

    const remove = () => {
        if (!canvas) return;
        const objs = canvas.getActiveObjects();
        if (!objs.length) return;
        canvas.discardActiveObject();
        objs.forEach((o) => canvas.remove(o));
        canvas.requestRenderAll();
        setPos(null);
    };

    // ---------- colour ----------
    const paint = (hex, all = applyAll) => {
        if (!canvas) return;
        const targets = all
            ? canvas.getObjects().filter(isText)
            : getTextTargets(canvas.getActiveObject());

        targets.forEach((t) => t.set({ fill: hex, dirty: true }));
        setInfo((i) => ({ ...i, color: hex }));
        canvas.requestRenderAll();

        clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => saveState && saveState(canvas), 400);
    };

    const handleApplyAll = (e) => {
        const checked = e.target.checked;
        setApplyAll(checked);
        if (checked) paint(info.color, true);
    };

    // ---------- keyboard shortcuts ----------
    useEffect(() => {
        if (!canvas) return undefined;

        const onKey = (e) => {
            if (!(e.ctrlKey || e.metaKey)) return;
            const tag = document.activeElement?.tagName;
            if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

            const active = canvas.getActiveObject();
            if (active?.isEditing) return;

            const key = e.key.toLowerCase();
            if (key === "c" && active) {
                copy();
            } else if (key === "v" && clipboard) {
                e.preventDefault();
                paste();
            } else if (key === "d" && active) {
                e.preventDefault();
                duplicate();
            }
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canvas]);

    if (!canvas || !pos || hidden) return null;

    // ---------- placement: above the object, below it if there is no room, always inside the canvas ----------
    const half = size.w / 2;
    const left =
        boxWidth > size.w + 8
            ? Math.min(Math.max(pos.x, half + 4), boxWidth - half - 4)
            : boxWidth / 2;

    let top = pos.top - size.h - 10;
    if (top < 4) top = pos.bottom + 10;
    top = Math.max(4, Math.min(top, Math.max(4, boxHeight - size.h - 4)));

    return (
        <div
            ref={barRef}
            className="cp-obj-bar"
            style={{ left, top }}
            onMouseDown={(e) => {
                if (!e.target.closest("input")) e.preventDefault(); // keep text editing alive
            }}
        >
            <div className="cp-obj-actions">
                <button type="button" onClick={copy} title="Copy (Ctrl+C)" aria-label="Copy">
                    {copied ? <FaCheck /> : <FaRegCopy />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                </button>

                {hasClip && (
                    <button type="button" onClick={paste} title="Paste (Ctrl+V)" aria-label="Paste">
                        <FaPaste />
                        <span>Paste</span>
                    </button>
                )}

                <button type="button" onClick={duplicate} title="Duplicate (Ctrl+D)" aria-label="Duplicate">
                    <FaClone />
                    <span>Duplicate</span>
                </button>

                <button
                    type="button"
                    className="danger"
                    onClick={remove}
                    title="Delete (Del)"
                    aria-label="Delete"
                >
                    <FaTrashAlt />
                    <span>Delete</span>
                </button>
            </div>

            {info.text && (
                <div className="cp-obj-color">
                    <label className="cp-obj-swatch" style={{ background: info.color }} title="Text colour">
                        <input
                            type="color"
                            value={info.color}
                            onChange={(e) => paint(e.target.value)}
                            aria-label="Text colour"
                        />
                    </label>

                    <label className="cp-obj-check">
                        <input type="checkbox" checked={applyAll} onChange={handleApplyAll} />
                        <span>Apply color to all text</span>
                    </label>
                </div>
            )}
        </div>
    );
};

export default ObjectActionBar;
