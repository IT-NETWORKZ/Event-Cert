import React, { useMemo, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useCanvas } from "../../../context/CanvasContext";

const SIZE_PRESETS = [
    {
        category: "Documents",
        items: [
            { name: "Square", width: 718, height: 718, icon: "🏆" },
            { name: "Rectangle", width: 794, height: 529, icon: "🏆" },
            { name: "Vertical", width: 529, height: 794, icon: "🏆" },
            { name: "Social Media Square", width: 1000, height: 1000, icon: "🏆" },
            { name: "Large Rectangle", width: 1172, height: 832, icon: "🏆" },
            { name: "Visiting Card", width: 359, height: 208, icon: "🏆" },

            { name: "A4 Portrait", width: 794, height: 1123, icon: "📄" },
            { name: "A4 Landscape", width: 1123, height: 794, icon: "📄" },
            { name: "A3 Portrait", width: 1123, height: 1587, icon: "📄" },

            { name: "Certificate Landscape", width: 1400, height: 990, icon: "🏆" },
            { name: "Certificate Portrait", width: 990, height: 1400, icon: "🎖️" },
            { name: "Letter", width: 816, height: 1056, icon: "📃" },
            { name: "Legal", width: 816, height: 1344, icon: "📜" }
        ]
    },



];

const Resize = ({ open, onClose }) => {

    const { setCanvasSize } = useCanvas();

    const [search, setSearch] = useState("");

    const [customWidth, setCustomWidth] = useState(800);

    const [customHeight, setCustomHeight] = useState(600);

    const [unit, setUnit] = useState("px");

    const convertToPx = (value, selectedUnit) => {

        const num = Number(value);

        switch (selectedUnit) {

            case "mm":
                return Math.round(num * 3.779527559);

            case "cm":
                return Math.round(num * 37.79527559);

            case "in":
                return Math.round(num * 96);

            default:
                return num;
        }
    };

    const applyPreset = (width, height) => {

        setCanvasSize({
            width,
            height
        });

        if (onClose) {
            onClose();
        }
    };

    const applyCustomSize = () => {

        const width = convertToPx(customWidth, unit);

        const height = convertToPx(customHeight, unit);

        if (width < 100 || height < 100) {
            alert("Minimum size is 100 × 100 pixels.");
            return;
        }

        if (width > 5000 || height > 5000) {
            alert("Maximum size is 5000 × 5000 pixels.");
            return;
        }

        setCanvasSize({
            width,
            height
        });

        if (onClose) {
            onClose();
        }
    };

    const filteredCategories = useMemo(() => {

        if (!search.trim()) {
            return SIZE_PRESETS;
        }

        return SIZE_PRESETS
            .map(category => ({
                ...category,
                items: category.items.filter(item =>
                    item.name.toLowerCase().includes(search.toLowerCase())
                )
            }))
            .filter(category => category.items.length > 0);

    }, [search]);

    if (!open) {
        return null;
    }

    return (

        <div
            className="cp-resize-overlay"
            onClick={onClose}
        >

            <div
                className="cp-resize-modal"
                onClick={(e) => e.stopPropagation()}
            >

                {/* ================= HEADER ================= */}

                <div className="cp-resize-header">

                    <div>

                        <h2>Resize Canvas</h2>

                        <p>
                            Choose a preset size or create your own custom size.
                        </p>

                    </div>

                    <button
                        className="cp-close-btn"
                        onClick={onClose}
                    >
                        <FaTimes />
                    </button>

                </div>

                {/* ================= SEARCH ================= */}

                <div className="cp-search-wrapper">

                    <FaSearch className="cp-search-icon" />

                    <input
                        type="text"
                        className="cp-search-input"
                        placeholder="Search size..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>

                {/* ================= CUSTOM SIZE ================= */}

                <div className="cp-custom-size">

                    <h3>Custom Size</h3>

                    <div className="cp-custom-row">

                        <div className="cp-input-group">

                            <label>Width</label>

                            <input
                                type="number"
                                min="100"
                                max="5000"
                                value={customWidth}
                                onChange={(e) =>
                                    setCustomWidth(e.target.value)
                                }
                            />

                        </div>

                        <div className="cp-multiply">

                            ×

                        </div>

                        <div className="cp-input-group">

                            <label>Height</label>

                            <input
                                type="number"
                                min="100"
                                max="5000"
                                value={customHeight}
                                onChange={(e) =>
                                    setCustomHeight(e.target.value)
                                }
                            />

                        </div>

                        <div className="cp-input-group">

                            <label>Unit</label>

                            <select
                                value={unit}
                                onChange={(e) =>
                                    setUnit(e.target.value)
                                }
                            >

                                <option value="px">
                                    px
                                </option>

                                <option value="mm">
                                    mm
                                </option>

                                <option value="cm">
                                    cm
                                </option>

                                <option value="in">
                                    inch
                                </option>

                            </select>

                        </div>

                        <button
                            className="cp-apply-btn"
                            onClick={applyCustomSize}
                        >
                            Apply
                        </button>

                    </div>

                </div>

                {/* ================= PRESETS ================= */}

                <div className="cp-preset-container">

                    {filteredCategories.length === 0 && (

                        <div className="cp-no-results">

                            <h3>No Results Found</h3>

                            <p>
                                Try another keyword or use Custom Size.
                            </p>

                        </div>

                    )}

                    {filteredCategories.map((category) => (

                        <div
                            key={category.category}
                            className="cp-category-block"
                        >

                            <h3 className="cp-category-title">

                                {category.category}

                            </h3>

                            <div className="cp-size-grid">

                                {category.items.map((item) => (

                                    <div
                                        key={item.name}
                                        className="cp-size-card"
                                        onClick={() =>
                                            applyPreset(
                                                item.width,
                                                item.height
                                            )
                                        }
                                    >

                                        <div className="cp-size-icon">

                                            {item.icon}

                                        </div>

                                        <div className="cp-size-content">

                                            <h4>

                                                {item.name}

                                            </h4>

                                            <span>

                                                {item.width}
                                                {" × "}
                                                {item.height}
                                                {" px"}

                                            </span>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        </div>

                    ))}

                </div>

                {/* ================= FOOTER ================= */}

                <div className="cp-resize-footer">

                    <button
                        className="cp-footer-cancel"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                </div>

            </div>

        </div>

    );
}
export default Resize;