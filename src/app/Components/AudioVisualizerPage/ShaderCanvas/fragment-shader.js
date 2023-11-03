const fragmentShader = `
  varying vec2 vUv;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform sampler2D u_audioData;
  
  uniform vec3 colorA;
  uniform vec3 colorB;

  void main() {

    // Get the frequency data at the current UV coordinates
    //float frequency = texture2D(u_audioData, vUv).r;

    // Interpolate between colorA and colorB based on the frequency and the vertical position
    //vec3 color = mix(colorA, colorB, vUv.y + frequency * 0.5);

    //gl_FragColor = vec4(color, 1.0);
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;

export default fragmentShader;