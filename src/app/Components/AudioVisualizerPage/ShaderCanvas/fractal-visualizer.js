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
import { Box, OrbitControls, Points } from "@react-three/drei";
extend({ Canvas, Box, OrbitControls, Points });

import fragmentShader from "./fragment-shader";
import vertexShader from "./vertex-shader";

import * as THREE from "three";

/**
 * Basic plane mesh with shader material
 * 
 * @param {*} param0 
 * @returns 
 */
const VisualizerMesh = ({ material }) => {
    /*
    const meshRef = useRef(null);

    useFrame(({ clock }) => {
        if (meshRef.current) {
            meshRef.current.material.uniforms.u_time.value = clock.getElapsedTime();
        }
    });
    */
   const pointsRef = useRef(null);

   useEffect(() => {
    if (pointsRef.current) {
        const geometry = new THREE.SphereGeometry(1, 32, 32);

        // Create a Float32Array of vertex indices
        const vertexIndices = new Float32Array(geometry.getAttribute('position').count);

        // Fill the array with the index of each vertex
        for (let i = 0; i < vertexIndices.length; i++) {
            vertexIndices[i] = i;
        }

        console.log('vertexIndices', vertexIndices);

        // Add the vertexIndices as an attribute to the geometry
        geometry.setAttribute('vertexIndex', new THREE.BufferAttribute(vertexIndices, 1));

        pointsRef.current.geometry = geometry;
    }
}, []);

useFrame(({ clock }) => {
    if (pointsRef.current) {
        pointsRef.current.material.uniforms.u_time.value = clock.getElapsedTime();
    }
});
    

    console.log('material', material);

    return (
        <Points ref={pointsRef} position={[0, 0, 0]}>
        <sphereGeometry attach="geometry" args={[1, 32, 32]} />
        <primitive attach="material" object={material} />
    </Points>
    );

    /*
    return (
        <mesh ref={meshRef} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} >
            <sphereGeometry 
                attach="geometry" 
                args={[1, 32, 32]} 
                />
            <primitive attach="material" object={material} />
        </mesh>
    );
    */
};

/**
 * @function PointsComponent
 * 
 * WIP
 * 
 * One of the visualizers
 * 
 * Renders a shape (currently a circle) with points as material 
 * 
 * vertexShader2 and fragmentShader2 are the shaders for this component
 */

const vertexShader2 = `

    attribute float vertexIndex;

    uniform float u_time;
    uniform vec2 u_resolution;
    uniform sampler2D u_audioData;


    void main() {

        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = 2.0 + sin(vertexIndex * 50.1);
        gl_PointSize += sin(u_time * 2.0) * 2.0;
    }
`;

const fragmentShader2 = `

    uniform float u_time;
    uniform vec2 u_resolution;
    uniform sampler2D u_audioData;

    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // red color
    }
`;

const PointsComponent = () => {    
    const meshRef = useRef();
  
    const geometry = useMemo(() => {
        const geometry = new THREE.SphereGeometry(1, 32, 32);
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
            meshRef.current.rotation.x += 0.0001;
            meshRef.current.rotation.y += 0.0001;
        }

        uniforms.u_time.value = clock.getElapsedTime();
        uniforms.u_resolution.value.set(size.width, size.height);
    });

  
    return (
      <points ref={meshRef}>
        <primitive attach="geometry" object={geometry} />
        <shaderMaterial 
            attach="material" 
            args={[{ uniforms }]}
            vertexShader={vertexShader2} 
            fragmentShader={fragmentShader2}

             
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
            u_audioData: { value: null }, // init as null, will be updated later
            //colorA: { value: new THREE.Color(0x912, 0.191, 0.652) },
            //colorB: { value: new THREE.Color(0x100, 0.777, 0.052) },
            colorA: { value: new THREE.Color(0x7303c0) },
            colorB: { value: new THREE.Color(0xfdeff9) },

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
                {/* <VisualizerMesh material={material} /> */}
                <PointsComponent />
                <OrbitControls />
            </Canvas>
            <audio src={src} ref={audioRef} />
        </div>
       
    );

};

export default FractalVisualizer;
