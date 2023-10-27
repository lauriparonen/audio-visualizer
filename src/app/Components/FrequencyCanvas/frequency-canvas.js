/**
 * Component for the smaller canvas that displays the frequencies of the audio file.
 * 
 * based on this tutorial:
 * https://www.telerik.com/blogs/adding-audio-visualization-react-app-using-web-audio-api
 * 
 * @module FrequencyCanvas
 */

import React, { useRef, useEffect } from "react";
import styles from "./styles.css"



let animationController;

const FrequencyCanvas = (props) => {
    const [file, setFile] = React.useState(null);
    const canvasRef = useRef(null);
    const audioRef = useRef(null);
    const source = useRef(null);
    const analyzer = useRef(null);

    const handleAudioPlay = () => {
        let audioContext = new AudioContext();
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
                onChange={({ target: { files } }) => files[0] && setFile(files[0])}
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