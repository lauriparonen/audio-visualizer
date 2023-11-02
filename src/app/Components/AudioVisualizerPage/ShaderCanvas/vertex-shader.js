

// Gotten from:
// https://blog.maximeheckel.com/posts/the-study-of-shaders-with-react-three-fiber/
const vertexShader = `
varying vec2 vUv;
uniform float u_time;
uniform float u_resolution;
uniform sampler2D u_audioData;


void main() {

    vUv = uv;
    
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.y += sin(modelPosition.x * 4.0 + u_time * 2.0) * 0.2;
    
    modelPosition.y += sin(modelPosition.z * 6.0 + u_time * 2.0) * 0.1;
  
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
  
    gl_Position = projectedPosition;
  }

`;

export default vertexShader;