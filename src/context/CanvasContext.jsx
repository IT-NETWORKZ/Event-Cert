import React, { createContext, useContext, useState, useCallback } from "react";

const CanvasContext = createContext();

export const CanvasProvider = ({ children }) => {
  // Fabric Canvas Instance
  const [canvas, setCanvas] = useState(null);

  // Undo/Redo History Stacks
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);

  // Base Fallback Sizing
  const [canvasSize, setCanvasSize] = useState({ width: 900, height: 900 });

  // Each page explicitly stores its own design data, unique dimensions, and thumbnails
  const [pages, setPages] = useState([
    {
      id: 1,
      json: null,
      width: 900,
      height: 900,
      thumbnail: "" 
    },
  ]);

  const [activePage, setActivePage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [clipboard, setClipboard] = useState(null);

  // Core Helper: Synchronizes current active canvas properties down to the corresponding page index
  const saveCurrentPageData = useCallback(() => {
    if (!canvas) return null;

    const currentJson = canvas.toJSON();
    const currentWidth = canvas.getWidth();
    const currentHeight = canvas.getHeight();
    const currentThumbnail = canvas.toDataURL({ format: 'png', quality: 2 });

    setPages((prevPages) =>
      prevPages.map((p) => {
        if (p.id === activePage) {
          return {
            ...p,
            json: currentJson,
            width: currentWidth,
            height: currentHeight,
            thumbnail: currentThumbnail
          };
        }
        return p;
      })
    );

    // Returning data directly bypasses state-batching delays in synchronous UI handlers
    return { currentJson, currentWidth, currentHeight, currentThumbnail };
  }, [canvas, activePage]);

  const saveState = useCallback((canvasInstance) => {
    const activeCanvas = canvasInstance || canvas;
    if (!activeCanvas) return;

    const currentJson = JSON.stringify(activeCanvas.toJSON());
    setPast((prevPast) => {
      if (prevPast.length > 0 && prevPast[prevPast.length - 1] === currentJson) {
        return prevPast;
      }
      return [...prevPast, currentJson];
    });
    setFuture([]);
  }, [canvas]);

  return (
    <CanvasContext.Provider
      value={{
        canvas, setCanvas,
        past, setPast,
        future, setFuture,
        saveState,
        canvasSize, setCanvasSize,
        pages, setPages,
        activePage, setActivePage,
        saveCurrentPageData, 
        zoom, setZoom,
        clipboard, setClipboard,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => useContext(CanvasContext);

