import React, { useState } from "react";
import { fabric } from "fabric";
import { useCanvas } from "../../../context/CanvasContext";
import SidebarGallery from "./SidebarGallery";

// Placeholder certificate backgrounds (landscape). Replace the URLs with your own templates.
const certificateImages = (startId, count) =>
    Array.from({ length: count }, (_, i) => `https://picsum.photos/id/${startId + i}/800/600`);

const certificateCategories = [
    { id: "achievement", title: "Achievement", icon: "🏆", images: certificateImages(1100, 8) },
    { id: "participation", title: "Participation", icon: "🎖️", images: certificateImages(1110, 8) },
    { id: "appreciation", title: "Appreciation", icon: "🙏", images: certificateImages(1120, 6) },
    { id: "completion", title: "Course Completion", icon: "🎓", images: certificateImages(1130, 6) },
    { id: "winner", title: "Winner", icon: "🥇", images: certificateImages(1140, 6) },
];

const CertificateLibrary = ({ isOpen, onClose }) => {
    const { canvas } = useCanvas();
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleSelectCertificate = (imgUrl) => {
        if (!canvas) return;

        fabric.Image.fromURL(
            imgUrl,
            (img) => {
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
            { crossOrigin: "anonymous" }
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
            onCategoryClick={(cat) => setSelectedCategory(cat)}
            onBack={() => setSelectedCategory(null)}
            onSelect={handleSelectCertificate}
            icon={selectedCategory ? selectedCategory.icon : "🏆"}
            variant="certificate"
        />
    );
};

export default CertificateLibrary;
