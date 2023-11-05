/*

// an attempt to create 3D text
import { extend, useFrame } from "@react-three/fiber";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import helvetiker from "three/examples/fonts/helvetiker_regular.typeface.json"
import { useState, useEffect } from 'react';

extend({ TextGeometry });

import { Text3D } from '@react-three/drei';

export default function HeaderText() {

    // load font
    const font = new FontLoader().parse(helvetiker);

  return (
    <mesh position={[0, 4, 0]} rotation={[0, 0, 0]}>
      <Text3D
        font={font}
        fontSize={0.4}
        depth={0.2}
        color="gold"
      >
        audio visualizer
      </Text3D>
    </mesh>
  );
}
*/