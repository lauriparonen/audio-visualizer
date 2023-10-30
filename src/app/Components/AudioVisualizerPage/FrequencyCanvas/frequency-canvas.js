/**
 * @fileoverview frequency-canvas.js - frequency canvas component
 * 
 * Component for the smaller canvas that displays the frequencies of the audio file.
 * 
 * based on this tutorial:
 * https://www.telerik.com/blogs/adding-audio-visualization-react-app-using-web-audio-api
 * 
 */

import React, { useRef, useEffect, forwardRef } from "react";
import styles from "./styles.css"

let animationController; 

const FrequencyCanvas = ( props ) => {
    const canvasRef = useRef(null);
    //const audioRef = useRef(null);
    const source = useRef(null);
    const analyzer = useRef(null);  

    const file = props.file;
    const audioRef = props.audioRef;
    const onPlay = props.onPlay;
    const onPause = props.onPause;
    const src = props.src;


    const handleAudioPlay = () => {
        const audioContext = new AudioContext();
        console.log("audioContext created for FrequencyCanvas");
            if (!source.current) {
                console.log("source.current not found, creating");
                source.current = audioContext.createMediaElementSource(audioRef.current);
                analyzer.current = audioContext.createAnalyser();
                source.current.connect(analyzer.current);
                analyzer.current.connect(audioContext.destination);
            }
            console.log("visualizeData() called (FrequencyCanvas)");
            visualizeData();
        };

    const visualizeData = () => {

        animationController = window.requestAnimationFrame(visualizeData);

        if (audioRef.current.paused) {
            return cancelAnimationFrame(animationController);
        }

        const songData = new Uint8Array(analyzer.current.frequencyBinCount);
        //const songData = new Uint8Array(140);
        analyzer.current.getByteFrequencyData(songData);
        
        const barWidth = 3;
        let start = 0;
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        for (let i = 0; i < songData.length; i++) {
            start = i*4;
            let gradient = ctx.createLinearGradient(
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height
            );
            gradient.addColorStop(0.2, "#7303c0");
            gradient.addColorStop(0.5, "#ec38bc");
            gradient.addColorStop(1.0, "#fdeff9");
            ctx.fillStyle = gradient;
            ctx.fillRect(start, canvasRef.current.height, barWidth, -songData[i*6])
        }
    }

    return (
        <div className="freq-canvas">
            <audio 
                ref={audioRef}
                onPlay={handleAudioPlay}
                src={src}
                controls
                 />
            <canvas ref={canvasRef} id="freq-canvas" />
        </div>
    );
   
};

export default FrequencyCanvas;

/*

// standalone version of FrequencyCanvas


import React, { useRef, useEffect } from "react";
import styles from "./styles.css"
import { FileReducer } from "../../Audio/file-reducer";
import { useDispatch, useSelector } from "react-redux";
import { getFile, setFile } from "../../Audio/store";



let animationController;
const audioContext = new AudioContext();
// send audio data to parent component
//const onAudioData = (data) => {
//    props.onAudioData(data);
//};


const FrequencyCanvas = ({ onSelectFile }) => {
    const [file, setFile] = React.useState(null);
    //const file = useSelector(getFile);
    //const dispatch = useDispatch();
    
    const canvasRef = useRef(null);
    const audioRef = useRef(null);
    const source = useRef(null);
    const analyzer = useRef(null);

    const handleFileSelect = ({ target: { files } }) => {
        if (files[0]) {
            setFile(files[0]);
            onSelectFile(files[0]);
        }
    };

    const handleAudioPlay = () => {

        if (!source.current) {
            source.current = audioContext.createMediaElementSource(audioRef.current);
            analyzer.current = audioContext.createAnalyser();
            source.current.connect(analyzer.current);
            analyzer.current.connect(audioContext.destination);
        }
        visualizeData();
    };

    const visualizeData = () => {
        animationController = window.requestAnimationFrame(visualizeData);
        if (audioRef.current.paused) {
            return cancelAnimationFrame(animationController);
        }

        const songData = new Uint8Array(analyzer.current.frequencyBinCount);
        //const songData = new Uint8Array(140);
        analyzer.current.getByteFrequencyData(songData);
        
        const barWidth = 3;
        let start = 0;
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        for (let i = 0; i < songData.length; i++) {
            start = i*4;
            let gradient = ctx.createLinearGradient(
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height
            );
            gradient.addColorStop(0.2, "#7303c0");
            gradient.addColorStop(0.5, "#ec38bc");
            gradient.addColorStop(1.0, "#fdeff9");
            ctx.fillStyle = gradient;
            ctx.fillRect(start, canvasRef.current.height, barWidth, -songData[i*6])
        }
    };

    return (
        <div className="freq-canvas">
            <input
                type="file"
                accept="audio/*"
                onChange={handleFileSelect}
            />
            {file && (
                <audio
                ref={audioRef}
                onPlay={handleAudioPlay}
                src={window.URL.createObjectURL(file)}
                controls
                />
            )}
            <canvas ref={canvasRef} id="freq-canvas" />
        </div>
    );
    
    };

export default FrequencyCanvas;

*/