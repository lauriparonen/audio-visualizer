/**
 * @fileoverview fractal-visualizer.js - fractal visualizer component
 * ignore this file for now
 */

import React, { useRef, useEffect, useMemo } from "react";
import { extend } from "@react-three/fiber";
import { Canvas, useFrame } from "@react-three/fiber";
import { Box, OrbitControls } from "@react-three/drei";
extend({ Canvas, Box, OrbitControls });

import fragmentShader from "./fragment-shader";
import vertexShader from "./vertex-shader";

import * as THREE from "three";

//tring to draw a basic fractal first
var camera, scene, renderer;
var geometry, material, mesh;
var uniforms;

const aspect = window.innerWidth / window.innerHeight;


const Plane = () => {
    const ref = useRef(null);
    const uniforms = useMemo(
        () => ({
            u_time: { value: 1.0 },
            u_resolution: { value: new THREE.Vector2() },
        }),
        []
    );

    useFrame((state) => {
        ref.current.material.uniforms.u_time.value = state.clock.getElapsedTime();
    });

    return (
        <mesh ref={ref} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={1.5} >
            <planeGeometry args={[1, 1, 32, 32]} />
            <shaderMaterial
                fragmentShader={fragmentShader}
                vertexShader={vertexShader}
                uniforms={uniforms}
                wireframe
            />
        </mesh>
    );
};


const FractalVisualizer = (props) => {
    const meshRef = useRef(null);
    const audioRef = props.audioRef;
    const src = props.src;
    const file = props.file;
    

    console.log("FractalVisualizer props: ", props);

    // testing with a basic shape first
    return (
        <div className="fractal-visualizer">
            <Canvas camera={{ position: [1.0, 1.5, 1.0]}}>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <Plane />
                <OrbitControls />
            </Canvas>
        </div>


/*
    const uniforms = useMemo(
        () => {
            const uniforms = {
                u_time: { value: 1.0 },
                u_resolution: { value: new THREE.Vector2() },
            }
            console.log('uniforms', uniforms)
            return uniforms
        },
        []
    );
    

    return (
        <div className="fractal-visualizer">
            <Canvas>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <Box ref={meshRef} args={[1, 1, 1]} position={[0, 0, 0]}>
                    <meshStandardMaterial color={0x00ff00} />
                </Box>
                <OrbitControls />
                <mesh ref={meshRef}>
                    <shaderMaterial
                        fragmentShader={fragmentShader}
                        vertexShader={vertexShader}
                        uniforms={uniforms}
                    />
                </mesh>
            </Canvas>
        </div>
        */
    );
}




export default FractalVisualizer;
