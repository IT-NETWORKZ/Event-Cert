import React, { useState } from "react";
import { fabric } from "fabric";
import { useCanvas } from "../../../context/CanvasContext";
import SidebarGallery from "./SidebarGallery";

// --- OPTIMIZATION: HELPER TO GENERATE UNIQUE public CDN ASSETS PROGRAMMATICALLY ---
const generatePlaceholders = (startId, count) =>
    Array.from({ length: count }, (_, i) => `https://picsum.photos/id/${startId + i}/600/800`);

const greetingCategories = [
    {
        id: "anniversary",
        title: "Anniversary",
        icon: "💝",
        images: [
            "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&auto=format&fit=crop&q=80",
            ...generatePlaceholders(1020, 10) // Generates 10 high-quality unique image URLs dynamically
        ],
    },
    {
        id: "thankyou",
        title: "Thank You",
        icon: "🙏",
        images: [
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
            ...generatePlaceholders(1040, 10)
        ],
    },
    {
        id: "congrats",
        title: "Congratulations",
        icon: "🎉",
        images: [
            "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop&q=80",
            ...generatePlaceholders(1050, 10)
        ],
    },
    {
        id: "getwell",
        title: "Get Well Soon",
        icon: "🌻",
        images: [
            "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1505784045224-1247b2b29cf3?w=600&auto=format&fit=crop&q=80",
            ...generatePlaceholders(1070, 10)
        ],
    },
];

// --- OPTIMIZATION: IMMUTABLE PRE-DEFINED LAYOUT PROFILES ---
const RANDOM_CANVAS_SIZES = [
    { width: 450, height: 450 }, // Square Format
    { width: 400, height: 600 }, // Classic Tall Panel
    { width: 500, height: 350 }, // Landscape Fold
    { width: 420, height: 580 }  // Standard Greeting Frame
];

const GreetingLibrary = ({ isOpen, onClose }) => {
    const { canvas, setCanvasSize } = useCanvas();
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleSelectGreeting = (imgUrl) => {
        if (!canvas) return;

        // Pick a random dimensions profile
        const targetSize = RANDOM_CANVAS_SIZES[Math.floor(Math.random() * RANDOM_CANVAS_SIZES.length)];

        // Sync context state layout dimensions 
        setCanvasSize({ width: targetSize.width, height: targetSize.height });

        // Mount image to Fabric environment instance
        fabric.Image.fromURL(
            imgUrl,
            (img) => {
                img.set({
                    left: 0,
                    top: 0,
                    scaleX: targetSize.width / img.width,
                    scaleY: targetSize.height / img.height,
                    selectable: true,
                    hasControls: true,
                    hasBorders: true,

                    // Shared tracking configurations across toolbar utilities
                    isInvitationImage: true,
                    originalWidth: img.width,
                    originalHeight: img.height,
                });

                canvas.add(img);
                canvas.setActiveObject(img);
                canvas.requestRenderAll();

                handleClose();
            },
            { crossOrigin: "anonymous" }
        );
    };

    const handleClose = () => {
        setSelectedCategory(null);
        onClose();
    };

    return (
        <SidebarGallery
            isOpen={isOpen}
            onClose={handleClose}
            title={selectedCategory ? selectedCategory.title : "Greeting Templates"}
            showCategories={!selectedCategory}
            categories={greetingCategories}
            images={selectedCategory ? selectedCategory.images : []}
            onCategoryClick={setSelectedCategory}
            onBack={() => setSelectedCategory(null)}
            onSelect={handleSelectGreeting}
        />
    );
};

export default GreetingLibrary;