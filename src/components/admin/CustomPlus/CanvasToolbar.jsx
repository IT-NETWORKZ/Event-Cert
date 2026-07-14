import React, { useRef, useState, useEffect } from "react";
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
} from "react-icons/fa";
import {
  MdVerticalAlignTop,
  MdVerticalAlignCenter,
  MdVerticalAlignBottom,
} from "react-icons/md";
import { fabric } from "fabric";
import { useCanvas } from "../../../context/CanvasContext";
import "../../../css/CanvasToolbar.css";

// create company secret key
const GOOGLE_FONTS_API_KEY = "";

const CanvasToolbar = () => {
  const {
    canvas,
    past,
    future,
    setPast,
    setFuture,
    saveState,
  } = useCanvas();

  const [currentColor, setCurrentColor] = useState("#4F46E5");
  const [currentFont, setCurrentFont] = useState("Roboto");
  const [isDrawing, setIsDrawing] = useState(false);
  const [availableFonts, setAvailableFonts] = useState([]);

  const pastHistory = past || [];
  const futureHistory = future || [];

  // 1. Automatically fetch the live popular fonts list using your API key
  useEffect(() => {
    const fetchGoogleFonts = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=${GOOGLE_FONTS_API_KEY}`
        );
        const data = await response.json();

        if (data.items) {
          // Takes the top 120 most popular fonts for a lightweight setup
          setAvailableFonts(data.items.slice(0, 120));
        }
      } catch (err) {
        console.error("Error fetching Google Fonts:", err);
        // Robust UI layout fallback if your API key isn't verified yet
        setAvailableFonts([
          { family: "Roboto" },
          { family: "Open Sans" },
          { family: "Lato" },
          { family: "Montserrat" },
          { family: "Arial" }
        ]);
      }
    };

    if (GOOGLE_FONTS_API_KEY && GOOGLE_FONTS_API_KEY !== "YOUR_GOOGLE_FONTS_API_KEY_HERE") {
      fetchGoogleFonts();
    } else {
      setAvailableFonts([
        { family: "Roboto" }, { family: "Open Sans" }, { family: "Lato" }, { family: "Arial" }
      ]);
    }
  }, []);

  // 2. Read canvas selections to auto-update toolbar states
  useEffect(() => {
    if (!canvas) return;

    const handleSelection = () => {
      const activeObj = canvas.getActiveObject();
      if (!activeObj) return;

      const objColor = activeObj.get("fill") || activeObj.get("stroke");
      if (typeof objColor === "string" && objColor.startsWith("#")) {
        setCurrentColor(objColor);
      }

      if (activeObj.type === "i-text") {
        setCurrentFont(activeObj.get("fontFamily"));
      }
    };

    canvas.on("selection:created", handleSelection);
    canvas.on("selection:updated", handleSelection);
    canvas.on("selection:cleared", () => setCurrentFont("Roboto"));

    return () => {
      canvas.off("selection:created", handleSelection);
      canvas.off("selection:updated", handleSelection);
    };
  }, [canvas]);

  if (!canvas) return null;

  // 3. Dynamic Font Head Injector & Canvas Re-renderer
  const changeFontFamily = async (e) => {
    const selectedFont = e.target.value;
    setCurrentFont(selectedFont);

    const activeObj = canvas.getActiveObject();
    if (!activeObj) {
      console.log("Please select a text object first");
      return;
    }

    const isTextObject =
      activeObj.type === "i-text" ||
      activeObj.type === "textbox" ||
      activeObj.type === "text";

    if (!isTextObject) {
      console.log("Selected object is not text:", activeObj.type);
      return;
    }

    const fontId = `dynamic-font-${selectedFont.replace(/\s+/g, "-").toLowerCase()}`;

    if (!document.getElementById(fontId)) {
      const link = document.createElement("link");
      link.id = fontId;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
        selectedFont
      )}&display=swap`;
      document.head.appendChild(link);
    }

    try {
      await document.fonts.load(`28px "${selectedFont}"`);
      activeObj.set({
        fontFamily: selectedFont,
        dirty: true,
      });
      activeObj.setCoords();
      canvas.requestRenderAll();
      saveState(canvas);
    } catch (error) {
      console.error("Font loading failed:", error);
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
      if (canvas.isDrawingMode) {
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
    const text = new fabric.Textbox("Type Here...", {
      left: 0,
      top: 150,
      width: canvas.getWidth(), // 100% canvas width
      fontSize: 28,
      fontFamily: currentFont,
      fontWeight: "600",
      textAlign: "center", // or "center"
      splitByGrapheme: false,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    text.enterEditing();
    text.hiddenTextarea?.focus();

    canvas.renderAll();
    saveState(canvas);
  };

  const toggleBold = () => {
    const activeObj = canvas.getActiveObject();
    if (!activeObj || activeObj.type !== "i-text") return;

    const isBold = activeObj.get("fontWeight") === "bold";
    activeObj.set("fontWeight", isBold ? "normal" : "bold");
    canvas.renderAll();
    saveState(canvas);
  };

  const toggleItalic = () => {
    const activeObj = canvas.getActiveObject();
    if (!activeObj || activeObj.type !== "i-text") return;

    const isItalic = activeObj.get("fontStyle") === "italic";
    activeObj.set("fontStyle", isItalic ? "normal" : "italic");
    canvas.renderAll();
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

  const alignTextLeft = () => {
    const obj = canvas.getActiveObject();
    if (!obj || obj.type !== "textbox") return;
    obj.set("textAlign", "left");
    canvas.requestRenderAll();
    saveState(canvas);
  };

  const alignTextCenter = () => {
    const obj = canvas.getActiveObject();
    if (!obj || obj.type !== "textbox") return;
    obj.set("textAlign", "center");
    canvas.requestRenderAll();
    saveState(canvas);
  };

  const alignTextRight = () => {
    const obj = canvas.getActiveObject();
    if (!obj || obj.type !== "textbox") return;
    obj.set("textAlign", "right");
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
    <div className="toolbar-container">
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
        <button className="toolbar-button" onClick={alignTextLeft} title="Align Left">
          <FaAlignLeft />
        </button>
        <button className="toolbar-button" onClick={alignTextCenter} title="Align Center">
          <FaAlignCenter />
        </button>
        <button className="toolbar-button" onClick={alignTextRight} title="Align Right">
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
          title="Font Family"
          className="select-dropdown"
        >
          {availableFonts.map((font) => (
            <option key={font.family} value={font.family}>
              {font.family}
            </option>
          ))}
        </select>
        <button className="toolbar-button" onClick={addCreativeText} title="Add Custom Text">
          <FaFont />
        </button>
        <button className="toolbar-button" onClick={toggleBold} title="Make Bold">
          <FaBold />
        </button>
        <button className="toolbar-button" onClick={toggleItalic} title="Make Italic">
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
          if (obj) { canvas.remove(obj); canvas.renderAll(); }
        }} title="Delete Object">
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default CanvasToolbar;