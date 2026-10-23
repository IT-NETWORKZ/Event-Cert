import React, { useState, useEffect, useRef } from "react";
import {
  FaFont,
  FaSearchPlus,
  FaSearchMinus,
  FaCopy,
  FaArrowUp,
  FaArrowDown,
  FaTrash,
  FaUndo,
  FaRedo,
  FaPalette,
  FaPencilAlt,
  FaBold,
  FaItalic,
  FaAlignCenter,
  FaEraser,
  FaAlignLeft,
  FaAlignRight,
  FaMinus,
  FaPlus,
} from "react-icons/fa";
import {
  MdVerticalAlignTop,
  MdVerticalAlignCenter,
  MdVerticalAlignBottom,
} from "react-icons/md";
import { fabric } from "fabric";
import { useCanvas } from "../../../context/CanvasContext";
import "../../../css/CanvasToolbar.css";

// Insert your Google Fonts Developer API Key here to pull hundreds of live fonts!
const GOOGLE_FONTS_API_KEY = "YOUR_GOOGLE_FONTS_API_KEY_HERE";

// Standard local system fonts (like Microsoft Word) to use as an instant fallback
const WORD_FALLBACK_FONTS = [
  "Arial", "Arial Black", "Calibri", "Cambria", "Candara", "Comic Sans MS",
  "Consolas", "Courier New", "Georgia", "Impact", "Lucida Console",
  "Lucida Sans Unicode", "Segoe UI", "Tahoma", "Times New Roman",
  "Trebuchet MS", "Verdana", "Garamond", "Bookman Old Style", "Century Gothic"
];

// Font size limits and step used by the size stepper
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 200;
const FONT_SIZE_STEP = 2;
const DEFAULT_FONT_SIZE = 28;

// What the toolbar shows when nothing (or no text) is selected
const EMPTY_FORMAT = { bold: false, italic: false, align: null };

// Layout containers that must NEVER be scrolled sideways
const LOCKED_LAYOUT_SELECTORS =
  ".dsg-page, .cp-layout, .cp-main, .cp-editor, .cp-canvas-area, .cp-page-panel, .cp-sidebar, .cp-canvas-wrapper, .cp-workspace";

// ---------------- Helpers ----------------
const isTextObject = (obj) => {
  if (!obj) return false;
  return ["i-text", "textbox", "text"].includes(obj.type);
};

// "bold", 600, 700... all count as bold (new text is created with weight 600)
const isBoldWeight = (weight) =>
  weight === "bold" || parseInt(weight, 10) >= 600;

const isItalicStyle = (style) => style === "italic" || style === "oblique";

// Returns every text object in the current selection (single or multiple)
const getTextTargets = (activeObj) => {
  if (!activeObj) return [];
  if (activeObj.type === "activeSelection") {
    return activeObj.getObjects().filter(isTextObject);
  }
  return isTextObject(activeObj) ? [activeObj] : [];
};

// Reads Bold / Italic / Align from the first text in the selection
const readFormat = (activeObj) => {
  const [firstText] = getTextTargets(activeObj);
  if (!firstText) return EMPTY_FORMAT;
  return {
    bold: isBoldWeight(firstText.get("fontWeight")),
    italic: isItalicStyle(firstText.get("fontStyle")),
    align: firstText.get("textAlign") || "left",
  };
};

const CanvasToolbar = () => {
  const {
    canvas,
    past,
    future,
    setPast,
    setFuture,
    saveState,
  } = useCanvas();

  const toolbarRef = useRef(null);

  const [currentColor, setCurrentColor] = useState("#4F46E5");
  const [currentFont, setCurrentFont] = useState("Arial");
  const [currentFontSize, setCurrentFontSize] = useState(DEFAULT_FONT_SIZE);
  const [fontSizeInput, setFontSizeInput] = useState(String(DEFAULT_FONT_SIZE));
  const [format, setFormat] = useState(EMPTY_FORMAT); // drives the B / I / align highlight
  const [isDrawing, setIsDrawing] = useState(false);
  const [availableFonts, setAvailableFonts] = useState(WORD_FALLBACK_FONTS);

  const pastHistory = past || [];
  const futureHistory = future || [];

  // 0. PAGE SHIFT FIX
  useEffect(() => {
    const toolbarEl = toolbarRef.current;
    if (!toolbarEl) return undefined;

    const snapBack = () => {
      if (window.scrollX !== 0) window.scrollTo(0, window.scrollY);
      const root = document.scrollingElement;
      if (root && root.scrollLeft !== 0) root.scrollLeft = 0;

      let node = toolbarEl.parentElement;
      while (node) {
        if (node.scrollLeft !== 0) node.scrollLeft = 0;
        node = node.parentElement;
      }

      document.querySelectorAll(LOCKED_LAYOUT_SELECTORS).forEach((el) => {
        if (el.scrollLeft !== 0) el.scrollLeft = 0;
      });
    };

    const onScroll = (e) => {
      if (e.target === toolbarEl) return;
      snapBack();
    };

    let timers = [];
    const snapBackSoon = () => {
      requestAnimationFrame(snapBack);
      timers.forEach(clearTimeout);
      timers = [setTimeout(snapBack, 60), setTimeout(snapBack, 250)];
    };

    document.addEventListener("scroll", onScroll, true);
    toolbarEl.addEventListener("pointerup", snapBackSoon);
    toolbarEl.addEventListener("focusin", snapBackSoon);
    toolbarEl.addEventListener("click", snapBackSoon);

    return () => {
      document.removeEventListener("scroll", onScroll, true);
      toolbarEl.removeEventListener("pointerup", snapBackSoon);
      toolbarEl.removeEventListener("focusin", snapBackSoon);
      toolbarEl.removeEventListener("click", snapBackSoon);
      timers.forEach(clearTimeout);
    };
  }, [canvas]);

  // 1. Load system fonts instantly, then attempt to fetch the complete Google Fonts catalog
  useEffect(() => {
    if (!GOOGLE_FONTS_API_KEY || GOOGLE_FONTS_API_KEY.includes("YOUR_GOOGLE_FONTS_API_KEY")) {
      return;
    }

    fetch(`https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=${GOOGLE_FONTS_API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          const fetchedFonts = data.items.map((font) => font.family);
          const combinedFonts = Array.from(new Set([...WORD_FALLBACK_FONTS, ...fetchedFonts]));
          setAvailableFonts(combinedFonts);
        }
      })
      .catch((err) => console.error("Failed to load web fonts catalog:", err));
  }, []);

  // 2. Sync toolbar states whenever selection changes
  useEffect(() => {
    if (!canvas) return;

    const syncFontSize = (size) => {
      const rounded = Math.round(size);
      setCurrentFontSize(rounded);
      setFontSizeInput(String(rounded));
    };

    const handleSelection = () => {
      const activeObj = canvas.getActiveObject();
      if (!activeObj) return;

      const objColor = activeObj.get("fill") || activeObj.get("stroke");
      if (typeof objColor === "string" && objColor.startsWith("#")) {
        setCurrentColor(objColor);
      }

      setFormat(readFormat(activeObj));

      const [firstText] = getTextTargets(activeObj);
      if (firstText) {
        setCurrentFont(firstText.get("fontFamily") || "Arial");
        syncFontSize(firstText.get("fontSize") || DEFAULT_FONT_SIZE);
      }
    };

    const handleCleared = () => {
      setCurrentFont("Arial");
      syncFontSize(DEFAULT_FONT_SIZE);
      setFormat(EMPTY_FORMAT);
    };

    canvas.on("selection:created", handleSelection);
    canvas.on("selection:updated", handleSelection);
    canvas.on("selection:cleared", handleCleared);

    return () => {
      canvas.off("selection:created", handleSelection);
      canvas.off("selection:updated", handleSelection);
      canvas.off("selection:cleared", handleCleared);
    };
  }, [canvas]);

  if (!canvas) return null;

  const keepFocusOnButtonPress = (e) => {
    if (e.target.closest("button")) e.preventDefault();
  };

  // 3. Dynamic Font Engine
  const changeFontFamily = async (e) => {
    const selectedFont = e.target.value;
    setCurrentFont(selectedFont);

    const activeObj = canvas.getActiveObject();
    if (!activeObj || !isTextObject(activeObj)) return;

    if (!WORD_FALLBACK_FONTS.includes(selectedFont)) {
      const fontId = `dynamic-font-${selectedFont.replace(/\s+/g, "-").toLowerCase()}`;
      if (!document.getElementById(fontId)) {
        const link = document.createElement("link");
        link.id = fontId;
        link.rel = "stylesheet";
        link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(selectedFont)}&display=swap`;
        document.head.appendChild(link);
      }

      try {
        await document.fonts.load(`28px "${selectedFont}"`);
      } catch (error) {
        console.error("Font payload download skipped/timed out:", error);
      }
    }

    activeObj.set({
      fontFamily: selectedFont,
      dirty: true,
    });
    activeObj.setCoords();
    canvas.requestRenderAll();
    saveState(canvas);
  };

  // ---------------- Font Size Engine ----------------
  const clampFontSize = (value) =>
    Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, Math.round(value)));

  const applyFontSize = (newSize) => {
    const size = clampFontSize(newSize);
    setCurrentFontSize(size);
    setFontSizeInput(String(size));

    const activeObj = canvas.getActiveObject();
    const targets = getTextTargets(activeObj);
    if (targets.length === 0) return;

    targets.forEach((textObj) => {
      textObj.set({ fontSize: size, dirty: true });
      textObj.setCoords();
    });

    if (activeObj.type === "activeSelection") {
      activeObj.addWithUpdate();
    }

    canvas.requestRenderAll();
    saveState(canvas);
  };

  const increaseFontSize = () => applyFontSize(currentFontSize + FONT_SIZE_STEP);
  const decreaseFontSize = () => applyFontSize(currentFontSize - FONT_SIZE_STEP);

  const handleFontSizeInputChange = (e) => {
    const cleaned = e.target.value.replace(/[^0-9]/g, "").slice(0, 3);
    setFontSizeInput(cleaned);
  };

  const commitFontSizeInput = () => {
    const parsed = parseInt(fontSizeInput, 10);
    if (Number.isNaN(parsed)) {
      setFontSizeInput(String(currentFontSize));
      return;
    }
    applyFontSize(parsed);
  };

  const handleFontSizeKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitFontSizeInput();
      e.target.blur();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      increaseFontSize();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      decreaseFontSize();
    }
  };

  // ---------------- Undo/Redo Engine ----------------
  const undo = () => {
    if (pastHistory.length === 0) return;
    const previousState = pastHistory[pastHistory.length - 1];
    const currentState = JSON.stringify(canvas.toJSON());

    setPast((prev) => prev.slice(0, -1));
    setFuture((prev) => [currentState, ...prev]);

    canvas.off("object:added");
    canvas.off("object:modified");
    canvas.off("object:removed");

    canvas.loadFromJSON(previousState, () => {
      canvas.renderAll();
      canvas.on("object:added", () => saveState());
      canvas.on("object:modified", () => saveState());
      canvas.on("object:removed", () => saveState());
    });
  };

  const redo = () => {
    if (futureHistory.length === 0) return;
    const nextState = futureHistory[0];
    const currentState = JSON.stringify(canvas.toJSON());

    setFuture((prev) => prev.slice(1));
    setPast((prev) => [...prev, currentState]);

    canvas.off("object:added");
    canvas.off("object:modified");
    canvas.off("object:removed");

    canvas.loadFromJSON(nextState, () => {
      canvas.renderAll();
      canvas.on("object:added", () => saveState());
      canvas.on("object:modified", () => saveState());
      canvas.on("object:removed", () => saveState());
    });
  };

  // ---------------- Object and Brush Modifiers ----------------
  const changeColor = (e) => {
    const newColor = e.target.value;
    setCurrentColor(newColor);

    const activeObj = canvas.getActiveObject();
    if (!activeObj) {
      if (canvas.isDrawingMode && canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = newColor;
      }
      return;
    }

    if (activeObj.type === "activeSelection") {
      activeObj.forEachObject((obj) => {
        if (obj.type === "path") obj.set("stroke", newColor);
        else obj.set("fill", newColor);
      });
    } else {
      if (activeObj.type === "path") activeObj.set("stroke", newColor);
      else activeObj.set("fill", newColor);
    }
    canvas.renderAll();
  };

  const handleColorPickerBlur = () => saveState(canvas);

  const toggleDrawingMode = () => {
    const updatedDrawingState = !isDrawing;
    setIsDrawing(updatedDrawingState);
    canvas.isDrawingMode = updatedDrawingState;

    if (updatedDrawingState) {
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.width = 6;
      canvas.freeDrawingBrush.color = currentColor;
    }
    canvas.discardActiveObject().renderAll();
  };

  const addCreativeText = () => {
    const canvasWidth = canvas.getWidth() || 300;
    const text = new fabric.Textbox("Type Here...", {
      left: 50,
      top: 150,
      width: Math.min(canvasWidth - 100, 260),
      fontSize: currentFontSize,
      fontFamily: currentFont,
      fontWeight: "600",
      textAlign: "center",
      splitByGrapheme: false,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    text.enterEditing();

    if (text.hiddenTextarea) {
      text.hiddenTextarea.focus({ preventScroll: true });
    }

    setFormat(readFormat(text));
    canvas.renderAll();
    saveState(canvas);
  };

  // ---------------- Bold / Italic ----------------
  const toggleBold = () => {
    const activeObj = canvas.getActiveObject();
    const targets = getTextTargets(activeObj);
    if (targets.length === 0) return;

    const makeBold = !isBoldWeight(targets[0].get("fontWeight"));

    targets.forEach((textObj) => {
      textObj.set({ fontWeight: makeBold ? "bold" : "normal", dirty: true });
      textObj.setCoords();
      if (textObj.isEditing && textObj.hiddenTextarea) {
        textObj.hiddenTextarea.focus({ preventScroll: true });
      }
    });
    if (activeObj.type === "activeSelection") activeObj.addWithUpdate();

    setFormat((prev) => ({ ...prev, bold: makeBold }));
    canvas.requestRenderAll();
    saveState(canvas);
  };

  const toggleItalic = () => {
    const activeObj = canvas.getActiveObject();
    const targets = getTextTargets(activeObj);
    if (targets.length === 0) return;

    const makeItalic = !isItalicStyle(targets[0].get("fontStyle"));

    targets.forEach((textObj) => {
      textObj.set({ fontStyle: makeItalic ? "italic" : "normal", dirty: true });
      textObj.setCoords();
      if (textObj.isEditing && textObj.hiddenTextarea) {
        textObj.hiddenTextarea.focus({ preventScroll: true });
      }
    });
    if (activeObj.type === "activeSelection") activeObj.addWithUpdate();

    setFormat((prev) => ({ ...prev, italic: makeItalic }));
    canvas.requestRenderAll();
    saveState(canvas);
  };

  const centerObject = () => {
    const activeObj = canvas.getActiveObject();
    if (!activeObj) return;
    canvas.centerObject(activeObj);
    activeObj.setCoords();
    canvas.renderAll();
    saveState(canvas);
  };

  const clearCanvas = () => {
    if (window.confirm("Are you sure you want to clear your structural canvas design?")) {
      canvas.clear();
      canvas.backgroundColor = "#ffffff";
      canvas.renderAll();
      setFormat(EMPTY_FORMAT);
      saveState(canvas);
    }
  };

  const duplicate = () => {
    const obj = canvas.getActiveObject();
    if (!obj) return;
    obj.clone((clone) => {
      clone.set({ left: obj.left + 20, top: obj.top + 20 });
      canvas.add(clone);
      canvas.setActiveObject(clone);
      canvas.renderAll();
    });
  };

  const bringForward = () => {
    const obj = canvas.getActiveObject();
    if (obj) { canvas.bringForward(obj); canvas.renderAll(); }
  };

  const sendBackward = () => {
    const obj = canvas.getActiveObject();
    if (obj) { canvas.sendBackwards(obj); canvas.renderAll(); }
  };

  const alignHorizontalText = (alignment) => {
    const activeObj = canvas.getActiveObject();
    const targets = getTextTargets(activeObj);
    if (targets.length === 0) return;

    targets.forEach((textObj) => {
      textObj.set({ textAlign: alignment, dirty: true });
      if (textObj.isEditing && textObj.hiddenTextarea) {
        textObj.hiddenTextarea.focus({ preventScroll: true });
      }
    });

    setFormat((prev) => ({ ...prev, align: alignment }));
    canvas.requestRenderAll();
    saveState(canvas);
  };

  const alignTop = () => {
    const obj = canvas.getActiveObject();
    if (!obj) return;
    obj.set({ top: 0, originY: "top" });
    obj.setCoords();
    canvas.renderAll();
    saveState(canvas);
  };

  const alignMiddle = () => {
    const obj = canvas.getActiveObject();
    if (!obj) return;
    obj.set({ top: canvas.getHeight() / 2, originY: "center" });
    obj.setCoords();
    canvas.renderAll();
    saveState(canvas);
  };

  const alignBottom = () => {
    const obj = canvas.getActiveObject();
    if (!obj) return;
    obj.set({ top: canvas.getHeight(), originY: "bottom" });
    obj.setCoords();
    canvas.renderAll();
    saveState(canvas);
  };

  return (
    <div
      ref={toolbarRef}
      className="toolbar-container"
      onMouseDown={keepFocusOnButtonPress}
    >
      {/* Group 1: Undo/Redo Controls */}
      <div className="toolbar-group">
        <button className="toolbar-button" onClick={undo} disabled={pastHistory.length === 0} title="Undo">
          <FaUndo style={{ opacity: pastHistory.length === 0 ? 0.35 : 1 }} />
        </button>
        <button className="toolbar-button" onClick={redo} disabled={futureHistory.length === 0} title="Redo">
          <FaRedo style={{ opacity: futureHistory.length === 0 ? 0.35 : 1 }} />
        </button>
      </div>

      <div className="toolbar-divider" />

      {/* Group 2: Horizontal Text Alignment */}
      <div className="toolbar-group">
        <button
          type="button"
          className={`toolbar-button ${format.align === "left" ? "active" : ""}`}
          onClick={() => alignHorizontalText("left")}
          aria-pressed={format.align === "left"}
          title="Align Left"
        >
          <FaAlignLeft />
        </button>
        <button
          type="button"
          className={`toolbar-button ${format.align === "center" ? "active" : ""}`}
          onClick={() => alignHorizontalText("center")}
          aria-pressed={format.align === "center"}
          title="Align Center"
        >
          <FaAlignCenter />
        </button>
        <button
          type="button"
          className={`toolbar-button ${format.align === "right" ? "active" : ""}`}
          onClick={() => alignHorizontalText("right")}
          aria-pressed={format.align === "right"}
          title="Align Right"
        >
          <FaAlignRight />
        </button>
      </div>

      <div className="toolbar-divider" />

      {/* Group 3: Vertical Alignment */}
      <div className="toolbar-group">
        <button className="toolbar-button" onClick={alignTop} title="Align Top">
          <MdVerticalAlignTop />
        </button>
        <button className="toolbar-button" onClick={alignMiddle} title="Align Middle">
          <MdVerticalAlignCenter />
        </button>
        <button className="toolbar-button" onClick={alignBottom} title="Align Bottom">
          <MdVerticalAlignBottom />
        </button>
      </div>

      <div className="toolbar-divider" />

      {/* Group 4: Color & Drawing Mode */}
      <div className="toolbar-group">
        <label title="Color Palette" className="color-label" style={{ backgroundColor: currentColor }}>
          <FaPalette style={{ color: "#fff", mixBlendMode: "difference" }} />
          <input
            type="color"
            value={currentColor}
            onChange={changeColor}
            onBlur={handleColorPickerBlur}
            className="hidden-color-input"
          />
        </label>
        <button
          onClick={toggleDrawingMode}
          title="Draw Mode"
          aria-pressed={isDrawing}
          className={`toolbar-button ${isDrawing ? "active" : ""}`}
        >
          <FaPencilAlt />
        </button>
      </div>

      <div className="toolbar-divider" />

      {/* Group 5: Typography Selection */}
      <div className="toolbar-group">
        <select
          value={currentFont}
          onChange={changeFontFamily}
          className="font-select-dropdown"
          aria-label="Font family"
        >
          {availableFonts.map((fontName) => (
            <option
              key={fontName}
              value={fontName}
              style={{ fontFamily: fontName }}
            >
              {fontName}
            </option>
          ))}
        </select>

        <div className="font-size-control" title="Font Size">
          <button
            type="button"
            className="font-size-btn"
            onClick={decreaseFontSize}
            disabled={currentFontSize <= MIN_FONT_SIZE}
            title="Decrease Font Size"
            aria-label="Decrease font size"
          >
            <FaMinus />
          </button>
          <input
            type="text"
            inputMode="numeric"
            className="font-size-input"
            value={fontSizeInput}
            onChange={handleFontSizeInputChange}
            onBlur={commitFontSizeInput}
            onKeyDown={handleFontSizeKeyDown}
            aria-label="Font size"
          />
          <button
            type="button"
            className="font-size-btn"
            onClick={increaseFontSize}
            disabled={currentFontSize >= MAX_FONT_SIZE}
            title="Increase Font Size"
            aria-label="Increase font size"
          >
            <FaPlus />
          </button>
        </div>

        <button className="toolbar-button" onClick={addCreativeText} title="Add Custom Text">
          <FaFont />
        </button>

        <button
          type="button"
          className={`toolbar-button ${format.bold ? "active" : ""}`}
          onClick={toggleBold}
          aria-pressed={format.bold}
          title={format.bold ? "Bold: On" : "Bold: Off"}
        >
          <FaBold />
        </button>
        <button
          type="button"
          className={`toolbar-button ${format.italic ? "active" : ""}`}
          onClick={toggleItalic}
          aria-pressed={format.italic}
          title={format.italic ? "Italic: On" : "Italic: Off"}
        >
          <FaItalic />
        </button>
      </div>

      <div className="toolbar-divider" />

      {/* Group 6: Arrangement & Layer Modifiers */}
      <div className="toolbar-group">
        <button className="toolbar-button" onClick={centerObject} title="Center Object">
          <FaAlignCenter />
        </button>
        <button className="toolbar-button" onClick={duplicate} title="Clone Object">
          <FaCopy />
        </button>
        <button className="toolbar-button" onClick={bringForward} title="Move Layer Up">
          <FaArrowUp />
        </button>
        <button className="toolbar-button" onClick={sendBackward} title="Move Layer Down">
          <FaArrowDown />
        </button>
      </div>

      <div className="toolbar-divider" />

      {/* Group 7: Navigation Zoom Triggers */}
      <div className="toolbar-group">
        <button className="toolbar-button" onClick={() => canvas.setZoom(canvas.getZoom() + 0.1)} title="Zoom In">
          <FaSearchPlus />
        </button>
        <button className="toolbar-button" onClick={() => canvas.setZoom(Math.max(0.2, canvas.getZoom() - 0.1))} title="Zoom Out">
          <FaSearchMinus />
        </button>
      </div>

      <div className="spacer" />

      {/* Group 8: Destructive System Actions */}
      <div className="toolbar-group">
        <button className="toolbar-button btn-eraser" onClick={clearCanvas} title="Reset Workspace Canvas">
          <FaEraser />
        </button>
        <button className="toolbar-button btn-trash" onClick={() => {
          const obj = canvas.getActiveObject();
          if (obj) { canvas.remove(obj); canvas.renderAll(); setFormat(EMPTY_FORMAT); }
        }} title="Delete Object">
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default CanvasToolbar;

// import React, { useState, useEffect } from "react";
// import {
//   FaFont,
//   FaSearchPlus,
//   FaSearchMinus,
//   FaCopy,
//   FaArrowUp,
//   FaArrowDown,
//   FaTrash,
//   FaUndo,
//   FaRedo,
//   FaPalette,
//   FaPencilAlt,
//   FaBold,
//   FaItalic,
//   FaAlignCenter,
//   FaEraser,
//   FaAlignLeft,
//   FaAlignRight,
// } from "react-icons/fa";
// import {
//   MdVerticalAlignTop,
//   MdVerticalAlignCenter,
//   MdVerticalAlignBottom,
// } from "react-icons/md";
// import { fabric } from "fabric";
// import { useCanvas } from "../../../context/CanvasContext";
// import "../../../css/CanvasToolbar.css";

// // Insert your Google Fonts Developer API Key here to pull hundreds of live fonts!
// const GOOGLE_FONTS_API_KEY = "YOUR_GOOGLE_FONTS_API_KEY_HERE";

// // Standard local system fonts (like Microsoft Word) to use as an instant fallback
// const WORD_FALLBACK_FONTS = [
//   "Arial", "Arial Black", "Calibri", "Cambria", "Candara", "Comic Sans MS", 
//   "Consolas", "Courier New", "Georgia", "Impact", "Lucida Console", 
//   "Lucida Sans Unicode", "Segoe UI", "Tahoma", "Times New Roman", 
//   "Trebuchet MS", "Verdana", "Garamond", "Bookman Old Style", "Century Gothic"
// ];

// const CanvasToolbar = () => {
//   const {
//     canvas,
//     past,
//     future,
//     setPast,
//     setFuture,
//     saveState,
//   } = useCanvas();

//   const [currentColor, setCurrentColor] = useState("#4F46E5");
//   const [currentFont, setCurrentFont] = useState("Arial");
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [availableFonts, setAvailableFonts] = useState(WORD_FALLBACK_FONTS);

//   const pastHistory = past || [];
//   const futureHistory = future || [];

//   // 1. Load system fonts instantly, then attempt to fetch the complete Google Fonts catalog
//   useEffect(() => {
//     if (!GOOGLE_FONTS_API_KEY || GOOGLE_FONTS_API_KEY.includes("YOUR_GOOGLE_FONTS_API_KEY")) {
//       console.warn("Using local Word fallback fonts. Add a Google Fonts API key to fetch 1,000+ choices.");
//       return;
//     }

//     fetch(`https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=${GOOGLE_FONTS_API_KEY}`)
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.items) {
//           const fetchedFonts = data.items.map((font) => font.family);
//           // Merge local system Word fonts with dynamic Google Fonts cleanly without duplicates
//           const combinedFonts = Array.from(new Set([...WORD_FALLBACK_FONTS, ...fetchedFonts]));
//           setAvailableFonts(combinedFonts);
//         }
//       })
//       .catch((err) => console.error("Failed to load web fonts catalog, staying on fallbacks:", err));
//   }, []);

//   // 2. Sync toolbar states whenever items are selected on the canvas
//   useEffect(() => {
//     if (!canvas) return;

//     const handleSelection = () => {
//       const activeObj = canvas.getActiveObject();
//       if (!activeObj) return;

//       const objColor = activeObj.get("fill") || activeObj.get("stroke");
//       if (typeof objColor === "string" && objColor.startsWith("#")) {
//         setCurrentColor(objColor);
//       }

//       if (isTextObject(activeObj)) {
//         setCurrentFont(activeObj.get("fontFamily") || "Arial");
//       }
//     };

//     canvas.on("selection:created", handleSelection);
//     canvas.on("selection:updated", handleSelection);
//     canvas.on("selection:cleared", () => setCurrentFont("Arial"));

//     return () => {
//       canvas.off("selection:created", handleSelection);
//       canvas.off("selection:updated", handleSelection);
//     };
//   }, [canvas]);

//   if (!canvas) return null;

//   // Helper check for flexible Fabric text node tracking
//   const isTextObject = (obj) => {
//     if (!obj) return false;
//     return ["i-text", "textbox", "text"].includes(obj.type);
//   };

//   // 3. Dynamic Font Engine: Updates standard system layout styles OR fetches missing Google fonts into document head
//   const changeFontFamily = async (e) => {
//     const selectedFont = e.target.value;
//     setCurrentFont(selectedFont);

//     const activeObj = canvas.getActiveObject();
//     if (!activeObj) return;

//     if (!isTextObject(activeObj)) return;

//     // Check if it's a web font vs basic local system layout font
//     if (!WORD_FALLBACK_FONTS.includes(selectedFont)) {
//       const fontId = `dynamic-font-${selectedFont.replace(/\s+/g, "-").toLowerCase()}`;
//       if (!document.getElementById(fontId)) {
//         const link = document.createElement("link");
//         link.id = fontId;
//         link.rel = "stylesheet";
//         link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(selectedFont)}&display=swap`;
//         document.head.appendChild(link);
//       }
      
//       try {
//         await document.fonts.load(`28px "${selectedFont}"`);
//       } catch (error) {
//         console.error("Font payload download skipped/timed out:", error);
//       }
//     }

//     activeObj.set({
//       fontFamily: selectedFont,
//       dirty: true,
//     });
//     activeObj.setCoords();
//     canvas.requestRenderAll();
//     saveState(canvas);
//   };

//   // ---------------- Undo/Redo Engine ----------------
//   const undo = () => {
//     if (pastHistory.length === 0) return;
//     const previousState = pastHistory[pastHistory.length - 1];
//     const currentState = JSON.stringify(canvas.toJSON());

//     setPast((prev) => prev.slice(0, -1));
//     setFuture((prev) => [currentState, ...prev]);

//     canvas.off("object:added");
//     canvas.off("object:modified");
//     canvas.off("object:removed");

//     canvas.loadFromJSON(previousState, () => {
//       canvas.renderAll();
//       canvas.on("object:added", () => saveState());
//       canvas.on("object:modified", () => saveState());
//       canvas.on("object:removed", () => saveState());
//     });
//   };

//   const redo = () => {
//     if (futureHistory.length === 0) return;
//     const nextState = futureHistory[0];
//     const currentState = JSON.stringify(canvas.toJSON());

//     setFuture((prev) => prev.slice(1));
//     setPast((prev) => [...prev, currentState]);

//     canvas.off("object:added");
//     canvas.off("object:modified");
//     canvas.off("object:removed");

//     canvas.loadFromJSON(nextState, () => {
//       canvas.renderAll();
//       canvas.on("object:added", () => saveState());
//       canvas.on("object:modified", () => saveState());
//       canvas.on("object:removed", () => saveState());
//     });
//   };

//   // ---------------- Object and Brush Modifiers ----------------
//   const changeColor = (e) => {
//     const newColor = e.target.value;
//     setCurrentColor(newColor);

//     const activeObj = canvas.getActiveObject();
//     if (!activeObj) {
//       if (canvas.isDrawingMode && canvas.freeDrawingBrush) {
//         canvas.freeDrawingBrush.color = newColor;
//       }
//       return;
//     }

//     if (activeObj.type === "activeSelection") {
//       activeObj.forEachObject((obj) => {
//         if (obj.type === "path") obj.set("stroke", newColor);
//         else obj.set("fill", newColor);
//       });
//     } else {
//       if (activeObj.type === "path") activeObj.set("stroke", newColor);
//       else activeObj.set("fill", newColor);
//     }
//     canvas.renderAll();
//   };

//   const handleColorPickerBlur = () => saveState(canvas);

//   const toggleDrawingMode = () => {
//     const updatedDrawingState = !isDrawing;
//     setIsDrawing(updatedDrawingState);
//     canvas.isDrawingMode = updatedDrawingState;

//     if (updatedDrawingState) {
//       canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
//       canvas.freeDrawingBrush.width = 6;
//       canvas.freeDrawingBrush.color = currentColor;
//     }
//     canvas.discardActiveObject().renderAll();
//   };

//   const addCreativeText = () => {
//     const text = new fabric.Textbox("Type Here...", {
//       left: 50,
//       top: 150,
//       width: canvas.getWidth() - 100,
//       fontSize: 28,
//       fontFamily: currentFont,
//       fontWeight: "600",
//       textAlign: "center",
//       splitByGrapheme: false,
//     });

//     canvas.add(text);
//     canvas.setActiveObject(text);
//     text.enterEditing();
//     if (text.hiddenTextarea) text.hiddenTextarea.focus();

//     canvas.renderAll();
//     saveState(canvas);
//   };

//   const toggleBold = () => {
//     const activeObj = canvas.getActiveObject();
//     if (!isTextObject(activeObj)) return;

//     const isBold = activeObj.get("fontWeight") === "bold";
//     activeObj.set("fontWeight", isBold ? "normal" : "bold");
//     canvas.renderAll();
//     saveState(canvas);
//   };

//   const toggleItalic = () => {
//     const activeObj = canvas.getActiveObject();
//     if (!isTextObject(activeObj)) return;

//     const isItalic = activeObj.get("fontStyle") === "italic";
//     activeObj.set("fontStyle", isItalic ? "normal" : "italic");
//     canvas.renderAll();
//     saveState(canvas);
//   };

//   const centerObject = () => {
//     const activeObj = canvas.getActiveObject();
//     if (!activeObj) return;
//     canvas.centerObject(activeObj);
//     activeObj.setCoords();
//     canvas.renderAll();
//     saveState(canvas);
//   };

//   const clearCanvas = () => {
//     if (window.confirm("Are you sure you want to clear your structural canvas design?")) {
//       canvas.clear();
//       canvas.backgroundColor = "#ffffff";
//       canvas.renderAll();
//       saveState(canvas);
//     }
//   };

//   const duplicate = () => {
//     const obj = canvas.getActiveObject();
//     if (!obj) return;
//     obj.clone((clone) => {
//       clone.set({ left: obj.left + 20, top: obj.top + 20 });
//       canvas.add(clone);
//       canvas.setActiveObject(clone);
//       canvas.renderAll();
//     });
//   };

//   const bringForward = () => {
//     const obj = canvas.getActiveObject();
//     if (obj) { canvas.bringForward(obj); canvas.renderAll(); }
//   };

//   const sendBackward = () => {
//     const obj = canvas.getActiveObject();
//     if (obj) { canvas.sendBackwards(obj); canvas.renderAll(); }
//   };

//   const alignHorizontalText = (alignment) => {
//     const obj = canvas.getActiveObject();
//     if (!isTextObject(obj)) return;
//     obj.set("textAlign", alignment);
//     canvas.requestRenderAll();
//     saveState(canvas);
//   };

//   const alignTop = () => {
//     const obj = canvas.getActiveObject();
//     if (!obj) return;
//     obj.set({ top: 0, originY: "top" });
//     obj.setCoords();
//     canvas.renderAll();
//     saveState(canvas);
//   };

//   const alignMiddle = () => {
//     const obj = canvas.getActiveObject();
//     if (!obj) return;
//     obj.set({ top: canvas.getHeight() / 2, originY: "center" });
//     obj.setCoords();
//     canvas.renderAll();
//     saveState(canvas);
//   };

//   const alignBottom = () => {
//     const obj = canvas.getActiveObject();
//     if (!obj) return;
//     obj.set({ top: canvas.getHeight(), originY: "bottom" });
//     obj.setCoords();
//     canvas.renderAll();
//     saveState(canvas);
//   };

//   return (
//     <div className="toolbar-container">
//       {/* Group 1: Undo/Redo Controls */}
//       <div className="toolbar-group">
//         <button className="toolbar-button" onClick={undo} disabled={pastHistory.length === 0} title="Undo">
//           <FaUndo style={{ opacity: pastHistory.length === 0 ? 0.35 : 1 }} />
//         </button>
//         <button className="toolbar-button" onClick={redo} disabled={futureHistory.length === 0} title="Redo">
//           <FaRedo style={{ opacity: futureHistory.length === 0 ? 0.35 : 1 }} />
//         </button>
//       </div>

//       <div className="toolbar-divider" />

//       {/* Group 2: Horizontal Text Alignment */}
//       <div className="toolbar-group">
//         <button className="toolbar-button" onClick={() => alignHorizontalText("left")} title="Align Left">
//           <FaAlignLeft />
//         </button>
//         <button className="toolbar-button" onClick={() => alignHorizontalText("center")} title="Align Center">
//           <FaAlignCenter />
//         </button>
//         <button className="toolbar-button" onClick={() => alignHorizontalText("right")} title="Align Right">
//           <FaAlignRight />
//         </button>
//       </div>

//       <div className="toolbar-divider" />

//       {/* Group 3: Vertical Alignment */}
//       <div className="toolbar-group">
//         <button className="toolbar-button" onClick={alignTop} title="Align Top">
//           <MdVerticalAlignTop />
//         </button>
//         <button className="toolbar-button" onClick={alignMiddle} title="Align Middle">
//           <MdVerticalAlignCenter />
//         </button>
//         <button className="toolbar-button" onClick={alignBottom} title="Align Bottom">
//           <MdVerticalAlignBottom />
//         </button>
//       </div>

//       <div className="toolbar-divider" />

//       {/* Group 4: Color & Drawing Mode */}
//       <div className="toolbar-group">
//         <label title="Color Palette" className="color-label" style={{ backgroundColor: currentColor }}>
//           <FaPalette style={{ color: "#fff", mixBlendMode: "difference" }} />
//           <input
//             type="color"
//             value={currentColor}
//             onChange={changeColor}
//             onBlur={handleColorPickerBlur}
//             className="hidden-color-input"
//           />
//         </label>
//         <button
//           onClick={toggleDrawingMode}
//           title="Draw Mode"
//           className={`toolbar-button ${isDrawing ? "active" : ""}`}
//         >
//           <FaPencilAlt />
//         </button>
//       </div>

//       <div className="toolbar-divider" />

//       {/* Group 5: Typography Selection */}
//       <div className="toolbar-group">
//         <select
//           value={currentFont}
//           onChange={changeFontFamily}
//           className="font-select-dropdown"
//           style={{ maxWidth: "160px", padding: "4px" }}
//         >
//           {availableFonts.map((fontName) => (
//             <option
//               key={fontName}
//               value={fontName}
//               style={{ fontFamily: fontName }}
//             >
//               {fontName}
//             </option>
//           ))}
//         </select>
//         <button className="toolbar-button" onClick={addCreativeText} title="Add Custom Text">
//           <FaFont />
//         </button>
//         <button className="toolbar-button" onClick={toggleBold} title="Make Bold">
//           <FaBold />
//         </button>
//         <button className="toolbar-button" onClick={toggleItalic} title="Make Italic">
//           <FaItalic />
//         </button>
//       </div>

//       <div className="toolbar-divider" />

//       {/* Group 6: Arrangement & Layer Modifiers */}
//       <div className="toolbar-group">
//         <button className="toolbar-button" onClick={centerObject} title="Center Object">
//           <FaAlignCenter />
//         </button>
//         <button className="toolbar-button" onClick={duplicate} title="Clone Object">
//           <FaCopy />
//         </button>
//         <button className="toolbar-button" onClick={bringForward} title="Move Layer Up">
//           <FaArrowUp />
//         </button>
//         <button className="toolbar-button" onClick={sendBackward} title="Move Layer Down">
//           <FaArrowDown />
//         </button>
//       </div>

//       <div className="toolbar-divider" />

//       {/* Group 7: Navigation Zoom Triggers */}
//       <div className="toolbar-group">
//         <button className="toolbar-button" onClick={() => canvas.setZoom(canvas.getZoom() + 0.1)} title="Zoom In">
//           <FaSearchPlus />
//         </button>
//         <button className="toolbar-button" onClick={() => canvas.setZoom(Math.max(0.2, canvas.getZoom() - 0.1))} title="Zoom Out">
//           <FaSearchMinus />
//         </button>
//       </div>

//       <div className="spacer" />

//       {/* Group 8: Destructive System Actions */}
//       <div className="toolbar-group">
//         <button className="toolbar-button btn-eraser" onClick={clearCanvas} title="Reset Workspace Canvas">
//           <FaEraser />
//         </button>
//         <button className="toolbar-button btn-trash" onClick={() => {
//           const obj = canvas.getActiveObject();
//           if (obj) { canvas.remove(obj); canvas.renderAll(); }
//         }} title="Delete Object">
//           <FaTrash />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CanvasToolbar;