/**
 * @fileoverview ShaderCanvas component
 * ignore this file for now
 */

import React, { useRef, useEffect, useState, memo } from "react";
import { extend } from "@react-three/fiber";
import { Canvas } from "@react-three/fiber";
extend({ Canvas });

import PointSphere from "./PointSphere/point-sphere";
import ParticleCloud from "./ParticleCloud/particle-cloud";
import FrequencyCanvas from "../FrequencyCanvas/frequency-canvas";


import styles from "./styles.css";

const ShaderCanvas = memo((props) => {
    const audioRef = props.audioRef;
    const src = props.src;
    const file = props.file;

    const [selectedVisualizer, setSelectedVisualizer] = useState('ParticleCloud');



    return (
        <div className="shader-canvas-cont">
            <select className='visualizer-select'
                value={selectedVisualizer} 
                onChange={(e) => setSelectedVisualizer(e.target.value)}>
                <option value="PointSphere">particle sphere</option>
                <option value="ParticleCloud">particle cloud</option>
                {/* more canvases as they finish */}
            </select>

        <div className="shader-canvas"
            style={
                {
                    width: window.innerWidth * 0.8,
                    height: window.innerHeight * 0.8,
                    position: "relative",

                    //backgroundColor: "black",
                    border: "1px solid white",

                }
            
            }>

        {selectedVisualizer === 'PointSphere' && (

            <PointSphere audioRef={audioRef} src={src} file={file} />

        )}

        {selectedVisualizer === 'ParticleCloud' && (

        <ParticleCloud audioRef={audioRef} src={src} file={file} />

        )}

        </div>
        </div>
    )
});


export default ShaderCanvas;