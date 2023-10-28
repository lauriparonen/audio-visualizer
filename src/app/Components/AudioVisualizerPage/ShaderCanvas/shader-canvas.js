/**
 * @fileoverview ShaderCanvas component
 * ignore this file for now
 */

import React, { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import FractalVisualizer from "./fractal-visualizer";
import FrequencyCanvas from "../FrequencyCanvas/frequency-canvas";

const ShaderCanvas = ({ selectedFile }) => {
    const [audioData, setAudioData] = React.useState(null);

    return (
        <div className="shader-canvas">
            
            {/* <FrequencyCanvas onAudioData={setAudioData} /> */}
            <FractalVisualizer audioData={audioData}
            />
        </div>
    )
}

export default ShaderCanvas;