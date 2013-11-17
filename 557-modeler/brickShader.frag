uniform vec3 BrickColor = vec3(1.0,0.3,0.2);
uniform vec3 MortarColor = vec3(0.85,0.86,0.84); 
uniform vec2 BrickSize = vec2(0.3,0.15); 
uniform vec2 BrickPct = vec2(0.90,0.85); 
varying vec2 MCposition; 
varying float LightIntensity; 
varying vec3 N;
varying vec3 v;


void main() 
{ 
	vec3 color; 
	vec2 position, useBrick; 
	position = MCposition / BrickSize; 
	if (fract(position.y * 0.5) > 0.5) 
	position.x += 0.5; 
	position = fract(position); 
	useBrick = step(position, BrickPct); 
	color = mix(MortarColor, BrickColor, useBrick.x * useBrick.y); 
	color *= LightIntensity;
	// assign final color
	gl_FragColor = vec4(color,1.0); 
}

// Fragment shader for per-pixel Phong interpolation and shading.
// The "varying" keyword means that the parameter's value is interpolated
// between the nearby vertices.
