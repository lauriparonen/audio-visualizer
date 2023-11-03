/**
 * @fileoverview fractal-visualizer.js - fractal visualizer component
 * 
 * TODOS:
 * - add more shapes
 * - link the canvas to the audio DONE
 * - Render the canvas as the window is opened ? maybe not
 * - Connect the shader uniforms and values to sliders and other inputs
 *      -> these will be a dropdown menu with a list of options
 * - add full screen button
 * 
 * ideas:
 * - use laminar flow in one visual's texture
 * 
 */

import React, { useRef, useEffect, useMemo, useState } from "react";
import { extend } from "@react-three/fiber";
import { Canvas, useFrame } from "@react-three/fiber";
import { Box, OrbitControls, Points } from "@react-three/drei";
extend({ Canvas, Box, OrbitControls, Points });

import * as THREE from "three";


/**
 * @function PointsComponent
 * 
 * WIP
 * 
 * One of the visualizers
 * 
 * Renders a slowly rotating shape (currently a sphere) with points as material.
 * 
 * Initially, red points are evenly distributed across the surface of the sphere.
 * 
 * The points change position, size and color according to the audio data.
 * 
 * pointsVS and pointsFS are the shaders for this component
 * 
 * TODO:
 * - there's an issue with the gain of the audio data;
 *   sometimes it overflows and the audio becomes distorted
 *   -> it needs to be normalized 
 */

const pointsVS = `

    attribute float vertexIndex;

    uniform float u_time;
    uniform vec2 u_resolution;
    uniform sampler2D u_audioData;


    void main() {
 

        // Play around with the vertexIndex to get different effects
        // eg. when n at vec2(vertexIndex / n) is negative,
        // the shape expands and shrinks in unison;
        // when positive, the dots jump around individually according to the frequency data
        float audioData = texture2D(u_audioData, vec2(vertexIndex / -2048.0, 0.5)).r;
        // float audioData = texture2D(u_audioData, vec2(vertexIndex / 2048.0, 0.5)).r;

        vec3 newPosition = position + normalize(position) * audioData * 0.6;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

        // This changes the size of the points with the sin of the vertexIndex
        // resulting in a spiral effect across the sphere
        gl_PointSize = sin(vertexIndex *0.6) * 3.0;

        // and this causes the spiral to appear only when the audio is playing
        gl_PointSize *= sin(audioData * 1.01) * 1.5; // edit the coefficient to change sensitivity

        //gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        //gl_PointSize = 2.0 + sin(vertexIndex * 50.1);
        //gl_PointSize += sin(u_time * 2.0) * 2.0;
    }
`;

const pointsFS = `

    uniform float u_time;
    uniform vec2 u_resolution;
    uniform sampler2D u_audioData;

    void main() {
        vec3 color1 = vec3(1.0, 0.0, 0.0);
        vec3 color2 = vec3(0.0, 0.654, 0.0);

        //float audioData = texture2D(u_audioData, vec2(gl_PointCoord.x, 0.5)).r;
        float audioData = texture2D(u_audioData, vec2(gl_PointCoord.x, 0.5)).r;

        vec3 color = mix(color1, color2, audioData);

        gl_FragColor = vec4(color, 1.0);
        gl_FragColor += abs(sin(audioData * 2.0) * 1.2); // alter the colors per the audio data
        //gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // red color
    }
`;

const PointsComponent = ({ audioRef }) => {    
    const meshRef = useRef();

    const audioAnalyzer = useMemo(() => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const audioSource = audioContext.createMediaElementSource(audioRef.current);
        const audioAnalyzer = audioContext.createAnalyser();
        const gainNode = audioContext.createGain();
        audioSource.connect(audioAnalyzer);
        audioSource.connect(audioContext.destination);
        audioSource.connect(gainNode);
        gainNode.connect(audioContext.destination);
        gainNode.gain.value = 0.5;
        return audioAnalyzer;
    }, [audioRef]);

    const frequencyData = useMemo(() => new Uint8Array(audioAnalyzer.frequencyBinCount), [audioAnalyzer]);
  
    const geometry = useMemo(() => {
        // edit the number of points w the last two args of the SphereGeometry constructor
        // (the first is the radius, the last two are width and height segments)
        const geometry = new THREE.SphereGeometry(1, 64, 64); 
        const vertexIndices = [...Array(geometry.getAttribute('position').count).keys()];
        geometry.setAttribute('vertexIndex', new THREE.Float32BufferAttribute(vertexIndices, 1));
        return geometry;
    }, []);

    const uniforms = useMemo(() => ({
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2() },
        u_audioData: { value: null },
    }), []);

    useFrame(({ clock, size }) => {
        if (meshRef.current) {
            //meshRef.current.rotation.x += 0.001;
            meshRef.current.rotation.y += 0.001;
        }

        audioAnalyzer.getByteFrequencyData(frequencyData);
        const dataTexture = new THREE.DataTexture(
            frequencyData,
            frequencyData.length,
            1,
            THREE.RedFormat,
            THREE.UnsignedByteType,
            THREE.UnsignedByteType
        );
        dataTexture.needsUpdate = true;

        uniforms.u_time.value = clock.getElapsedTime();
        uniforms.u_resolution.value.set(size.width, size.height);
        uniforms.u_audioData.value = dataTexture;
    });

  
    return (
      <points ref={meshRef}>
        <primitive attach="geometry" object={geometry} />
        <shaderMaterial 
            attach="material" 
            args={[{ uniforms }]}
            vertexShader={pointsVS} 
            fragmentShader={pointsFS}

             
        />
      </points>
    );
  };


/**
 * @function FractalVisualizer
 * Handles the audio analysis and shader material.
 * 
 * @param {*} props the audioRef, src, and file props fom the parent component (VisualizerPage)
 * @returns the main visualizer component
 */
const FractalVisualizer = (props) => {
    const { audioRef, src } = props;

    return (
        <div className="fractal-visualizer">
            <Canvas camera={{ position: [1.0, 1.5, 1.0]}}>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                {/* <VisualizerMesh material={material} /> */}
                <PointsComponent audioRef={audioRef} />
                <OrbitControls />
            </Canvas>
            <audio src={src} ref={audioRef} />
        </div>
       
    );

};

export default FractalVisualizer;
