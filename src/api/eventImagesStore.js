import QRCode from "qrcode"; // npm install qrcode

/* ==========================================================================
   STATIC STORE (no backend)
   - event pictures   -> IndexedDB  (bigger than localStorage, fits 12 x 1 MB)
   - attendance QR    -> localStorage (same key the Add Event page uses)
   Used by: Upload Event Images page  +  Event page
   ========================================================================== */

export const MAX_IMAGES = 12;
export const MAX_IMAGE_BYTES = 1024 * 1024; // 1 MB per picture

const DB_NAME = "eventcert-static";
const STORE = "eventImages";

const openDb = () =>
  new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

// -> ["data:image/png;base64,...", ...]  (empty list when nothing was uploaded)
export const getEventImages = async (eventId) => {
  if (eventId === undefined || eventId === null || eventId === "") return [];
  try {
    const db = await openDb();
    return await new Promise((resolve) => {
      const req = db.transaction(STORE).objectStore(STORE).get(String(eventId));
      req.onsuccess = () => resolve(Array.isArray(req.result) ? req.result : []);
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
};

// replaces every picture of the event (an empty list removes them all)
export const saveEventImages = async (eventId, images) => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    if (images.length) store.put(images, String(eventId));
    else store.delete(String(eventId));
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
};

export const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

/* ---------- attendance QR ---------- */
// V2 key: the QR link now carries the event title + dates (the phone that scans it has no saved data)
const QR_KEY = "eventAttendanceQr2";

const readQrStore = () => {
  try {
    return JSON.parse(localStorage.getItem(QR_KEY) || "{}");
  } catch {
    return {};
  }
};

// link written inside the QR:  /attendance?eventId=12&title=Java%20Webinar&start=2026-11-26&end=2026-11-27
export const attendanceLink = ({ id, title, start, end }) => {
  const url = new URL("/attendance", window.location.origin);
  url.searchParams.set("eventId", id);
  if (title) url.searchParams.set("title", title);
  if (start) url.searchParams.set("start", start);
  if (start || end) url.searchParams.set("end", end || start);
  return url.toString();
};

export const makeAttendanceQrPng = (info) =>
  QRCode.toDataURL(attendanceLink(info), {
    width: 320,
    margin: 1,
    color: { dark: "#00796b", light: "#ffffff" },
  });

// returns the saved QR of the event, or makes + saves it when it does not exist yet
// info = { title, start, end }  (start / end as yyyy-mm-dd)
export const getAttendanceQr = async (eventId, info = {}) => {
  if (eventId === undefined || eventId === null || eventId === "" || Number(eventId) === 0) return "";
  const map = readQrStore();
  if (map[eventId]) return map[eventId];
  try {
    const png = await makeAttendanceQrPng({ id: eventId, ...info });
    localStorage.setItem(QR_KEY, JSON.stringify({ ...readQrStore(), [eventId]: png }));
    return png;
  } catch {
    return "";
  }
};
