import { fabric } from "fabric";

// Shared by Preview and Bulk download:
// draws one page off-screen with an Excel row's values put into {{PLACEHOLDERS}}.

// {{NAME}}, {{Name}}, {{ name }}, {{TEXT1}} ... all match (case and spaces ignored)
const PLACEHOLDER_RE = /\{\{\s*([^{}]+?)\s*\}\}/g;
const TEXT_TYPES = ["i-text", "textbox", "text"];

const normKey = (k) => String(k).toLowerCase().replace(/[\s_-]+/g, "");

export const buildLookup = (row) => {
    const map = {};
    Object.entries(row || {}).forEach(([k, v]) => {
        map[normKey(k)] = v == null ? "" : String(v);
    });
    return map;
};

// unknown placeholders stay visible, so a typo in the design is easy to spot
const fillText = (text, lookup) =>
    text.replace(PLACEHOLDER_RE, (full, key) => {
        const k = normKey(key);
        return k in lookup ? lookup[k] : full;
    });

// The page being edited is read live from the canvas, other pages from saved data
export const getPageSources = (pages, activePage, canvas) =>
    pages.map((p) =>
        p.id === activePage && canvas
            ? { json: canvas.toJSON(), width: canvas.getWidth(), height: canvas.getHeight() }
            : { json: p.json, width: p.width, height: p.height }
    );

// source = { json, width, height }  ->  { url (png data URL), width, height }
export const renderPageToPng = async ({ json, width, height }, lookup, maxSide = 1600) => {
    const fonts = new Set();
    (json?.objects || []).forEach((o) => o.fontFamily && fonts.add(o.fontFamily));
    await Promise.all(
        [...fonts].map((f) => document.fonts.load(`28px "${f}"`).catch(() => {}))
    );

    return new Promise((resolve) => {
        const el = document.createElement("canvas");
        const sc = new fabric.StaticCanvas(el, {
            width,
            height,
            backgroundColor: "#ffffff",
            renderOnAddRemove: false,
        });

        const finish = () => {
            sc.renderAll();
            const multiplier = Math.min(1, maxSide / Math.max(width, height));
            const url = sc.toDataURL({ format: "png", multiplier });
            sc.dispose();
            resolve({ url, width, height });
        };

        if (!json) {
            finish();
            return;
        }

        // copy, so the saved page data is never touched
        sc.loadFromJSON(JSON.parse(JSON.stringify(json)), () => {
            sc.getObjects().forEach((o) => {
                if (TEXT_TYPES.includes(o.type) && typeof o.text === "string" && o.text.includes("{{")) {
                    o.set({ text: fillText(o.text, lookup), dirty: true });
                }
            });
            finish();
        });
    });
};

// Preview helper: returns just the data URL
export const renderPage = async (source, lookup, maxSide = 1600) =>
    (await renderPageToPng(source, lookup, maxSide)).url;
