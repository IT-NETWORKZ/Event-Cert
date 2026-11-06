import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Sparkles,
  MailOpen,
  PartyPopper,
  ChevronDown,
  Copy,
  Check,
  Languages,
} from "lucide-react";
import { LANGUAGES, getCategories } from "./draftData";
import "./DraftModal.css";

const TABS = [
  { id: "invitation", label: "Invitation", Icon: MailOpen },
  { id: "greeting", label: "Greeting", Icon: PartyPopper },
];

export default function DraftModal({ open, onClose, onCopy }) {
  const [tab, setTab] = useState("invitation");
  const [lang, setLang] = useState("en");
  const [langOpen, setLangOpen] = useState(false);
  const [openCat, setOpenCat] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const langWrapRef = useRef(null);
  const langBtnRef = useRef(null);
  const langMenuRef = useRef(null);
  const langOpenRef = useRef(false);

  const currentLang = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];
  const dir = currentLang.rtl ? "rtl" : "ltr";

  useEffect(() => {
    langOpenRef.current = langOpen;
  }, [langOpen]);

  // Esc: close dropdown first, then the modal. Also lock background scroll.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (langOpenRef.current) {
        setLangOpen(false);
        langBtnRef.current?.focus();
      } else {
        onClose?.();
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  // Close the dropdown on outside click / tap
  useEffect(() => {
    if (!langOpen) return;
    const onDown = (e) => {
      if (langWrapRef.current && !langWrapRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [langOpen]);

  // Scroll the selected language into view when the dropdown opens
  useEffect(() => {
    if (!langOpen) return;
    langMenuRef.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [langOpen]);

  // Reset when the popup is closed
  useEffect(() => {
    if (!open) {
      setLangOpen(false);
      setOpenCat(null);
    }
  }, [open]);

  useEffect(() => setOpenCat(null), [tab]);

  const categories = useMemo(() => getCategories(tab, lang), [tab, lang]);

  const pickLang = (code) => {
    setLang(code);
    setLangOpen(false);
    langBtnRef.current?.focus();
  };

  // Keyboard support on the language button
  const onLangKeyDown = (e) => {
    const idx = LANGUAGES.findIndex((l) => l.code === lang);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const next =
        e.key === "ArrowDown"
          ? Math.min(idx + 1, LANGUAGES.length - 1)
          : Math.max(idx - 1, 0);
      setLang(LANGUAGES[next].code);
      setLangOpen(true);
    } else if (e.key === "Home" && langOpen) {
      e.preventDefault();
      setLang(LANGUAGES[0].code);
    } else if (e.key === "End" && langOpen) {
      e.preventDefault();
      setLang(LANGUAGES[LANGUAGES.length - 1].code);
    }
  };

  // Keep the highlighted option visible while using the arrow keys
  useEffect(() => {
    if (!langOpen) return;
    langMenuRef.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [lang, langOpen]);

  const handleCopy = useCallback(
    async (text, key) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopiedKey(key);
      onCopy?.(text);
      setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1500);
    },
    [onCopy]
  );

  if (!open) return null;

  return createPortal(
    <div
      className="dm-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div className="dm-modal" role="dialog" aria-modal="true" aria-labelledby="dm-title">
        {/* Header (fixed) */}
        <div className="dm-header">
          <h3 id="dm-title" className="dm-title">
            <Sparkles size={20} />
            Draft
          </h3>
          <button type="button" className="dm-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Tabs (fixed) */}
        <div className="dm-tabs" role="tablist">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              className={`dm-tab ${tab === id ? "is-active" : ""}`}
              onClick={() => setTab(id)}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Language bar (fixed) with custom dropdown */}
        <div className="dm-toolbar">
          <span className="dm-toolbar-label">Language</span>

          <div className="dm-lang" ref={langWrapRef}>
            <button
              ref={langBtnRef}
              type="button"
              className={`dm-lang-btn ${langOpen ? "is-open" : ""}`}
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              onClick={() => setLangOpen((v) => !v)}
              onKeyDown={onLangKeyDown}
            >
              <Languages size={16} className="dm-lang-icon" />
              <span className="dm-lang-value">{currentLang.label}</span>
              <ChevronDown size={16} className="dm-lang-chevron" />
            </button>

            {langOpen && (
              <ul className="dm-lang-menu" role="listbox" ref={langMenuRef}>
                {LANGUAGES.map((l) => {
                  const selected = l.code === lang;
                  return (
                    <li
                      key={l.code}
                      role="option"
                      aria-selected={selected}
                      className={`dm-lang-opt ${selected ? "is-selected" : ""}`}
                      onClick={() => pickLang(l.code)}
                    >
                      <span>{l.label}</span>
                      {selected && <Check size={16} />}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Scrollable list */}
        <div className="dm-list">
          {categories.map((cat) => {
            const isOpen = openCat === cat.id;
            return (
              <div
                key={cat.id}
                className={`dm-acc ${isOpen ? "is-open" : ""}`}
                dir={dir}
                lang={lang}
              >
                <button
                  type="button"
                  className="dm-acc-head"
                  aria-expanded={isOpen}
                  onClick={() => setOpenCat(isOpen ? null : cat.id)}
                >
                  <span>{cat.label}</span>
                  <ChevronDown size={20} className="dm-chevron" />
                </button>

                {isOpen && (
                  <div className="dm-acc-body">
                    {cat.items.map((text, i) => {
                      const key = `${tab}-${cat.id}-${i}`;
                      const copied = copiedKey === key;
                      return (
                        <div className="dm-item" key={key}>
                          <p className="dm-text">{text}</p>
                          <button
                            type="button"
                            className={`dm-copy ${copied ? "is-copied" : ""}`}
                            onClick={() => handleCopy(text, key)}
                          >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                            <span>{copied ? "Copied" : "Copy"}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}