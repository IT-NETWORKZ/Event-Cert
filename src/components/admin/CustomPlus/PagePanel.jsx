import React from "react";
import {
    FaArrowLeft,
    FaPlus,
    FaTimes
} from "react-icons/fa";
import { useCanvas } from "../../../context/CanvasContext";

const MAX_PAGES = 6;

const PagePanel = () => {

    const {
        pages,
        setPages,
        activePage,
        setActivePage
    } = useCanvas();

    const addPage = () => {

        if (pages.length >= MAX_PAGES) {
            alert(`Maximum ${MAX_PAGES} pages allowed.`);
            return;
        }

        const newPage = {
            id: Date.now(),
            name: `Page ${pages.length + 1}`,
        };

        setPages([...pages, newPage]);
        setActivePage(newPage.id);
    };

    const deletePage = (id) => {

        if (pages.length === 1) {
            alert("At least one page is required.");
            return;
        }

        const updated = pages.filter(page => page.id !== id);

        setPages(updated);

        if (activePage === id) {
            setActivePage(updated[0].id);
        }
    };

    return (
        <div className="cp-page-panel">

            <button className="cp-back-btn">
                <FaArrowLeft />
                <span>Back</span>
            </button>

            <button
                className="cp-add-page-btn"
                onClick={addPage}
                disabled={pages.length >= MAX_PAGES}
            >
                <FaPlus />
                <span>
                    {pages.length >= MAX_PAGES
                        ? "Limit Reached"
                        : "Add Page"}
                </span>
            </button>

            <div className="cp-page-list">

                {pages.map((page) => (

                    <div
                        key={page.id}
                        className={`cp-page-card ${
                            activePage === page.id ? "active" : ""
                        }`}
                        onClick={() => setActivePage(page.id)}
                    >

                        <button
                            className="cp-delete-page"
                            onClick={(e) => {
                                e.stopPropagation();
                                deletePage(page.id);
                            }}
                        >
                            <FaTimes />
                        </button>

                        <div className="cp-page-preview"></div>

                        <div className="cp-page-name">
                            {page.name}
                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
};

export default PagePanel;