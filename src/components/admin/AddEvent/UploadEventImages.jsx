import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, CheckCircle2, ExternalLink, ImagePlus, Loader2, UploadCloud, X } from "lucide-react";
import { getEvents, toImageUrl } from "../../../api/adminService";
import {
  MAX_IMAGES,
  MAX_IMAGE_BYTES,
  fileToDataUrl,
  getEventImages,
  saveEventImages,
} from "../../../api/eventImagesStore";
import "./UploadEventImages.css";

const emptySlots = () => Array.from({ length: MAX_IMAGES }, () => ({ src: "", name: "", key: 0 }));
const ALLOWED = ["image/png", "image/jpeg"];

const errText = (err, fallback) => {
  const data = err?.response?.data;
  return data?.message || data?.title || err?.message || fallback;
};

/* ==========================================================================
   Upload Event Images
   1) pick an event   2) choose up to 12 pictures (small preview in the same box)
   3) "Upload All Images"  -> they appear on the Event page (next / previous)
   Static: pictures are kept in this browser (IndexedDB), no backend.
   ========================================================================== */
const UploadEventImages = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventId, setEventId] = useState(params.get("eventId") || "");
  const [slots, setSlots] = useState(emptySlots);
  const [hadSaved, setHadSaved] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; };
  }, []);

  /* ---------- events for the dropdown (existing admin events API) ---------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await getEvents();
        if (!alive.current) return;
        setEvents(
          res.list.map((e) => ({
            id: String(e.eventId ?? e.id),
            title: e.eventTitle || "Untitled event",
            raw: e,
          }))
        );
      } catch (err) {
        console.error(err);
        if (alive.current) setMsg({ type: "error", text: errText(err, "Could not load your events.") });
      } finally {
        if (alive.current) setEventsLoading(false);
      }
    })();
  }, []);

  /* ---------- load the pictures already uploaded for the chosen event ---------- */
  useEffect(() => {
    if (!eventId) {
      setSlots(emptySlots());
      setHadSaved(false);
      return undefined;
    }
    let cancelled = false;
    setLoadingImages(true);
    getEventImages(eventId).then((saved) => {
      if (cancelled) return;
      const next = emptySlots();
      saved.slice(0, MAX_IMAGES).forEach((src, i) => {
        next[i] = { src, name: `Uploaded image ${i + 1}`, key: 0 };
      });
      setSlots(next);
      setHadSaved(saved.length > 0);
      setLoadingImages(false);
    });
    return () => { cancelled = true; };
  }, [eventId]);

  const event = useMemo(() => events.find((e) => e.id === eventId) || null, [events, eventId]);
  const filled = slots.filter((s) => s.src).length;

  const handleSelect = (e) => {
    const id = e.target.value;
    setEventId(id);
    setMsg({ type: "", text: "" });
    setParams(id ? { eventId: id } : {}, { replace: true });
  };

  /* ---------- choose / remove a picture ---------- */
  const handleFile = async (index, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED.includes(file.type)) {
      e.target.value = "";
      setMsg({ type: "error", text: `Image ${index + 1}: only PNG or JPG pictures are allowed.` });
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      e.target.value = "";
      setMsg({ type: "error", text: `Image ${index + 1}: size must be 1 MB or less.` });
      return;
    }

    try {
      const src = await fileToDataUrl(file);
      setSlots((prev) => prev.map((s, i) => (i === index ? { ...s, src, name: file.name } : s)));
      setMsg({ type: "", text: "" });
    } catch {
      setMsg({ type: "error", text: `Image ${index + 1}: could not read the file.` });
    }
  };

  const removeSlot = (index) => {
    // key changes -> the file input is re-created, so the same file can be chosen again
    setSlots((prev) => prev.map((s, i) => (i === index ? { src: "", name: "", key: s.key + 1 } : s)));
  };

  /* ---------- Upload All Images ---------- */
  const handleUploadAll = async () => {
    if (!eventId) {
      setMsg({ type: "error", text: "Please select an event first." });
      return;
    }
    const images = slots.map((s) => s.src).filter(Boolean);
    if (!images.length && !hadSaved) {
      setMsg({ type: "error", text: "Please choose at least one image." });
      return;
    }

    setSaving(true);
    try {
      await saveEventImages(eventId, images);
      if (!alive.current) return;
      setHadSaved(images.length > 0);
      setMsg({
        type: "ok",
        text: images.length
          ? `${images.length} image(s) uploaded. They now show on the event page.`
          : "All images were removed from this event.",
      });
    } catch (err) {
      console.error(err);
      if (alive.current) {
        setMsg({ type: "error", text: "Could not save the images (browser storage is full or blocked)." });
      }
    } finally {
      if (alive.current) setSaving(false);
    }
  };

  // open the public event page of the chosen event
  const viewEventPage = () => {
    if (!event) return;
    const e = event.raw;
    navigate(`/event?nID=${event.id}`, {
      state: {
        event: {
          id: e.eventId ?? e.id,
          title: e.eventTitle,
          date: e.eventStartDate,
          endDate: e.eventCompletionDate,
          location: [e.venue, e.city, e.state].filter(Boolean).join(", "),
          state: e.state,
          city: e.city,
          mode: e.mode,
          description: e.aboutEvent,
          entry: e.entryFee,
          image: toImageUrl(e.image1) || "",
        },
      },
    });
  };

  return (
    <div className="uei-page">
      <div className="uei-card">
        <div className="uei-head">
          <h3 className="uei-title">Upload Event Images</h3>
          <p className="uei-sub">Select an event and upload up to {MAX_IMAGES} images. Maximum 1 MB per image.</p>
          <button type="button" className="uei-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        {msg.text && (
          <div className={`uei-msg ${msg.type}`} role="status">
            {msg.type === "ok" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{msg.text}</span>
          </div>
        )}

        {/* select event */}
        <label className="uei-field">
          <span>Select Event <b>*</b></span>
          <select value={eventId} onChange={handleSelect} disabled={eventsLoading}>
            <option value="">{eventsLoading ? "Loading events..." : "-- Select Event --"}</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>{e.title}</option>
            ))}
          </select>
        </label>

        <hr className="uei-divider" />

        <div className="uei-bar">
          <h4>Select Event Images</h4>
          <span className="uei-limit">Maximum {MAX_IMAGES} Images</span>
        </div>

        {loadingImages ? (
          <div className="uei-loading"><Loader2 size={22} className="uei-spin" /> Loading images...</div>
        ) : (
          <div className="uei-grid">
            {slots.map((slot, i) => (
              <div className={`uei-slot${slot.src ? " has-image" : ""}${!eventId ? " disabled" : ""}`} key={i}>
                <div className="uei-slot-title">Image {i + 1}</div>

                <label className="uei-choose">
                  <input
                    key={slot.key}
                    type="file"
                    accept="image/png, image/jpeg"
                    disabled={!eventId}
                    onChange={(e) => handleFile(i, e)}
                  />
                  <span className="uei-choose-btn"><ImagePlus size={15} /> Choose file</span>
                  <span className="uei-choose-name">{slot.name || "No file chosen"}</span>
                </label>

                {/* small preview in the same box */}
                <div className="uei-preview">
                  {slot.src ? (
                    <>
                      <img src={slot.src} alt={`Preview of image ${i + 1}`} />
                      <button type="button" className="uei-remove" onClick={() => removeSlot(i)} aria-label={`Remove image ${i + 1}`} title="Remove">
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <span className="uei-placeholder">Preview</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="uei-actions">
          <span className="uei-count">{filled} / {MAX_IMAGES} selected</span>
          {event && hadSaved && (
            <button type="button" className="uei-btn uei-btn-ghost" onClick={viewEventPage}>
              <ExternalLink size={17} /> View Event Page
            </button>
          )}
          <button type="button" className="uei-btn" onClick={handleUploadAll} disabled={saving || !eventId}>
            {saving ? <Loader2 size={18} className="uei-spin" /> : <UploadCloud size={18} />}
            <span>{saving ? "Uploading..." : "Upload All Images"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadEventImages;
