#version 120

// You May Use The Following Functions As RenderMaterial Input
// vec4 getDiffuseColor(vec2 uv)
// vec4 getNormalColor(vec2 uv)
// vec4 getSpecularColor(vec2 uv)

// Lighting Information
const int MAX_LIGHTS = 16;
uniform int numLights;
uniform vec3 lightIntensity[MAX_LIGHTS];
uniform vec3 lightPosition[MAX_LIGHTS];
uniform vec3 ambientLightIntensity;

// Camera Information
uniform vec3 worldCam;
uniform float exposure;

// Shading Information
uniform float shininess;

varying vec2 fUV;
varying vec3 fN; 
varying vec4 worldPos; 


void main() {
	int i = 0;	
	vec4 finalColor = vec4(0.0, 0.0, 0.0, 0.0);
	vec3 N = normalize(fN);
	vec3 V = normalize(worldCam - worldPos.xyz);
	
	// Gooch Shading
	float alpha = 0.25;
	float beta = 0.5;
	float b = 0.55;
	float y = 0.4;
	
	vec3 k_d = getDiffuseColor(fUV).xyz;
	vec3 k_cool = vec3(0, 0, b) + alpha * k_d; 
	vec3 k_warm = vec3(y, y, 0) + beta * k_d;
	
	// Calculate the warmth constant k_w
	vec3 L = normalize(lightPosition[i] - worldPos.xyz); 
	float k_w = (1 + dot(N,L)) / 2;
	
	// Add to final color
	finalColor += vec4(k_w * k_warm + (1 - k_w) * k_cool, 0.0);
	
	// Add in highlights
	vec3 H = normalize(L + V);
	vec4 Ispec = getSpecularColor(fUV) * pow(max(dot(N, H), 0.0), 50);
	Ispec = clamp(Ispec, 0.0, 1.0);
	finalColor += Ispec;
	
	gl_FragColor = finalColor; 
}