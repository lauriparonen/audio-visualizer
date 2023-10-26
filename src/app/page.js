"use client"

import Image from 'next/image'
import styles from './page.module.css'
import FrequencyCanvas from './Components/FrequencyCanvas/frequency-canvas.js'

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>audio vizzin</h1>

      <p className={styles.description}>
        {/* <code className={styles.code}>/src/app/page.js</code> */}
      </p>

    <div className="shader-canvas-container">
        {/* <ShaderCanvas /> */}
        
      </div>

      <div className="freq-canvas-container">

        <FrequencyCanvas />
        </div>
    </main>
  )
}
