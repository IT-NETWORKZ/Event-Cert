import React, { useState } from "react";
import SchedularDesigner from "../../components/admin/Schedular/SchedularDesigner";
import { CanvasProvider } from "../../context/CanvasContext";

const Schedular = () => {
    const [canvas, setCanvas] = useState(null);
    return (
        <div>

            <CanvasProvider>
                <SchedularDesigner />
            </CanvasProvider>

        </div>
    )
}

export default Schedular
