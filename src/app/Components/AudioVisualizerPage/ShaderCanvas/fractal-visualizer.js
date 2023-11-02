/**
 * @fileoverview fractal-visualizer.js - fractal visualizer component
 * 
 * TODOS:
 * - add more shapes
 * - code the fractal
 * - link the canvas to the audio DONE
 * - Render the canvas as the window is opened
 * - Connect the shader uniforms and values to sliders and other inputs
 *      -> these will be a dropdown menu with a list of options
 * - add full screen button
 * 
 * ideas:
 * - use laminar flow in the visual's texture
 * 
 */

import React, { useRef, useEffect, useMemo, useState } from "react";
import { extend } from "@react-three/fiber";
import { Canvas, useFrame } from "@react-three/fiber";
import { Box, OrbitControls } from "@react-three/drei";
extend({ Canvas, Box, OrbitControls });

import fragmentShader from "./fragment-shader";
import vertexShader from "./vertex-shader";

import * as THREE from "three";

const VisualizerMesh = ({ material }) => {
    const meshRef = useRef(null);

    useFrame(({ clock }) => {
        if (meshRef.current) {
            meshRef.current.material.uniforms.u_time.value = clock.getElapsedTime();
        }
    });

    console.log('material', material);

    return (
        <mesh ref={meshRef} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={1.5} >
            <planeGeometry attach="geometry" args={[1, 1, 32, 32]} />
            <primitive attach="material" object={material} />
        </mesh>
    );
};

const FractalVisualizer = (props) => {
    const { audioRef, src, file } = props;
    const [material, setMaterial] = useState(null);

    console.log('audioRef', audioRef);
    console.log('src', src);
    console.log('file', file);

    useEffect(() => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const audioSource = audioContext.createMediaElementSource(audioRef.current);
        const audioAnalyzer = audioContext.createAnalyser();
        audioSource.connect(audioAnalyzer);
        audioSource.connect(audioContext.destination);

        const frequencyData = new Uint8Array(audioAnalyzer.frequencyBinCount);
        //audioAnalyzer.getByteFrequencyData(frequencyData);

        //console.log('frequencyData', frequencyData);

        const uniforms = {
            u_time: { value: 1.0 },
            u_resolution: { value: new THREE.Vector2() },
            u_audioData: { value: null } // init as null, will be updated later
        };

        const material = new THREE.ShaderMaterial({
            fragmentShader: fragmentShader,
            vertexShader: vertexShader,
            uniforms: uniforms,
        });

        setMaterial(material);

        const updateFrequencyData = () => {
            audioAnalyzer.getByteFrequencyData(frequencyData);
            //console.log('frequencyData', frequencyData);

            const dataTexture = new THREE.DataTexture(
                frequencyData,
                frequencyData.length,
                1,
                THREE.RedFormat, // use RedFormat instead of LuminanceFormat
                THREE.UnsignedByteType,
                THREE.UnsignedByteType
            );

            dataTexture.needsUpdate = true;
            material.uniforms.u_audioData.value = dataTexture; // update the material's uniform

            requestAnimationFrame(updateFrequencyData);
        };

        updateFrequencyData();
        
    }, [audioRef, src, file]);



    return (
        <div className="fractal-visualizer">
            <Canvas camera={{ position: [1.0, 1.5, 1.0]}}>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <VisualizerMesh material={material} />
                <OrbitControls />
            </Canvas>
            <audio src={src} ref={audioRef} />
        </div>
       
    );

};

export default FractalVisualizer;
