import React, { useState } from "react";
import { fabric } from "fabric";
import { useCanvas } from "../../../context/CanvasContext";
import SidebarGallery from "./SidebarGallery";

const invitationCategories = [
    {
        id: "birthday",
        title: "Birthday",
        icon: "🎂",
        images: [
            "https://picsum.photos/id/1015/600/800",
            "https://picsum.photos/id/1016/600/800",
            "https://picsum.photos/id/1018/600/800",
            "https://picsum.photos/id/1020/600/800",
            "https://picsum.photos/id/1024/600/800",
            "https://picsum.photos/id/1025/600/800",
            "https://picsum.photos/id/1031/600/800",
            "https://picsum.photos/id/1035/600/800",
            "https://picsum.photos/id/1037/600/800",
            "https://picsum.photos/id/1040/600/800",
        ],
    },
    {
        id: "wedding",
        title: "Wedding",
        icon: "💍",
        images: [
            "https://picsum.photos/id/1042/600/800",
            "https://picsum.photos/id/1043/600/800",
            "https://picsum.photos/id/1050/600/800",
            "https://picsum.photos/id/1057/600/800",
            "https://picsum.photos/id/1062/600/800",
            "https://picsum.photos/id/1069/600/800",
            "https://picsum.photos/id/1074/600/800",
            "https://picsum.photos/id/1080/600/800",
        ],
    },
    {
        id: "engagement",
        title: "Engagement",
        icon: "💑",
        images: [
            "https://picsum.photos/id/1081/600/800",
            "https://picsum.photos/id/1082/600/800",
            "https://picsum.photos/id/1084/600/800",
            "https://picsum.photos/id/1085/600/800",
            "https://picsum.photos/id/1086/600/800",
            "https://picsum.photos/id/1089/600/800",
        ],
    },
    {
        id: "baby",
        title: "Baby Shower",
        icon: "👶",
        images: [
            "https://picsum.photos/id/109/600/800",
            "https://picsum.photos/id/110/600/800",
            "https://picsum.photos/id/111/600/800",
            "https://picsum.photos/id/112/600/800",
            "https://picsum.photos/id/113/600/800",
            "https://picsum.photos/id/114/600/800",
        ],
    },
    {
        id: "festival",
        title: "Festival",
        icon: "🎆",
        images: [
            "https://picsum.photos/id/115/600/800",
            "https://picsum.photos/id/116/600/800",
            "https://picsum.photos/id/117/600/800",
            "https://picsum.photos/id/118/600/800",
            "https://picsum.photos/id/119/600/800",
            "https://picsum.photos/id/120/600/800",
        ],
    },
];

const InvitationLibrary = ({ isOpen, onClose }) => {
    const { canvas } = useCanvas();
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleSelectInvitation = (imgUrl) => {
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
            onCategoryClick={(cat) => setSelectedCategory(cat)}
            onBack={() => setSelectedCategory(null)}
            onSelect={handleSelectInvitation}
            icon={selectedCategory ? selectedCategory.icon : "💌"}
            variant="invitation"
        />
    );
};

export default InvitationLibrary;