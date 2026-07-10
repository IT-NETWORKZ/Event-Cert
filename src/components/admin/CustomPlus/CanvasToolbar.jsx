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
  FaEraser
} from "react-icons/fa";
import { fabric } from "fabric";
import { useCanvas } from "../../../context/CanvasContext";
import "../../../css/CanvasToolbar.css"; 

// Paste your actual active Google API key here

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
          // Takes the top 120 most popular fonts for a lightweight MS Word setup
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

  // Create Google Font stylesheet link
  const fontId = `dynamic-font-${selectedFont
    .replace(/\s+/g, "-")
    .toLowerCase()}`;

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
    // Wait until font is actually loaded
    await document.fonts.load(`28px "${selectedFont}"`);

    // Apply font to selected Fabric text
    activeObj.set({
      fontFamily: selectedFont,
      dirty: true,
    });

    activeObj.setCoords();

    canvas.requestRenderAll();

    saveState(canvas);

    console.log("Font changed successfully:", selectedFont);
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
    <div className="toolbar-container">
      {/* Undo/Redo Controls */}
      <button className="toolbar-button" onClick={undo} disabled={pastHistory.length === 0} title="Undo">
        <FaUndo style={{ opacity: pastHistory.length === 0 ? 0.4 : 1 }} />
      </button>
      <button className="toolbar-button" onClick={redo} disabled={futureHistory.length === 0} title="Redo">
        <FaRedo style={{ opacity: futureHistory.length === 0 ? 0.4 : 1 }} />
      </button>

      <div className="toolbar-divider" />

      {/* Color Swatch Panel */}
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

      {/* Brush Pencil Feature */}
      <button
        onClick={toggleDrawingMode}
        title="Draw Mode"
        className={`toolbar-button ${isDrawing ? "active" : ""}`}
      >
        <FaPencilAlt />
      </button>

      <div className="toolbar-divider" />
      
      {/* MS Word Automated Typography Menu */}
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

      {/* Rich Text Node Settings */}
      <button className="toolbar-button" onClick={addCreativeText} title="Add Custom Text"><FaFont /></button>
      <button className="toolbar-button" onClick={toggleBold} title="Make Bold"><FaBold /></button>
      <button className="toolbar-button" onClick={toggleItalic} title="Make Italic"><FaItalic /></button>

      <div className="toolbar-divider" />

      {/* Formatting & Layout Layout Engine Actions */}
      <button className="toolbar-button" onClick={centerObject} title="Center Layout Alignment"><FaAlignCenter /></button>
      <button className="toolbar-button" onClick={duplicate} title="Clone Object"><FaCopy /></button>
      <button className="toolbar-button" onClick={bringForward} title="Move Layer Up"><FaArrowUp /></button>
      <button className="toolbar-button" onClick={sendBackward} title="Move Layer Down"><FaArrowDown /></button>

      <div className="toolbar-divider" />

      {/* Navigation Viewport Scale Triggers */}
      <button className="toolbar-button" onClick={() => canvas.setZoom(canvas.getZoom() + 0.1)} title="Zoom In"><FaSearchPlus /></button>
      <button className="toolbar-button" onClick={() => canvas.setZoom(Math.max(0.2, canvas.getZoom() - 0.1))} title="Zoom Out"><FaSearchMinus /></button>

      <div className="spacer" />

      {/* Destructive Maintenance Actions */}
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
  );
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