/**
 * @fileoverview fractal-visualizer.js - fractal visualizer component
 * ignore this file for now
 */

import React, { useRef, useEffect, use } from "react";
import { extend } from "@react-three/fiber";
import { Canvas, useFrame } from "@react-three/fiber";
import { Box, OrbitControls } from "@react-three/drei";
extend({ Canvas, Box, OrbitControls });

import * as THREE from "three";

const FractalVisualizer = (props) => {
    const meshRef = useRef(null);
    const audioRef = props.audioRef;
    const src = props.src;
    const file = props.file;

    console.log("FractalVisualizer props: ", props);

    return (
        <div className="fractal-visualizer">
            <Canvas>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <Box ref={meshRef} args={[1, 1, 1]} position={[0, 0, 0]}>
                    <meshStandardMaterial color={0x00ff00} />
                </Box>
                <OrbitControls />
            </Canvas>
        </div>
    );
}




export default FractalVisualizer;
