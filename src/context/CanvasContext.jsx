import {
    createContext,
    useContext,
    useState
} from "react";

const CanvasContext = createContext();

export const CanvasProvider = ({ children }) => {

    // Fabric Canvas Instance
    const [canvas, setCanvas] = useState(null);

    // Canvas Size
    const [canvasSize, setCanvasSize] = useState({
        width: 450,
        height: 450,
    });

    // Pages
    const [pages, setPages] = useState([
        {
            id: 1,
            json: null,
            name: "Page 1"
        }
    ]);

    // Active Page
    const [activePage, setActivePage] = useState(1);

    // Zoom
    const [zoom, setZoom] = useState(1);

    // Clipboard
    const [clipboard, setClipboard] = useState(null);

    return (
        <CanvasContext.Provider
            value={{
                // Fabric
                canvas,
                setCanvas,

                // Canvas Size
                canvasSize,
                setCanvasSize,

                // Pages
                pages,
                setPages,

                activePage,
                setActivePage,

                // Zoom
                zoom,
                setZoom,

                // Clipboard
                clipboard,
                setClipboard,
            }}
        >
            {children}
        </CanvasContext.Provider>
    );
};

export const useCanvas = () => useContext(CanvasContext);