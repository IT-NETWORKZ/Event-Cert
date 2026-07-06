import React, { createContext, useContext, useState, useCallback } from "react";

const CanvasContext = createContext();

export const CanvasProvider = ({ children }) => {
  // Fabric Canvas Instance
  const [canvas, setCanvas] = useState(null);

  // Undo/Redo History Stacks
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);

  // Canvas Size
  const [canvasSize, setCanvasSize] = useState({
    width: 600,
    height: 600,
  });

  // Pages
  const [pages, setPages] = useState([
    {
      id: 1,
      json: null,
      name: "Page 1",
    },
  ]);

  // Active Page
  const [activePage, setActivePage] = useState(1);

  // Zoom
  const [zoom, setZoom] = useState(1);

  // Clipboard
  const [clipboard, setClipboard] = useState(null);

  // Helper to capture a snapshot of the current canvas state
  const saveState = useCallback((canvasInstance) => {
    const activeCanvas = canvasInstance || canvas;
    if (!activeCanvas) return;

    const currentJson = JSON.stringify(activeCanvas.toJSON());
    
    setPast((prevPast) => {
      // Avoid pushing duplicate consecutive snapshots
      if (prevPast.length > 0 && prevPast[prevPast.length - 1] === currentJson) {
        return prevPast;
      }
      return [...prevPast, currentJson];
    });
    
    // Any new action clears the forward redo history
    setFuture([]);
  }, [canvas]);

  return (
    <CanvasContext.Provider
      value={{
        // Fabric
        canvas,
        setCanvas,

        // History Management
        past,
        setPast,
        future,
        setFuture,
        saveState,

        // Canvas Size
        canvasSize,
        setCanvasSize,

        // Pages
        pages,
        setPages,
        activePage,
        setActivePage,

        // Zoom
        zoom,
        setZoom,

        // Clipboard
        clipboard,
        setClipboard,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => useContext(CanvasContext);