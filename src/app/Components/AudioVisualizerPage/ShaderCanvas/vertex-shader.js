

// Gotten from:
// https://blog.maximeheckel.com/posts/the-study-of-shaders-with-react-three-fiber/

const vertexShader = `
attribute float vertexIndex;
uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D u_audioData;
varying vec2 vUv;

void main() {
    vUv = uv;

    /*
    // Normalize the vertex index to [0, 1]
    float normalizedIndex = vertexIndex / float(10000.0);

    // Use the normalized index to sample the audio data texture
    float frequency = texture2D(u_audioData, vec2(normalizedIndex, 0.0)).r;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.xyz += normalize(modelPosition.xyz) * frequency * 0.2;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    gl_PointSize = 2.0;
    */
   
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = 2.0;
}

`;
/*
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
*/

export default vertexShader;