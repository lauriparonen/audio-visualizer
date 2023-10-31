const vertexShader = `
varying vec2 vUv;
uniform float u_time;
uniform float u_resolution;


void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.y += sin(modelPosition.x * 4.0 + u_time * 2.0) * 0.2;
    
    // Uncomment the code and hit the refresh button below for a more complex effect 🪄
    modelPosition.y += sin(modelPosition.z * 6.0 + u_time * 2.0) * 0.1;
  
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
  
    gl_Position = projectedPosition;
  }

`;

export default vertexShader;