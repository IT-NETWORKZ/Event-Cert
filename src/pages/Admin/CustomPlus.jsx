import React, { useState } from "react";
import Designer from "../../components/admin/CustomPlus/Designer";
import { CanvasProvider } from "../../context/CanvasContext";

const CustomPlus = () => {

    const [canvas, setCanvas] = useState(null);

    return (

        <CanvasProvider>

            <Designer />

        </CanvasProvider>

    );
};

export default CustomPlus;