import React from "react";
import { fabric } from "fabric";
import SidebarGallery from "./SidebarGallery";
import { useCanvas } from "../../../context/CanvasContext";

const stickerImages = [
  "https://picsum.photos/id/1015/400/400",
  "https://picsum.photos/id/1016/400/400",
  "https://picsum.photos/id/1018/400/400",
  "https://picsum.photos/id/1020/400/400",
  "https://picsum.photos/id/1024/400/400",
  "https://picsum.photos/id/1025/400/400",
  "https://picsum.photos/id/1031/400/400",
  "https://picsum.photos/id/1035/400/400",
  "https://picsum.photos/id/1037/400/400",
  "https://picsum.photos/id/1040/400/400",
  "https://picsum.photos/id/1042/400/400",
  "https://picsum.photos/id/1043/400/400",
  "https://picsum.photos/id/1050/400/400",
  "https://picsum.photos/id/1057/400/400",
  "https://picsum.photos/id/1062/400/400",
  "https://picsum.photos/id/1069/400/400",
];

const StickerLibrary = ({ isOpen, onClose }) => {
  // Grab standard canvas reference from your custom global canvas hook context
  const { canvas } = useCanvas(); 

const handleSelectSticker = (imgUrl) => {
  if (!canvas) return;

  fabric.Image.fromURL(imgUrl, (fabricImg) => {
    
    // 👇 CHANGE THIS VALUE TO MAKE IT SMALLER (e.g., 80 or 100)
    fabricImg.scaleToWidth(80); 

    canvas.centerObject(fabricImg);
    canvas.add(fabricImg);
    canvas.setActiveObject(fabricImg);
    canvas.requestRenderAll();
    
    if (onClose) onClose();
  }, { crossOrigin: "anonymous" });
};

  return (
    <SidebarGallery
      isOpen={isOpen}
      onClose={onClose}
      title="Sticker Library"
      images={stickerImages}
      onSelect={handleSelectSticker}
    />
  );
};

export default StickerLibrary;