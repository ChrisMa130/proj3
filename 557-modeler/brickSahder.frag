uniform vec3 BrickColor = Vec3d(1.0,0.3,0.2);
uniform vec3 MortarColor = Vec3d(0.85,0.86,0.84); 
uniform vec2 BrickSize = Vec2d(0.3,0.15); 
uniform vec2 BrickPct = Vec2d(0.90,0.85); 
varying vec2 MCposition = Vec2d(0.0,0.0); 
varying float LightIntensity; 


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
	gl_FragColor = vec4(color, 1.0); 
}

// Fragment shader for per-pixel Phong interpolation and shading.
// The "varying" keyword means that the parameter's value is interpolated
// between the nearby vertices.
varying vec3 N;
varying vec3 v;

void main()
{
    // The scene's ambient light.
    vec4 ambient = gl_LightModel.ambient * gl_FrontMaterial.ambient;

	// The normal vectors is generally not normalized after being
	// interpolated across a triangle.  Here we normalize it.
	vec3 Normal = normalize(N);

	// Since the vertex is in eye space, the direction to the
	// viewer is simply the normalized vector from v to the
	// origin.
	vec3 Viewer = -normalize(v);

	// Get the lighting direction and normalize it.
	vec3 Light  = normalize(gl_LightSource[0].position.xyz);

	// Compute halfway vector
	vec3 Half = normalize(Viewer+Light);

	// Compute factor to prevent light leakage from below the
	// surface
	float B = 1.0;
	if(dot(Normal, Light)<0.0) B = 0.0;

	// Compute geometric terms of diffuse and specular
	float diffuseShade = max(dot(Normal, Light), 0.0);
	float specularShade = 
	  B * pow(max(dot(Half, Normal), 0.0), gl_FrontMaterial.shininess);

	// Compute product of geometric terms with material and
	// lighting values
	vec4 diffuse = diffuseShade * gl_FrontLightProduct[0].diffuse;
	vec4 specular = specularShade * gl_FrontLightProduct[0].specular;
	ambient += gl_FrontLightProduct[0].ambient;

	// add factors from pointlight..
	vec3 PLight = normalize(gl_LightSource[1].position.xyz);
	vec3 PHalf = normalize(Viewer+PLight);
	// attenuate depending on the distance...
	float distance = (gl_LightSource[1].position.xyz-v).length();
	float atten = 1/(gl_LightSource[1].attenA * distance * distance + glLightSource[1].attenB*distance + attenC);
	float PB=1.0;
	if(dot(Normal,PLight)<0.0) PB=0.0;
	float PdiffuseShade = max(dot(Normal, PLight),0.0);
	float PspecularShade = PB * pow( max ( dot(PHalf,Normal),0.0), gl_FrontMaterial.shiniess);
	diffuse += atten * PdiffuseShade * gl_FrontLightProduct[1].diffuse;
	specular += atten * PspecularShade * gl_FrontLightProduct[1].specular;
	
	ambient += gl_FrontLightProduct[1].ambient;

	// Assign final color
	gl_FragColor = ambient + diffuse + specular + gl_FrontMaterial.emission;
}
