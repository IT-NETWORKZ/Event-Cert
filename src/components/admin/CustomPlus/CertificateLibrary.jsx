import React, { useState } from "react";
import { loadTemplateImage } from "./templateImageLoader";
import { fitCanvasToImage } from "./resetImageSize";
import { useCanvas } from "../../../context/CanvasContext";
import SidebarGallery from "./SidebarGallery";
import { CERT_MAX_LIMIT, CERT_PAGE_SIZE, certificateCategories } from "./certificateData";

// Certificate templates come live from https://eventcert.com/demoimg/{id}.png
// (ids per category are listed in certificateData.js)
const CertificateLibrary = ({ isOpen, onClose }) => {
    const { canvas, activePage, setCanvasSize, setPages } = useCanvas();
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleSelectCertificate = (imgUrl) => {
        if (!canvas) return;

        loadTemplateImage(imgUrl)
            .then((img) => {
                fitCanvasToImage({ canvas, img, setCanvasSize, setPages, activePage, flags: { isCertificateImage: true, isInvitationImage: true } });

                onClose();
                setSelectedCategory(null);
            })
            .catch((err) => {
                console.error("Could not load certificate image:", imgUrl, err);
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
