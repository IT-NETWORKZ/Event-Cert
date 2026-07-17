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

            const link = document.createElement("a");

            link.href = imageData;
            link.download = `${fileName}-page-${index + 1}.png`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Small delay helps the browser process multiple downloads
            await new Promise((resolve) => setTimeout(resolve, 300));
        }
    } catch (error) {
        console.error("PNG download failed:", error);
    }
};