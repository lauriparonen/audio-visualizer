/**
 * @fileoverview Page component
 * 
 * This is the main component of the application.
 * 
 * IDEAS/TODOs:
 * - enable audio sources other than files (e.g. microphone, sc link, etc.)
 * - come up with a cool name for the app
 * - add a logo
 * - add the ability to save the visualizations as videos
 * - add components to alter the visualizations (e.g. color, shape, etc.)
 *   they should be interactive and update in real time
 * 
 */

"use client"

import Image from 'next/image'
import styles from './page.module.css'
import FrequencyCanvas from './Components/AudioVisualizerPage/FrequencyCanvas/frequency-canvas.js'
import ShaderCanvas from './Components/AudioVisualizerPage/ShaderCanvas/shader-canvas.js'
import AudioVisualizerPage from './Components/AudioVisualizerPage/visualizer-page'

import HeaderText from './Components/HeaderText'


export default function Home() {

  return (
    <main className={styles.main}>
       <h1>audio visualizer 🔮</h1>
       {/* / <HeaderText />   */}

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
