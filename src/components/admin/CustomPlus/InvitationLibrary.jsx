import React, { useState } from "react";
import { loadTemplateImage } from "./templateImageLoader";
import { fitCanvasToImage } from "./resetImageSize";
import { useCanvas } from "../../../context/CanvasContext";
import SidebarGallery from "./SidebarGallery";
import { INVITE_MAX_LIMIT, INVITE_PAGE_SIZE, invitationCategories } from "./invitationData";

// Invitation templates come live from https://eventcert.com/home/rimg/{number}.png
// (numbers per category are listed in invitationData.js)
const InvitationLibrary = ({ isOpen, onClose }) => {
    const { canvas, activePage, setCanvasSize, setPages } = useCanvas();
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleSelectInvitation = (imgUrl) => {
        if (!canvas) return;

        loadTemplateImage(imgUrl)
            .then((img) => {
                fitCanvasToImage({ canvas, img, setCanvasSize, setPages, activePage, flags: { isInvitationImage: true } });

                onClose();
                setSelectedCategory(null);
            })
            .catch((err) => {
                console.error("Could not load invitation image:", imgUrl, err);
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
            title={selectedCategory ? selectedCategory.title : "Invitation Templates"}
            showCategories={!selectedCategory}
            categories={invitationCategories}
            images={selectedCategory ? selectedCategory.images : []}
            pageSize={INVITE_PAGE_SIZE}
            maxImages={INVITE_MAX_LIMIT}
            onCategoryClick={(cat) => setSelectedCategory(cat)}
            onBack={() => setSelectedCategory(null)}
            onSelect={handleSelectInvitation}
            icon={selectedCategory ? selectedCategory.icon : "💌"}
            variant="invitation"
        />
    );
};

export default InvitationLibrary;
