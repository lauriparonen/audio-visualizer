/**
 * @fileoverview ShaderCanvas component
 * ignore this file for now
 */

import React, { useRef, useEffect } from "react";
import { extend } from "@react-three/fiber";
import { Canvas } from "@react-three/fiber";
extend({ Canvas });

import FractalVisualizer from "./fractal-visualizer";
import FrequencyCanvas from "../FrequencyCanvas/frequency-canvas";
import styles from "./styles.css";

const ShaderCanvas = (props) => {
    const audioRef = props.audioRef;
    const src = props.src;
    const file = props.file;

    return (
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
            <FractalVisualizer audioRef={audioRef} src={src} file={file} />

        </div>
    )
}


export default ShaderCanvas;