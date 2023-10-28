/**
 * @fileoverview visualizer-page.js - AudioVisualizerPage component
 * Parent of FrequencyCanvas and ShaderCanvas
 * 
 * todo: fix cross-component file handling:
 * feed the same file to both canvases
 * so they will visualize the same audio file in unison 
 * in their own ways.
 * This could be done with useContext, but for now 
 * I'll try doing it through passing props down the tree.
 * forwardRef() might be useful here.
 */

import React, { useState, useRef } from 'react';
import FrequencyCanvas from './FrequencyCanvas/frequency-canvas';
import ShaderCanvas from './ShaderCanvas/shader-canvas';

const AudioVisualizerPage = () => {
  const [file, setFile] = useState(null);

  const audioRef = useRef(null);

    

  // When a file is selected, pass it to both canvases
  return (
    <div className='canvases'>
      <input
        type="file"
        accept="audio/*"
        onChange={
          ({ target: { files } }) => {
            files[0] && setFile(files[0]);
          }
        }
        // debug 
        //onInput={console.log('input')}
        
      />
      {/*
      {file && (
        <audio
          ref={audioRef}
          onPlay={handleAudioPlay}
          onPause={handleAudioPause}
          controls
          src={window.URL.createObjectURL(file)}
        />
      )}
      */}
      <FrequencyCanvas 
        file={file} 
        audioRef={audioRef}
        onPlay={FrequencyCanvas.handleAudioPlay}
        />
      {/* 
      <ShaderCanvas 
        file={file} 
        onSelectFile={handleFileSelect}
        audioRef={audioRef} />
      */}
    </div>
  );
};

export default AudioVisualizerPage;
