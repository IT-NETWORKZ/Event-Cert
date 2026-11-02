import JSZip from "jszip"; // npm i jszip jspdf
import { jsPDF } from "jspdf";
import { buildLookup, getPageSources, renderPageToPng } from "./templateRender";

const MAX_EXPORT_SIDE = 4000;

const tick = () => new Promise((r) => setTimeout(r, 0)); // lets the UI breathe between rows

const safeName = (s) =>
    String(s || "")
        .replace(/[\\/:*?"<>|]+/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 60);

const dataUrlToBlob = async (url) => (await fetch(url)).blob();

const saveBlob = (blob, fileName) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
};

const buildPdf = (images) => {
    let pdf = null;

    images.forEach(({ url, width, height }, i) => {
        const orientation = width > height ? "l" : "p";
        if (i === 0) {
            pdf = new jsPDF({ unit: "px", format: [width, height], orientation, hotfixes: ["px_scaling"] });
        } else {
            pdf.addPage([width, height], orientation);
        }
        pdf.addImage(url, "PNG", 0, 0, width, height, undefined, "FAST");
    });

    return pdf.output("blob");
};

// Smart download for the PNG / PDF buttons (rows = the ticked Excel rows)
//   1 row,  PNG, 1 page   -> that PNG directly
//   1 row,  PNG, N pages  -> ZIP of the pages
//   1 row,  PDF           -> that PDF directly (all pages inside)
//   2+ rows               -> ONE ZIP: a PNG per page per row / one PDF per row
export const smartDownload = async ({ type, rows, pages, activePage, canvas, onProgress }) => {
    const sources = getPageSources(pages, activePage, canvas);
    const multiPage = sources.length > 1;
    const single = rows.length === 1;
    const zip = new JSZip();
    const used = {}; // same name twice -> "Name", "Name (2)" so nothing is overwritten
    const uniqueBase = (row) => {
        const name = safeName(row.name) || "design";
        const key = name.toLowerCase();
        used[key] = (used[key] || 0) + 1;
        return used[key] === 1 ? name : `${name} (${used[key]})`;
    };
    let direct = null; // { blob, name } when no ZIP is needed

    for (let i = 0; i < rows.length; i += 1) {
        const row = rows[i];
        const lookup = buildLookup(row);
        const base = uniqueBase(row); // user name only, no numbers

        const images = [];
        for (const source of sources) {
            images.push(await renderPageToPng(source, lookup, MAX_EXPORT_SIDE));
        }

        if (type === "pdf") {
            const blob = buildPdf(images);
            if (single) direct = { blob, name: `${base}.pdf` };
            else zip.file(`${base}.pdf`, blob);
        } else {
            for (let p = 0; p < images.length; p += 1) {
                const blob = await dataUrlToBlob(images[p].url);
                // one page -> Name.png ; several pages -> Name/Name_page1.png ...
                const name = multiPage ? `${base}/${base}_page${p + 1}.png` : `${base}.png`;
                if (single && !multiPage) direct = { blob, name };
                else zip.file(name, blob);
            }
        }

        if (onProgress) onProgress(i + 1, rows.length);
        await tick();
    }

    if (direct) {
        saveBlob(direct.blob, direct.name);
        return "file";
    }

    const out = await zip.generateAsync({ type: "blob", compression: "STORE" });
    saveBlob(out, single ? `${safeName(rows[0].name) || "design"}.zip` : `${type}-files.zip`);
    return "zip";
};
