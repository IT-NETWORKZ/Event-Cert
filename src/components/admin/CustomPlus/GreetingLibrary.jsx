import React, { useState } from "react";
import { fabric } from "fabric";
import { useCanvas } from "../../../context/CanvasContext";
import SidebarGallery from "./SidebarGallery";
import { GREET_MAX_LIMIT, GREET_PAGE_SIZE, greetingCategories } from "./greetingData";

// Greeting templates come live from https://eventcert.com/demoimg/{id}.png
// (ids per category are listed in greetingData.js)
const GreetingLibrary = ({ isOpen, onClose }) => {
    const { canvas } = useCanvas();
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleSelectGreeting = (imgUrl) => {
        if (!canvas) return;

        fabric.Image.fromURL(
            imgUrl,
            (img, isError) => {
                // picture missing on the server, or the server blocks it (CORS)
                if (isError || !img || !img.width) {
                    console.error("Could not load greeting image:", imgUrl);
                    window.alert("This template could not be loaded. Please try another one.");
                    return;
                }

                const canvasWidth = canvas.getWidth();
                const canvasHeight = canvas.getHeight();

                img.set({
                    left: 0,
                    top: 0,
                    scaleX: canvasWidth / img.width,
                    scaleY: canvasHeight / img.height,
                    selectable: true,
                    hasControls: true,
                    hasBorders: true,
                    isInvitationImage: true, // same flag as invitations (used by "reset image size")
                    originalWidth: img.width,
                    originalHeight: img.height,
                });

                canvas.add(img);
                canvas.setActiveObject(img);
                canvas.requestRenderAll();

                onClose();
                setSelectedCategory(null);
            },
            {
                crossOrigin: "anonymous",
            }
        );
    };

    // FULL close: X button / overlay click -> reset category AND tell parent to close
    const handleClose = () => {
        setSelectedCategory(null);
        onClose();
    };

    return (
        <SidebarGallery
            isOpen={isOpen}
            onClose={handleClose}
            onMinimizeRelease={onClose}
            title={selectedCategory ? selectedCategory.title : "Greeting Templates"}
            showCategories={!selectedCategory}
            categories={greetingCategories}
            images={selectedCategory ? selectedCategory.images : []}
            pageSize={GREET_PAGE_SIZE}
            maxImages={GREET_MAX_LIMIT}
            onCategoryClick={(cat) => setSelectedCategory(cat)}
            onBack={() => setSelectedCategory(null)}
            onSelect={handleSelectGreeting}
            icon={selectedCategory ? selectedCategory.icon : "🎉"}
            variant="greeting"
        />
    );
};

export default GreetingLibrary;
