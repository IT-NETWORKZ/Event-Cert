// Recent designs are kept in the browser (localStorage), newest first.
// Each item: { id, name, src (small JPEG preview), width, height, createdAt }
// width / height = the ORIGINAL image size, used to size the canvas again.

const KEY = "cp_recent_designs";
const MAX_ITEMS = 12;

export const getRecent = () => {
    try {
        const list = JSON.parse(localStorage.getItem(KEY));
        return Array.isArray(list) ? list : [];
    } catch {
        return [];
    }
};

const save = (list) => {
    // if the browser storage is full, drop the oldest item and try again
    let current = list;
    while (current.length) {
        try {
            localStorage.setItem(KEY, JSON.stringify(current));
            return current;
        } catch {
            current = current.slice(0, -1);
        }
    }
    try {
        localStorage.removeItem(KEY);
    } catch {
        /* ignore */
    }
    return [];
};

export const addRecent = (item) => {
    const list = [item, ...getRecent()].slice(0, MAX_ITEMS);
    return save(list);
};

export const removeRecent = (id) => save(getRecent().filter((i) => i.id !== id));

export const clearRecent = () => save([]);

// Make a small JPEG preview so many designs fit in storage
export const createThumb = (dataUrl, maxDim = 1000, quality = 0.75) =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const ratio = Math.min(1, maxDim / Math.max(img.width, img.height));
            const w = Math.max(1, Math.round(img.width * ratio));
            const h = Math.max(1, Math.round(img.height * ratio));

            const c = document.createElement("canvas");
            c.width = w;
            c.height = h;
            const ctx = c.getContext("2d");
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, w, h);
            ctx.drawImage(img, 0, 0, w, h);

            resolve({
                src: c.toDataURL("image/jpeg", quality),
                width: img.width,
                height: img.height,
            });
        };
        img.onerror = reject;
        img.src = dataUrl;
    });