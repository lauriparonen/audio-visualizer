/**
 * @fileoverview visualizer-page.js - AudioVisualizerPage component
 * Parent of FrequencyCanvas and ShaderCanvas
 * 
 * TODOS:
 * - optimize styling of the audio component cross-browser
 * > if that's not possible, redo the audio component by hand... 
 *   or just use a library like react-audio-player (if its customizable)
 *   (https://www.npmjs.com/package/react-audio-player)
 * - incorporate audio sources other than files (e.g. microphone, sc link, etc.)
 * 
 */

import React, { useState, useRef, forwardRef } from 'react';
import FrequencyCanvas from './FrequencyCanvas/frequency-canvas';
import ShaderCanvas from './ShaderCanvas/shader-canvas';
import styles from './styles.css';

const AudioVisualizerPage = () => {

 // const [selectedVisualizer, setSelectedVisualizer] = useState('ShaderCanvas');
  
  const [file, setFile] = useState(null);

  const onChangeFile = (e) => {
    setFile(e.target.files[0]);
  };

  file && console.log('file: ', file);

  // Create a reference to the audio element, 
  // which will be used to play the selected file
  // This is passed to the child components
  // as a prop, so they can play the same audio
  const audioRef = useRef(null);

  // When a file is selected, pass it to both canvases
  return (
    <div className='canvases'>

      <input
        className='file-input'
        type="file"
        accept="audio/*"
        onChange={onChangeFile}        
      />
    <audio
      ref={audioRef}
      src={file && window.URL.createObjectURL(file)}
      controls hidden
    />
    
      <div className="shader-canvas-container">

        {file && (
        <ShaderCanvas 
          file={file} 
          audioRef={audioRef}
          src={window.URL.createObjectURL(file)}
          />
        )}
      </div>

      <div className="freq-canvas-container">
      {file &&  (
        <FrequencyCanvas 
          file={file} 
          audioRef={audioRef}
          src={window.URL.createObjectURL(file)}
          />
        )}
      </div>
      
    </div>
  );
};

export default AudioVisualizerPage;
