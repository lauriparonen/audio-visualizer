/**
 * @fileoverview visualizer-page.js - AudioVisualizerPage component
 * Parent of FrequencyCanvas and ShaderCanvas
 * 
 */

import React, { useState, useRef, forwardRef } from 'react';
import FrequencyCanvas from './FrequencyCanvas/frequency-canvas';
import ShaderCanvas from './ShaderCanvas/shader-canvas';

const AudioVisualizerPage = () => {
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
        type="file"
        accept="audio/*"
        onChange={onChangeFile}        
      />
      {file && (
      <FrequencyCanvas 
        file={file} 
        audioRef={audioRef}
        src={window.URL.createObjectURL(file)}
        //onPlay={() => audioRef.current.play()}
        />
      )}
      {/* 
      <ShaderCanvas 
        file={file} 
        audioRef={audioRef}
        src={window.URL.createObjectURL(file)}
      */}
    </div>
  );
};

export default AudioVisualizerPage;
