import React, { useRef, useState } from "react";
import {
    FaBars,
    FaExpandArrowsAlt,
    FaImages,
    FaFont,
    FaIcons,
    FaUpload,
    FaSearchPlus,
    FaEnvelopeOpenText,
    FaRegImage,
    FaCertificate,
    FaFileImage,
    FaFilePdf,
    FaHistory,
    FaFolderOpen,
} from "react-icons/fa";

import { fabric } from "fabric";
import { useCanvas } from "../../../context/CanvasContext";
import Resize from "./Resize";
import StickerLibrary from "./StickersLibrary";
import InvitationLibrary from "./InvitationLibrary";
import GreetingLibrary from "./GreetingLibrary";
import PreviewModal from "./PreviewModal";
import MainHeaderBar from "./MainHeaderBar";
import Recentlibrary from "./Recentlibrary";
import {
    getRecent,
    addRecent,
    removeRecent,
    createThumb,
} from "./Recentdesigns";
import { downloadAllPagesAsPng } from "../../../Services/downloadPng";
import { downloadAllPagesAsPdf } from "../../../Services/downloadPdf";

const MAX_DESIGN_DIMENSION = 2000;

// "Upload Image" adds the picture as a small logo-sized object (longest side)
const LOGO_MAX_SIZE = 120;

const Sidebar = ({ activeMenu, setActiveMenu }) => {
    const {
        canvas,
        pages,
        activePage,
        saveCurrentPageData,
        setCanvasSize,
        setPages,
    } = useCanvas();

    const [showResize, setShowResize] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [showMainMenu, setShowMainMenu] = useState(false);

    // Sidebar Library Window Visibility States
    const [showStickerLibrary, setShowStickerLibrary] = useState(false);
    const [showInvitationLibrary, setShowInvitationLibrary] = useState(false);
    const [showGreetingLibrary, setShowGreetingLibrary] = useState(false);

    // Recent Work drawer
    const [showRecent, setShowRecent] = useState(false);
    const [recentItems, setRecentItems] = useState([]);

    // Your Design drawer (same saved designs, own drawer + own minimized pill)
    const [showYourDesign, setShowYourDesign] = useState(false);

    const designFileInputRef = useRef(null);
    const logoFileInputRef = useRef(null);

    // Small "Image uploaded" popup (bottom-right)
    const [toast, setToast] = useState("");
    const toastTimerRef = useRef(null);

    const showToast = (message) => {
        setToast(message);
        clearTimeout(toastTimerRef.current);
        toastTimerRef.current = setTimeout(() => setToast(""), 3500);
    };

    const handleDesignClick = () => {
        if (designFileInputRef.current) {
            designFileInputRef.current.value = null;
            designFileInputRef.current.click();
        }
    };

    // ==========================
    // UPLOAD IMAGE (logo size)
    // ==========================
    const handleLogoClick = () => {
        if (logoFileInputRef.current) {
            logoFileInputRef.current.value = null;
            logoFileInputRef.current.click();
        }
    };

    const handleLogoFileChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file.");
            return;
        }

        if (!canvas) {
            alert("Canvas is not ready yet.");
            return;
        }

        const reader = new FileReader();

        reader.onload = (evt) => {
            fabric.Image.fromURL(
                evt.target.result,
                (img) => {
                    // never bigger than LOGO_MAX_SIZE, and never more than 30% of the canvas
                    const maxSize = Math.min(
                        LOGO_MAX_SIZE,
                        Math.min(canvas.getWidth(), canvas.getHeight()) * 0.3
                    );
                    const scale = maxSize / Math.max(img.width, img.height);

                    img.set({
                        left: (canvas.getWidth() - img.width * scale) / 2,
                        top: 30,
                        scaleX: scale,
                        scaleY: scale,
                        selectable: true,
                        evented: true,
                        hasControls: true,
                        hasBorders: true,
                        isLogoImage: true,
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

        reader.readAsDataURL(file);
    };

    // Make the canvas match the uploaded image's shape and fill it edge to edge
    // `size` (optional) = original image size, used when the preview image is smaller than the original
    const applyDesignToCanvas = (img, size) => {
        let w = size?.width || img.width;
        let h = size?.height || img.height;

        const ratio = Math.min(1, MAX_DESIGN_DIMENSION / Math.max(w, h));
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);

        // 1. canvas takes the image's aspect ratio
        canvas.setDimensions({ width: w, height: h });
        setCanvasSize({ width: w, height: h });

        // keep the page record in sync so switching pages doesn't reset the size
        if (typeof setPages === "function") {
            setPages((prev) =>
                prev.map((p) =>
                    p.id === activePage ? { ...p, width: w, height: h } : p
                )
            );
        }

        // 2. a page has one design: remove the previous one
        canvas
            .getObjects()
            .filter((o) => o.isDesignImage)
            .forEach((o) => canvas.remove(o));

        // 3. image fills the canvas exactly (shapes match, so no distortion)
        img.set({
            left: 0,
            top: 0,
            scaleX: w / img.width,
            scaleY: h / img.height,
            selectable: true,
            evented: true,
            hasControls: true,
            hasBorders: true,
            isDesignImage: true,
            originalWidth: img.width,
            originalHeight: img.height,
        });

        canvas.add(img);
        img.sendToBack();
        canvas.setActiveObject(img);
        canvas.requestRenderAll();

        showToast(`Image uploaded! Canvas auto-resized to ${w} × ${h}`);
    };

    const handleDesignFileChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file.");
            return;
        }

        if (!canvas) {
            alert("Canvas is not ready yet.");
            return;
        }

        const reader = new FileReader();

        reader.onload = (evt) => {
            const dataUrl = evt.target.result;

            // keep a small copy in Recent Work (does not block the upload)
            createThumb(dataUrl)
                .then(({ src, width, height }) =>
                    addRecent({
                        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                        name: file.name,
                        src,
                        width,
                        height,
                        createdAt: Date.now(),
                    })
                )
                .catch(() => {});

            fabric.Image.fromURL(
                dataUrl,
                (img) => {
                    applyDesignToCanvas(img);
                    setActiveMenu("design");
                },
                {
                    crossOrigin: "anonymous",
                }
            );
        };

        reader.readAsDataURL(file);
    };

    // ==========================
    // RECENT WORK
    // ==========================
    const openRecent = () => {
        setRecentItems(getRecent());
        setShowYourDesign(false);
        setShowRecent(true);
    };

    const openYourDesign = () => {
        setRecentItems(getRecent());
        setShowRecent(false);
        setShowYourDesign(true);
    };

    const handleRecentSelect = (item) => {
        if (!canvas) {
            alert("Canvas is not ready yet.");
            return;
        }

        fabric.Image.fromURL(
            item.src,
            (img) => {
                applyDesignToCanvas(img, { width: item.width, height: item.height });
                setShowRecent(false);
                setShowYourDesign(false);
                setActiveMenu("design");
            },
            { crossOrigin: "anonymous" }
        );
    };

    const handleRecentDelete = (id) => {
        setRecentItems(removeRecent(id));
    };

    // ==========================
    // SIDEBAR CLICK ROUTER
    // ==========================
    const handleClick = async (id) => {
        // "Menu" toggles the EventCert header bar; any other tool closes it
        if (id === "menu") {
            setShowMainMenu((v) => !v);
            return;
        }
        setShowMainMenu(false);

        switch (id) {
            case "resize":
                setShowResize(true);
                setActiveMenu(id);
                break;

            case "design":
                handleDesignClick();
                setActiveMenu(id);
                break;

            case "upload":
                handleLogoClick();
                setActiveMenu(id);
                break;

            case "recent":
                openRecent();
                setActiveMenu(id);
                break;

            case "yourdesign":
                openYourDesign();
                setActiveMenu(id);
                break;

            case "text":
                setActiveMenu(id);
                break;

            case "sticker":
                setShowStickerLibrary(true);
                setActiveMenu(id);
                break;

            case "invitation":
                setShowInvitationLibrary(true);
                setActiveMenu(id);
                break;

            case "greeting":
                setShowGreetingLibrary(true);
                setActiveMenu(id);
                break;

            case "preview":
                setShowPreview(true);
                setActiveMenu(id);
                break;

            case "png": {
                const currentPageData = saveCurrentPageData();

                await downloadAllPagesAsPng({
                    pages,
                    activePage,
                    currentPageData,
                    fileName: "certificate",
                });

                setActiveMenu(id);
                break;
            }

            case "pdf": {
                const currentPageData = saveCurrentPageData();

                await downloadAllPagesAsPdf({
                    pages,
                    activePage,
                    currentPageData,
                    fileName: "certificate.pdf",
                });

                setActiveMenu(id);
                break;
            }

            default:
                setActiveMenu(id);
                break;
        }
    };

    // ==========================
    // NAVIGATION LINK SCHEMA
    // ==========================
    // grouped so related tools sit together; a divider is drawn between groups
    const menuGroups = [
        [
            { id: "menu", icon: <FaBars />, title: "Menu" },
        ],
        [
            { id: "resize", icon: <FaExpandArrowsAlt />, title: "Size" },
            { id: "design", icon: <FaImages />, title: "Upload Design" },
            { id: "upload", icon: <FaUpload />, title: "Upload Image" },
            { id: "recent", icon: <FaHistory />, title: "Recent" },
            {
                id: "yourdesign",
                icon: <FaFolderOpen />,
                title: "Your Design",
                desc: "This section allows you to access your created or customized designs.",
            },
        ],
        [
            { id: "text", icon: <FaFont />, title: "Text" },
            { id: "sticker", icon: <FaIcons />, title: "Sticker" },
        ],
        [
            { id: "invitation", icon: <FaEnvelopeOpenText />, title: "Invitation" },
            { id: "greeting", icon: <FaRegImage />, title: "Greeting" },
            { id: "certificate", icon: <FaCertificate />, title: "Certificate" },
        ],
        [
            { id: "preview", icon: <FaSearchPlus />, title: "Preview" },
            {
                id: "png",
                icon: <FaFileImage />,
                title: "PNG",
                desc: "Here you can download your design in PNG format.",
            },
            {
                id: "pdf",
                icon: <FaFilePdf />,
                title: "PDF",
                desc: "Here you can download your design in PDF format.",
            },
        ],
    ];

    return (
        <>
            <div className="cp-sidebar">
                {menuGroups.map((group, gi) => (
                    <React.Fragment key={gi}>
                        {gi > 0 && <div className="cp-sidebar-divider" />}
                        {group.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleClick(item.id)}
                                title={item.desc || item.title}
                                aria-label={item.desc || item.title}
                                className={`cp-sidebar-item ${
                                    item.id === "menu"
                                        ? showMainMenu ? "active" : ""
                                        : activeMenu === item.id ? "active" : ""
                                }`}
                            >
                                <div className="cp-sidebar-icon">
                                    {item.icon}
                                </div>
                                <span>{item.title}</span>
                            </button>
                        ))}
                    </React.Fragment>
                ))}

                {/* Hidden File Input */}
                <input
                    type="file"
                    accept="image/*"
                    ref={designFileInputRef}
                    style={{ display: "none" }}
                    onChange={handleDesignFileChange}
                />

                {/* Hidden File Input: Upload Image (logo size) */}
                <input
                    type="file"
                    accept="image/*"
                    ref={logoFileInputRef}
                    style={{ display: "none" }}
                    onChange={handleLogoFileChange}
                />
            </div>

            {/* EventCert header bar, opened by the Menu button */}
            <MainHeaderBar
                isOpen={showMainMenu}
                onClose={() => setShowMainMenu(false)}
            />

            {/* Resize Overlay Layout Modal */}
            <Resize
                open={showResize}
                onClose={() => setShowResize(false)}
            />

            {/* Sticker Asset Sliding Deck Container */}
            <StickerLibrary
                isOpen={showStickerLibrary}
                onClose={() => setShowStickerLibrary(false)}
            />

            {/* Invitation Template Deck Drawer */}
            <InvitationLibrary
                isOpen={showInvitationLibrary}
                onClose={() => setShowInvitationLibrary(false)}
            />

            {/* Greeting Template Deck Drawer */}
            <GreetingLibrary
                isOpen={showGreetingLibrary}
                onClose={() => setShowGreetingLibrary(false)}
            />

            {/* Recent Work Drawer */}
            <Recentlibrary
                isOpen={showRecent}
                onClose={() => setShowRecent(false)}
                onExpand={openRecent}
                items={recentItems}
                onSelect={handleRecentSelect}
                onDelete={handleRecentDelete}
            />

            {/* Your Design Drawer */}
            <Recentlibrary
                isOpen={showYourDesign}
                onClose={() => setShowYourDesign(false)}
                onExpand={openYourDesign}
                items={recentItems}
                onSelect={handleRecentSelect}
                onDelete={handleRecentDelete}
                title="Your Design"
                pillLabel="Your Design"
                pillTop={390}
                pillColor="#00acc1"
                icon={<FaFolderOpen />}
            />

            <PreviewModal
                open={showPreview}
                onClose={() => setShowPreview(false)}
            />

            {toast && (
                <div className="cp-toast" role="status">
                    <span className="cp-toast-icon">✓</span>
                    {toast}
                </div>
            )}
        </>
    );
};

export default Sidebar;
