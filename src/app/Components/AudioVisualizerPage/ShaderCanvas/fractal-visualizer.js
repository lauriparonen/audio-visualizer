/**
 * @fileoverview fractal-visualizer.js - fractal visualizer component
 * ignore this file for now
 */

import React, { useRef, useEffect, use } from "react";
import { Canvas } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { audioContext } from "../FrequencyCanvas/frequency-canvas";

const FractalVisualizer = ({ file }) => {
    const audioDataRef = useRef(null);

    
    /*
    useEffect(() => {
        if(!file) return;

        const onAudioData = (audioData) => {
            audioDataRef.current = audioData;
        };

        return () => {
            audioDataRef.current = null;
        };
    }, [file]);
    */

    return (
        <Canvas>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <FractalShader audioData={audioDataRef.current} />

            {/* visualizer code here */}
        </Canvas>
    );
};

const FractalShader = ({ audioDataRef }) => {
    const meshRef = useRef(null);

    useFrame(() => {
        if (!audioDataRef) return;

        const audioData = audioDataRef;
        
        meshRef.current.rotation.x += 0.01;
        meshRef.current.rotation.y += 0.01;
        meshRef.current.rotation.z += 0.01;
    });

    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[4, 4, 1]} />
            <meshBasicMaterial color={0x00ff00} />
        </mesh>
    );
}

export default FractalVisualizer;