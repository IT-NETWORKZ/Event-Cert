import { fabric } from "fabric";
import { jsPDF } from "jspdf";

export const downloadAllPagesAsPdf = async ({
    pages,
    activePage,
    currentPageData,
    fileName = "certificate.pdf",
}) => {
    if (!pages || pages.length === 0) {
        console.error("No pages available for PDF download.");
        return;
    }

    try {
        const exportPages = pages.map((page) => {
            const isActivePage = page.id === activePage;

            return {
                json:
                    isActivePage && currentPageData?.currentJson
                        ? currentPageData.currentJson
                        : page.json,

                width:
                    isActivePage && currentPageData?.currentWidth
                        ? currentPageData.currentWidth
                        : page.width,

                height:
                    isActivePage && currentPageData?.currentHeight
                        ? currentPageData.currentHeight
                        : page.height,
            };
        });

        let pdf = null;

        for (let index = 0; index < exportPages.length; index++) {
            const page = exportPages[index];

            if (!page.json) {
                console.warn(`Page ${index + 1} has no canvas data.`);
                continue;
            }

            // Create temporary HTML canvas
            const canvasElement = document.createElement("canvas");

            canvasElement.width = page.width;
            canvasElement.height = page.height;

            // Create temporary Fabric canvas
            const tempCanvas = new fabric.StaticCanvas(canvasElement, {
                width: page.width,
                height: page.height,
            });

            // Load complete Fabric JSON
            await new Promise((resolve, reject) => {
                try {
                    tempCanvas.loadFromJSON(page.json, () => {
                        tempCanvas.renderAll();
                        resolve();
                    });
                } catch (error) {
                    reject(error);
                }
            });

            // High-resolution export
            const imageData = tempCanvas.toDataURL({
                format: "png",
                quality: 1,
                multiplier: 3,
            });

            const orientation =
                page.width > page.height ? "landscape" : "portrait";

            if (!pdf) {
                pdf = new jsPDF({
                    orientation,
                    unit: "px",
                    format: [page.width, page.height],
                    hotfixes: ["px_scaling"],
                    compress: true,
                });
            } else {
                pdf.addPage(
                    [page.width, page.height],
                    orientation
                );
            }

            pdf.addImage(
                imageData,
                "PNG",
                0,
                0,
                page.width,
                page.height,
                undefined,
                "FAST"
            );

            // Free memory after each page
            tempCanvas.dispose();
        }

        if (!pdf) {
            console.error("No valid pages available for PDF export.");
            return;
        }

        pdf.save(fileName);

    } catch (error) {
        console.error("High-quality PDF download failed:", error);
    }
};