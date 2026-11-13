import React, { useState } from "react";
import { fabric } from "fabric";
import { useCanvas } from "../../../context/CanvasContext";
import SidebarGallery from "./SidebarGallery";
import { INVITE_MAX_LIMIT, INVITE_PAGE_SIZE, invitationCategories } from "./invitationData";

// Invitation templates come live from https://eventcert.com/home/rimg/{number}.png
// (numbers per category are listed in invitationData.js)
const InvitationLibrary = ({ isOpen, onClose }) => {
    const { canvas } = useCanvas();
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleSelectInvitation = (imgUrl) => {
        if (!canvas) return;

        fabric.Image.fromURL(
            imgUrl,
            (img, isError) => {
                // picture missing on the server, or the server blocks it (CORS)
                if (isError || !img || !img.width) {
                    console.error("Could not load invitation image:", imgUrl);
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
                    isInvitationImage: true,
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
