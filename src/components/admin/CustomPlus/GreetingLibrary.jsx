import React, { useState } from "react";
import { loadTemplateImage } from "./templateImageLoader";
import { fitCanvasToImage } from "./resetImageSize";
import { useCanvas } from "../../../context/CanvasContext";
import SidebarGallery from "./SidebarGallery";
import { GREET_MAX_LIMIT, GREET_PAGE_SIZE, greetingCategories } from "./greetingData";

// Greeting templates come live from https://eventcert.com/demoimg/{id}.png
// (ids per category are listed in greetingData.js)
const GreetingLibrary = ({ isOpen, onClose }) => {
    const { canvas, activePage, setCanvasSize, setPages } = useCanvas();
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleSelectGreeting = (imgUrl) => {
        if (!canvas) return;

        loadTemplateImage(imgUrl)
            .then((img) => {
                fitCanvasToImage({ canvas, img, setCanvasSize, setPages, activePage, flags: { isInvitationImage: true } });

                onClose();
                setSelectedCategory(null);
            })
            .catch((err) => {
                console.error("Could not load greeting image:", imgUrl, err);
                window.alert(`This template could not be loaded.\n${err.message}`);
            });
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
