import JSZip from "jszip";

export const downloadAllPagesAsPng = async ({
    pages,
    activePage,
    currentPageData,
    fileName = "certificate",
}) => {
    if (!pages || pages.length === 0) {
        console.error("No pages available for PNG download.");
        return;
    }

    try {
        // Condition check: Single page vs Multi-page
        const isMultiPage = pages.length > 1;
        let zip = null;

        if (isMultiPage) {
            zip = new JSZip();
        }

        for (let index = 0; index < pages.length; index++) {
            const page = pages[index];

            /*
             * For the currently active page, use fresh data returned
             * directly by saveCurrentPageData().
             *
             * For all other pages, use their already saved thumbnails.
             */
            const imageData =
                page.id === activePage && currentPageData?.currentThumbnail
                    ? currentPageData.currentThumbnail
                    : page.thumbnail;

            if (!imageData) {
                console.warn(`Page ${index + 1} has no image data.`);
                continue;
            }

            const currentFileName = `${fileName}-page-${index + 1}.png`;

            if (isMultiPage) {
                // Extract base64 clean data string out of the DataURL
                // data:image/png;base64,iVBORw0KGgoAAAANS... -> iVBORw0KGgoAAAANS...
                const base64Data = imageData.split(",")[1];
                if (base64Data) {
                    zip.file(currentFileName, base64Data, { base64: true });
                }
            } else {
                // Fallback: Trigger direct single PNG download
                const link = document.createElement("a");
                link.href = imageData;
                link.download = currentFileName;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }

        // If it was processed as a multi-page array, compile and trigger the .zip download
        if (isMultiPage) {
            const content = await zip.generateAsync({ type: "blob" });
            const link = document.createElement("a");
            
            link.href = URL.createObjectURL(content);
            link.download = `${fileName}-pages.zip`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up the temporary Object URL from browser memory
            URL.revokeObjectURL(link.href);
        }

    } catch (error) {
        console.error("PNG/ZIP download failed:", error);
    }
};