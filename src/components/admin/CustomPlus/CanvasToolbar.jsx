import React, { useRef } from "react";
import {
  FaFont,
  FaSquare,
  FaCircle,
  FaPlay,
  FaImage,
  FaSearchPlus,
  FaSearchMinus,
  FaCopy,
  FaArrowUp,
  FaArrowDown,
  FaTrash,
} from "react-icons/fa";
import { fabric } from "fabric";
import { useCanvas } from "../../../context/CanvasContext";

const CanvasToolbar = () => {
  const fileInputRef = useRef(null);
const {

    canvas

} = useCanvas();
  if (!canvas) return null;

  // ---------------- Add Text ----------------

  const addText = () => {
    const text = new fabric.IText("Double Click to Edit", {
      left: 120,
      top: 120,
      fontSize: 32,
      fill: "#000",
      fontFamily: "Arial",
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  // ---------------- Rectangle ----------------

  const addRectangle = () => {
    const rect = new fabric.Rect({
      width: 140,
      height: 80,
      fill: "#4F46E5",
      left: 120,
      top: 150,
      rx: 8,
      ry: 8,
    });

    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
  };

  // ---------------- Circle ----------------

  const addCircle = () => {
    const circle = new fabric.Circle({
      radius: 50,
      fill: "#EF4444",
      left: 150,
      top: 180,
    });

    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.renderAll();
  };

  // ---------------- Triangle ----------------

  const addTriangle = () => {
    const triangle = new fabric.Triangle({
      width: 100,
      height: 100,
      fill: "#10B981",
      left: 180,
      top: 200,
    });

    canvas.add(triangle);
    canvas.setActiveObject(triangle);
    canvas.renderAll();
  };

  // ---------------- Upload Image ----------------

  const uploadImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      fabric.Image.fromURL(reader.result, (img) => {
        img.scaleToWidth(250);

        img.set({
          left: 100,
          top: 100,
        });

        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
      });
    };

    reader.readAsDataURL(file);
  };

  // ---------------- Zoom ----------------

  const zoomIn = () => {
    canvas.setZoom(canvas.getZoom() + 0.1);
  };

  const zoomOut = () => {
    canvas.setZoom(Math.max(0.2, canvas.getZoom() - 0.1));
  };

  // ---------------- Delete ----------------

  const deleteObject = () => {
    const obj = canvas.getActiveObject();

    if (!obj) return;

    canvas.remove(obj);
    canvas.renderAll();
  };

  // ---------------- Duplicate ----------------

  const duplicate = () => {
    const obj = canvas.getActiveObject();

    if (!obj) return;

    obj.clone((clone) => {
      clone.set({
        left: obj.left + 25,
        top: obj.top + 25,
      });

      canvas.add(clone);
      canvas.setActiveObject(clone);
      canvas.renderAll();
    });
  };

  // ---------------- Layer ----------------

  const bringForward = () => {
    const obj = canvas.getActiveObject();

    if (!obj) return;

    canvas.bringForward(obj);
    canvas.renderAll();
  };

  const sendBackward = () => {
    const obj = canvas.getActiveObject();

    if (!obj) return;

    canvas.sendBackwards(obj);
    canvas.renderAll();
  };

  return (
    <div className="cp-toolbar">

      <button onClick={addText}><FaFont /></button>

      <button onClick={addRectangle}><FaSquare /></button>

      <button onClick={addCircle}><FaCircle /></button>

      <button onClick={addTriangle}><FaPlay /></button>

      <button onClick={() => fileInputRef.current.click()}>
        <FaImage />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        hidden
        accept="image/*"
        onChange={uploadImage}
      />

      <button onClick={zoomIn}>
        <FaSearchPlus />
      </button>

      <button onClick={zoomOut}>
        <FaSearchMinus />
      </button>

      <button onClick={duplicate}>
        <FaCopy />
      </button>

      <button onClick={bringForward}>
        <FaArrowUp />
      </button>

      <button onClick={sendBackward}>
        <FaArrowDown />
      </button>

      <button className="danger" onClick={deleteObject}>
        <FaTrash />
      </button>

    </div>
  );
};

export default CanvasToolbar;