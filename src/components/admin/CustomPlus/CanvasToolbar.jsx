import React, { useRef, useState, useEffect } from "react";
import {
  FaFont,
  FaImage,
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
  FaCloudDownloadAlt,
  FaEraser,
  FaAdjust
} from "react-icons/fa";
import { fabric } from "fabric";
import { useCanvas } from "../../../context/CanvasContext";

const AVAILABLE_FONTS = [
  { label: "Outfit", value: "Outfit, sans-serif" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Times New Roman", value: "'Times New Roman', serif" },
  { label: "Courier New", value: "'Courier New', monospace" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Impact", value: "Impact, Charcoal, sans-serif" }
];

const CanvasToolbar = () => {
  const fileInputRef = useRef(null);
  const {
    canvas,
    past,
    future,
    setPast,
    setFuture,
    saveState,
  } = useCanvas();

  const [currentColor, setCurrentColor] = useState("#4F46E5");
  const [currentFont, setCurrentFont] = useState("Outfit, sans-serif");
  const [isDrawing, setIsDrawing] = useState(false);

  const pastHistory = past || [];
  const futureHistory = future || [];

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
    canvas.on("selection:cleared", () => setCurrentFont("Outfit, sans-serif"));

    return () => {
      canvas.off("selection:created", handleSelection);
      canvas.off("selection:updated", handleSelection);
    };
  }, [canvas]);

  if (!canvas) return null;

  // ---------------- History Management ----------------
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

  // ---------------- Creative/Editing Enhancements ----------------
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
    const text = new fabric.IText("Type Here...", {
      left: 150,
      top: 150,
      fontSize: 28,
      fill: currentColor,
      fontFamily: currentFont,
      fontWeight: "600",
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    saveState(canvas);
  };

  const changeFontFamily = (e) => {
    const selectedFont = e.target.value;
    setCurrentFont(selectedFont);

    const activeObj = canvas.getActiveObject();
    if (activeObj && activeObj.type === "i-text") {
      activeObj.set("fontFamily", selectedFont);
      canvas.renderAll();
      saveState(canvas);
    }
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

  return (
    <div style={styles.toolbarContainer}>
      {/* History Layout */}
      <button style={styles.button} onClick={undo} disabled={pastHistory.length === 0} title="Undo">
        <FaUndo style={{ opacity: pastHistory.length === 0 ? 0.4 : 1 }} />
      </button>
      <button style={styles.button} onClick={redo} disabled={futureHistory.length === 0} title="Redo">
        <FaRedo style={{ opacity: futureHistory.length === 0 ? 0.4 : 1 }} />
      </button>

      <div style={styles.divider} />

      {/* Dynamic Color Palette Options */}
      <label title="Color Palette" style={{ ...styles.colorLabel, backgroundColor: currentColor }}>
        <FaPalette style={{ color: "#fff", mixBlendMode: "difference" }} />
        <input
          type="color"
          value={currentColor}
          onChange={changeColor}
          onBlur={handleColorPickerBlur}
          style={styles.hiddenColorInput}
        />
      </label>

      {/* Freehand Pencil Brush */}
      <button
        onClick={toggleDrawingMode}
        title="Draw Mode"
        style={{ 
          ...styles.button, 
          backgroundColor: isDrawing ? "#e0f2fe" : "transparent", 
          color: isDrawing ? "#0284c7" : "inherit" 
        }}
      >
        <FaPencilAlt />
      </button>

      <div style={styles.divider} />
      {/* Custom Styled Dropdown Selection Option */}
      <select 
        value={currentFont} 
        onChange={changeFontFamily} 
        title="Font Family"
        style={styles.selectDropdown}
      >
        {AVAILABLE_FONTS.map((font) => (
          <option key={font.value} value={font.value}>
            {font.label}
          </option>
        ))}
      </select>

      {/* Element Adding & Rich Typographic Settings */}
      <button style={styles.button} onClick={addCreativeText} title="Add Custom Text"><FaFont /></button>

      <button style={styles.button} onClick={toggleBold} title="Make Bold"><FaBold /></button>
      <button style={styles.button} onClick={toggleItalic} title="Make Italic"><FaItalic /></button>

      <div style={styles.divider} />

      {/* Advanced Layout Formatting Tweaks */}
      <button style={styles.button} onClick={centerObject} title="Center Layout Alignment"><FaAlignCenter /></button>
      <button style={styles.button} onClick={duplicate} title="Clone Object"><FaCopy /></button>
      <button style={styles.button} onClick={bringForward} title="Move Layer Up"><FaArrowUp /></button>
      <button style={styles.button} onClick={sendBackward} title="Move Layer Down"><FaArrowDown /></button>

      <div style={styles.divider} />

      {/* Global Canvas Navigation Zoom Settings */}
      <button style={styles.button} onClick={() => canvas.setZoom(canvas.getZoom() + 0.1)} title="Zoom In"><FaSearchPlus /></button>
      <button style={styles.button} onClick={() => canvas.setZoom(Math.max(0.2, canvas.getZoom() - 0.1))} title="Zoom Out"><FaSearchMinus /></button>

      <div style={{ marginRight: "auto" }} />

      {/* Destructive Maintenance Operations */}
      <button style={{ ...styles.button, color: "#d97706" }} onClick={clearCanvas} title="Reset Workspace Canvas">
        <FaEraser />
      </button>
      <button style={{ ...styles.button, color: "#ef4444" }} onClick={() => {
        const obj = canvas.getActiveObject();
        if (obj) { canvas.remove(obj); canvas.renderAll(); }
      }} title="Delete Object">
        <FaTrash />
      </button>
    </div>
  );
};

// ---------------- Full Extracted CSS Stylesheet Styles ----------------
const styles = {
  toolbarContainer: {
    display: "flex",
    gap: "6px",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: "6px 12px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    flexWrap: "nowrap", // Forces everything strictly onto a single row line
    overflowX: "auto" // Ensures smooth scrolling if screen goes very small
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    borderRadius: "6px",
    border: "1px solid transparent",
    backgroundColor: "transparent",
    cursor: "pointer",
    color: "#4b5563",
    transition: "all 0.15s ease",
    outline: "none"
  },
  divider: {
    borderLeft: "1px solid #e5e7eb",
    height: "20px",
    margin: "0 4px",
    flexShrink: 0
  },
  colorLabel: {
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center",
    cursor: "pointer", 
    position: "relative", 
    width: "36px", 
    height: "36px",
    borderRadius: "6px", 
    border: "1px solid #d1d5db", 
    transition: "0.2s",
    flexShrink: 0
  },
  hiddenColorInput: {
    position: "absolute", 
    opacity: 0, 
    inset: 0, 
    cursor: "pointer",
    width: "100%",
    height: "100%"
  },
  selectDropdown: {
    padding: "6px 28px 6px 12px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    backgroundColor: "#ffffff",
    outline: "none",
    cursor: "pointer",
    width: "140px",
    minWidth: "130px",
    flexShrink: 0, // Prevents dropdown container from squeezing down or expanding
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236B7280' width='18' height='18'><path d='M7 10l5 5 5-5z'/></svg>")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 8px center",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
  }
};

export default CanvasToolbar;


// import React, { useRef, useState, useEffect } from "react";
// import {
//   FaFont,
//   FaImage,
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
//   FaCloudDownloadAlt,
//   FaEraser,
//   FaAdjust
// } from "react-icons/fa";
// import { fabric } from "fabric";
// import { useCanvas } from "../../../context/CanvasContext";

// const CanvasToolbar = () => {
//   const fileInputRef = useRef(null);
//   const {
//     canvas,
//     past,
//     future,
//     setPast,
//     setFuture,
//     saveState,
//   } = useCanvas();

//   const [currentColor, setCurrentColor] = useState("#4F46E5");
//   const [isDrawing, setIsDrawing] = useState(false);

//   const pastHistory = past || [];
//   const futureHistory = future || [];

//   // Sync toolbar indicators with canvas selections
//   useEffect(() => {
//     if (!canvas) return;

//     const handleSelection = () => {
//       const activeObj = canvas.getActiveObject();
//       if (!activeObj) return;

//       const objColor = activeObj.get("fill") || activeObj.get("stroke");
//       if (typeof objColor === "string" && objColor.startsWith("#")) {
//         setCurrentColor(objColor);
//       }
//     };

//     canvas.on("selection:created", handleSelection);
//     canvas.on("selection:updated", handleSelection);

//     return () => {
//       canvas.off("selection:created", handleSelection);
//       canvas.off("selection:updated", handleSelection);
//     };
//   }, [canvas]);

//   if (!canvas) return null;

//   // ---------------- History Management ----------------
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

//   // ---------------- Creative/Editing Enhancements ----------------
//   const changeColor = (e) => {
//     const newColor = e.target.value;
//     setCurrentColor(newColor);

//     const activeObj = canvas.getActiveObject();
//     if (!activeObj) {
//       // If drawing mode is enabled, map pick directly to line brush color
//       if (canvas.isDrawingMode) {
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
//     const text = new fabric.IText("Type Here...", {
//       left: 150,
//       top: 150,
//       fontSize: 28,
//       fill: currentColor,
//       fontFamily: "Outfit, sans-serif",
//       fontWeight: "600",
//     });
//     canvas.add(text);
//     canvas.setActiveObject(text);
//     canvas.renderAll();
//   };

//   const toggleBold = () => {
//     const activeObj = canvas.getActiveObject();
//     if (!activeObj || activeObj.type !== "i-text") return;

//     const isBold = activeObj.get("fontWeight") === "bold";
//     activeObj.set("fontWeight", isBold ? "normal" : "bold");
//     canvas.renderAll();
//     saveState(canvas);
//   };

//   const toggleItalic = () => {
//     const activeObj = canvas.getActiveObject();
//     if (!activeObj || activeObj.type !== "i-text") return;

//     const isItalic = activeObj.get("fontStyle") === "italic";
//     activeObj.set("fontStyle", isItalic ? "normal" : "italic");
//     canvas.renderAll();
//     saveState(canvas);
//   };

//   const addDropShadow = () => {
//     const activeObj = canvas.getActiveObject();
//     if (!activeObj) return;

//     // Toggle sophisticated default designer shadow properties
//     if (activeObj.shadow) {
//       activeObj.set("shadow", null);
//     } else {
//       activeObj.set("shadow", new fabric.Shadow({
//         color: "rgba(0, 0, 0, 0.25)",
//         blur: 15,
//         offsetX: 8,
//         offsetY: 8
//       }));
//     }
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

//   const uploadImage = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = () => {
//       fabric.Image.fromURL(reader.result, (img) => {
//         img.scaleToWidth(180);
//         img.set({ left: 100, top: 100 });
//         canvas.add(img);
//         canvas.setActiveObject(img);
//         canvas.renderAll();
//       });
//     };
//     reader.readAsDataURL(file);
//   };

//   const clearCanvas = () => {
//     if (window.confirm("Are you sure you want to clear your structural canvas design?")) {
//       canvas.clear();
//       canvas.backgroundColor = "#ffffff";
//       canvas.renderAll();
//       saveState(canvas);
//     }
//   };

//   // ---------------- Export & Standard Hooks ----------------
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

//   return (
//     <div className="cp-toolbar" style={{ display: "flex", gap: "6px", alignItems: "center" }}>
//       {/* History Layout */}
//       <button onClick={undo} disabled={pastHistory.length === 0} title="Undo">
//         <FaUndo style={{ opacity: pastHistory.length === 0 ? 0.4 : 1 }} />
//       </button>
//       <button onClick={redo} disabled={futureHistory.length === 0} title="Redo">
//         <FaRedo style={{ opacity: futureHistory.length === 0 ? 0.4 : 1 }} />
//       </button>

//       <div style={{ borderLeft: "1px solid #eee", height: "24px", margin: "0 4px" }} />

//       {/* Dynamic Color Palette Options */}
//       <label
//         title="Color Palette"
//         style={{
//           display: "flex", alignItems: "center", justifyContent: "center",
//           cursor: "pointer", position: "relative", width: "36px", height: "36px",
//           borderRadius: "8px", border: "1px solid #ddd", backgroundColor: currentColor, transition: "0.2s"
//         }}
//       >
//         <FaPalette style={{ color: "#fff", mixBlendMode: "difference" }} />
//         <input
//           type="color"
//           value={currentColor}
//           onChange={changeColor}
//           onBlur={handleColorPickerBlur}
//           style={{ position: "absolute", opacity: 0, inset: 0, cursor: "pointer" }}
//         />
//       </label>

//       {/* Freehand Pencil Brush */}
//       <button
//         onClick={toggleDrawingMode}
//         title="Draw Mode"
//         style={{ backgroundColor: isDrawing ? "#e0f2fe" : "transparent", color: isDrawing ? "#0284c7" : "inherit" }}
//       >
//         <FaPencilAlt />
//       </button>

//       <div style={{ borderLeft: "1px solid #eee", height: "24px", margin: "0 4px" }} />

//       {/* Element Adding & Rich Typographic Settings */}
//       <button onClick={addCreativeText} title="Add Custom Text"><FaFont /></button>
//       <button onClick={toggleBold} title="Make Bold"><FaBold /></button>
//       <button onClick={toggleItalic} title="Make Italic"><FaItalic /></button>

//       <div style={{ borderLeft: "1px solid #eee", height: "24px", margin: "0 4px" }} />

//       {/* Custom Graphic Media Upload */}
//       {/* <button onClick={() => fileInputRef.current.click()} title="Insert Graphic/Sticker">
//         <FaImage />
//       </button>
//       <input
//         ref={fileInputRef}
//         type="file"
//         hidden
//         accept="image/*"
//         onChange={uploadImage}
//       /> */}

//       {/* Advanced Layout Formatting Tweaks */}
//       {/* <button onClick={addDropShadow} title="Toggle Soft Glow Drop Shadow"><FaAdjust /></button> */}
//       <button onClick={centerObject} title="Center Layout Alignment"><FaAlignCenter /></button>
//       <button onClick={duplicate} title="Clone Object"><FaCopy /></button>
//       <button onClick={bringForward} title="Move Layer Up"><FaArrowUp /></button>
//       <button onClick={sendBackward} title="Move Layer Down"><FaArrowDown /></button>

//       <div style={{ borderLeft: "1px solid #eee", height: "24px", margin: "0 4px" }} />

//       {/* Global Canvas Navigation Zoom Settings */}
//       <button onClick={() => canvas.setZoom(canvas.getZoom() + 0.1)} title="Zoom In"><FaSearchPlus /></button>
//       <button onClick={() => canvas.setZoom(Math.max(0.2, canvas.getZoom() - 0.1))} title="Zoom Out"><FaSearchMinus /></button>

//       <div style={{ marginStyle: "auto" }} />

//       {/* Destructive Maintenance Operations */}
//       <button onClick={clearCanvas} title="Reset Workspace Canvas" style={{ color: "#d97706" }}>
//         <FaEraser />
//       </button>
//       <button className="danger" onClick={() => {
//         const obj = canvas.getActiveObject();
//         if (obj) { canvas.remove(obj); canvas.renderAll(); }
//       }} title="Delete Object">
//         <FaTrash />
//       </button>
//     </div>
//   );
// };

// export default CanvasToolbar; 