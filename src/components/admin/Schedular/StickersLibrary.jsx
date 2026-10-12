import React, { useState } from "react";
import { fabric } from "fabric";
import { useCanvas } from "../../../context/CanvasContext";
import SidebarGallery from "./SidebarGallery";

const stickerCategories = [
    {
        id: "emoji",
        title: "Emoji",
        icon: "😀",
        images: [
            "https://picsum.photos/id/201/400/400",
            "https://picsum.photos/id/202/400/400",
            "https://picsum.photos/id/203/400/400",
            "https://picsum.photos/id/204/400/400",
            "https://picsum.photos/id/205/400/400",
            "https://picsum.photos/id/206/400/400",
        ],
    },
    {
        id: "shapes",
        title: "Shapes",
        icon: "⭐",
        images: [
            "https://picsum.photos/id/211/400/400",
            "https://picsum.photos/id/212/400/400",
            "https://picsum.photos/id/213/400/400",
            "https://picsum.photos/id/214/400/400",
        ],
    },
    {
        id: "nature",
        title: "Nature",
        icon: "🌿",
        images: [
            "https://picsum.photos/id/221/400/400",
            "https://picsum.photos/id/222/400/400",
            "https://picsum.photos/id/223/400/400",
            "https://picsum.photos/id/224/400/400",
        ],
    },
];

const StickerLibrary = ({ isOpen, onClose }) => {
    const { canvas } = useCanvas();
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleSelectSticker = (imgUrl) => {
        if (!canvas) return;

        fabric.Image.fromURL(
            imgUrl,
            (img) => {
                img.set({
                    left: 50,
                    top: 50,
                    scaleX: 150 / img.width,
                    scaleY: 150 / img.height,
                    selectable: true,
                    hasControls: true,
                    hasBorders: true,
                    isStickerImage: true,
                    originalWidth: img.width,
                    originalHeight: img.height,
                });

                canvas.add(img);
                canvas.setActiveObject(img);
                canvas.requestRenderAll();

            },
            { crossOrigin: "anonymous" }
        );
    };

    const handleManualClose = () => {
        onClose(); // Triggers standard container window close visibility logic
        
        // Wait for sliding animations to settle before resetting the layout back to main categories
        setTimeout(() => {
            setSelectedCategory(null);
        }, 350);
    };

    return (
        <SidebarGallery
            isOpen={isOpen}
            onClose={handleManualClose}
            onMinimizeRelease={onClose}
            title={selectedCategory ? selectedCategory.title : "Sticker Library"}
            showCategories={!selectedCategory}
            categories={stickerCategories}
            images={selectedCategory ? selectedCategory.images : []}
            onCategoryClick={setSelectedCategory}
            onBack={() => setSelectedCategory(null)}
            onSelect={handleSelectSticker}
            icon={selectedCategory ? selectedCategory.icon : "🖼️"}
            variant="sticker"
        />
    );
};

export default StickerLibrary;