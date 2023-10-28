/**
 * @fileoverview Page component
 * 
 * This is the main component of the application.
 */

"use client"

import Image from 'next/image'
import styles from './page.module.css'
import FrequencyCanvas from './Components/AudioVisualizerPage/FrequencyCanvas/frequency-canvas.js'
import ShaderCanvas from './Components/AudioVisualizerPage/ShaderCanvas/shader-canvas.js'
import AudioVisualizerPage from './Components/AudioVisualizerPage/visualizer-page'

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>audio vizzin</h1>

      <p className={styles.description}>
        {/* <code className={styles.code}>/src/app/page.js</code> */}
      </p>
      <div className="visualizer-page">
        <AudioVisualizerPage />
      {/*}
        <div className="shader-canvas-container">
            <ShaderCanvas /> 
        </div>

          <div className="freq-canvas-container">
            <FrequencyCanvas />
          </div>
      */}
      </div>
    </main>
  )
}
