import React, { useState } from "react";
import { fabric } from "fabric";
import { useCanvas } from "../../../context/CanvasContext";
import SidebarGallery from "./SidebarGallery";
import { CERT_MAX_LIMIT, CERT_PAGE_SIZE, certificateCategories } from "./certificateData";

// Certificate templates come live from https://eventcert.com/demoimg/{id}.png
// (ids per category are listed in certificateData.js)
const CertificateLibrary = ({ isOpen, onClose }) => {
    const { canvas } = useCanvas();
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleSelectCertificate = (imgUrl) => {
        if (!canvas) return;

        fabric.Image.fromURL(
            imgUrl,
            (img, isError) => {
                // picture missing on the server, or the server blocks it (CORS)
                if (isError || !img || !img.width) {
                    console.error("Could not load certificate image:", imgUrl);
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
                    isCertificateImage: true,
                    isInvitationImage: true, // same flag as invitations (used by "reset image size")
                    originalWidth: img.width,
                    originalHeight: img.height,
                });

                canvas.add(img);
                img.sendToBack(); // text and logos stay on top of the certificate
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
            title={selectedCategory ? selectedCategory.title : "Certificate Templates"}
            showCategories={!selectedCategory}
            categories={certificateCategories}
            images={selectedCategory ? selectedCategory.images : []}
            pageSize={CERT_PAGE_SIZE}
            maxImages={CERT_MAX_LIMIT}
            onCategoryClick={(cat) => setSelectedCategory(cat)}
            onBack={() => setSelectedCategory(null)}
            onSelect={handleSelectCertificate}
            icon={selectedCategory ? selectedCategory.icon : "🏆"}
            variant="certificate"
        />
    );
};

export default CertificateLibrary;
