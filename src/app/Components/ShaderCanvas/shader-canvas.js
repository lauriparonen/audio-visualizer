import React, { useRef, useEffect } from "react";

const ShaderCanvas = (props) => {
    // . . .

    return (
        <div className="shader-canvas">
            <canvas 
             width={window.innerWidth} height={window.innerHeight / 2} />
        </div>
    )
}

export default ShaderCanvas;