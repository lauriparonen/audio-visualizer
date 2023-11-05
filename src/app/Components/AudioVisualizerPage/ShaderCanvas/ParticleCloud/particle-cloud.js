

import React, { useRef, useEffect, useMemo, useState } from "react";
import { extend } from "@react-three/fiber";
import { Canvas, useFrame } from "@react-three/fiber";
import { Box, OrbitControls, Points } from "@react-three/drei";
extend({ Canvas, Box, OrbitControls, Points });

import * as THREE from "three";

import { createNoise3D } from "simplex-noise";

/**
 * @function PointsComponent
 * 
 * Renders a cloud of particles that change position, size and color according to the audio data.
 * 
 * 
 */

const particleCloudVS = `

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

const particleCloudFS = `

    uniform float u_time;
    uniform vec2 u_resolution;
    uniform sampler2D u_audioData;

    uniform vec3 color1;
    uniform vec3 color2;

    void main() {
        //vec3 color1 = vec3(1.0, 0.0, 0.0);
        //vec3 color2 = vec3(0.0, 0.654, 0.0);

        //float audioData = texture2D(u_audioData, vec2(gl_PointCoord.x, 0.5)).r;
        float audioData = texture2D(u_audioData, vec2(gl_PointCoord.x, 0.5)).r;

        vec3 color = mix(color1, color2, audioData);

        gl_FragColor = vec4(color, 1.0);
        gl_FragColor += abs(sin(audioData * 2.0) * 1.2); // alter the colors per the audio data
        //gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // red color
    }
`;

const ParticleComponent = ({ audioRef, color1, color2 }) => {    

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
       
        const geometry = new THREE.BufferGeometry(); 
        const count = 8000; // number of particles
        const positions = new Float32Array(count * 3); // Multiply by 3 for x, y, z coordinates
        const vertexIndices = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 10; // Randomly distribute particles in x
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10; // Randomly distribute particles in y
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // Randomly distribute particles in z
            vertexIndices[i] = i;
          }
        
          geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
          geometry.setAttribute('vertexIndex', new THREE.BufferAttribute(vertexIndices, 1));
        
          return geometry;
        }, []);

        /* simplex noise for more natural distribution of particles 
        const noise3D = createNoise3D();

        for (let i = 0; i < count; i++) {
            const noise = noise3D(i / 100, i / 100, i / 100);
        
            positions[i * 3] = (Math.random() * 3 - 1 + noise) * 10; 
            positions[i * 3 + 1] = (Math.random() * 3 - 0.5 + noise) * 10;
            positions[i * 3 + 2] = (Math.random() * 3 - 0.5 + noise) * 20;
            vertexIndices[i] = i;
          }
        
          geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
          geometry.setAttribute('vertexIndex', new THREE.BufferAttribute(vertexIndices, 1));
        
          return geometry;
        }, []);
        */
        
        /*
        // this is for making a sierpinski triangle for later use
        const vertices = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(10, 20, 0),
            new THREE.Vector3(15, 0, 10),

        ];

        let currentPos = new THREE.Vector3(0, 0, 0);

        for (let i = 0; i < count; i++) {
            // choose a random vertex
            const vertex = vertices[Math.floor(Math.random() * vertices.length)];

            // move halfway to the chosen vertex
            currentPos.addVectors(currentPos, vertex).divideScalar(2);

            positions[i * 3] = currentPos.x;
            positions[i * 3 + 1] = currentPos.y;
            positions[i * 3 + 2] = currentPos.z;
            vertexIndices[i] = i;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('vertexIndex', new THREE.BufferAttribute(vertexIndices, 1));

        return geometry;
        */


    const uniforms = useMemo(() => ({
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2() },
        u_audioData: { value: null },
        color1: { value: new THREE.Vector3(...color1) },
        color2: { value: new THREE.Vector3(...color2) },
    }), [color1, color2]);

    useFrame(({ clock, size }) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += 0.0001;
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

        //dataTexture.dispose();
    });

  
    return (
      <points ref={meshRef}>
        <primitive attach="geometry" object={geometry} />
        <shaderMaterial 
            attach="material" 
            args={[{ uniforms }]}
            vertexShader={particleCloudVS} 
            fragmentShader={particleCloudFS}

             
        />
      </points>
    );
  };


/**
 * @function ParticleCloud
 * 
 * @param {*} props the audioRef, src, and file props fom the parent component (VisualizerPage)
 * @returns the main visualizer component
 */
const ParticleCloud = (props) => {
    const { audioRef, src } = props;
    const [color1, setColor1] = useState([0.0, 0.0, 1.0]);
    const [color2, setColor2] = useState([1.0, 0.0, 0.0]);

    return (
        <div className="point-sphere">
            <Canvas camera={{ position: [1.0, 1.5, 1.0]}}>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                {/* <VisualizerMesh material={material} /> */}
                <ParticleComponent 
                    audioRef={audioRef} 
                    color1={color1}
                    color2={color2}
                    />
                <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    minDistance={1} // start from 1
                    maxDistance={6} // keep the camera inside the cube
                    />
            </Canvas>
            <audio src={src} ref={audioRef} />

        </div>
       
    );

};

export default ParticleCloud;
