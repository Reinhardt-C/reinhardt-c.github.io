#ifdef GL_ES
precision mediump float;
#endif

#define MAX_STEPS 100
#define MAX_DIST 100.0
#define SURF_DIST 0.01
#define _SDF_ vec4(0)

uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_camera;
uniform vec3 u_dir;
uniform vec3 u_light;

vec4 Sphere(vec4 s, vec3 p, vec3 c) {
    return vec4(c, length(p - s.xyz) - s.w);
}

vec4 Box(vec3 b, vec3 d, vec3 p, vec3 c) {
    vec3 q = abs(p - b) - d;
    return vec4(
        c, 
        length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0)
    );
}

vec4 RoundBox(vec3 b, vec3 d, float r, vec3 p, vec3 c) {
    vec3 q = abs(p - b) - d + r;
    return vec4(
        c, 
        length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0) - r
    );
}

vec4 Union(vec4 o1, vec4 o2) {
    if (o1.w < o2.w) return vec4(o1.xyz, o1.w);
    else return vec4(o2.xyz, o2.w);
}

vec4 getDist(vec3 p) {
    return _SDF_;
}

vec3 getNormal(vec3 p) {
    float d = getDist(p).w;
    vec2 e = vec2(.01, 0);
    vec3 n = d - vec3(
        getDist(p - e.xyy).w,
        getDist(p - e.yxy).w,
        getDist(p - e.yyx).w
    );
    return normalize(n);
}

vec4 rayMarch(vec3 ro, vec3 rd) {
    float dO = 0.0;

    for (int i = 0; i < MAX_STEPS; i++) {
        vec3 p = ro + rd * dO;
        vec4 d = getDist(p);
        float dS = d.w;
        dO += dS;
        if (dO > MAX_DIST || dS < SURF_DIST) return vec4(d.xyz, dO);
    }

    return vec4(0.0, 0.0, 0.0, dO);
}

vec2 shadowMarch(vec3 ro, vec3 rd, float k) {
    float dO = 0.0;
    float res = 1.0;

    for (int i = 1; i < MAX_STEPS + 1; i++) {
        vec3 p = ro + rd * dO;
        float dS = getDist(p).w;
        dO += dS;
        res = min( res, k * dS / float(i) );
        if (dO > MAX_DIST || dS < SURF_DIST) return vec2(0.0, res);
    }

    return vec2(dO, res);
}

float getLight(vec3 p) {
    vec3 lightPos = u_light;
    vec3 l = normalize(lightPos - p);
    vec3 n = getNormal(p);
    float dif = clamp(dot(n, l), 0.08, 1.0);
    vec2 d = shadowMarch(
        p + n * SURF_DIST * 2.0, 
        l, 
        50.0
    );
    if (d.x < length(lightPos - p)) dif *= max(d.y, 0.2);
    return dif;
}

mat3 rotMat() {
    mat3 matx = mat3(
        vec3(1.0, 0.0, 0.0),
        vec3(0.0, cos(u_dir.x), -sin(u_dir.x)),
        vec3(0.0, sin(u_dir.x), cos(u_dir.x))
    );
    mat3 maty = mat3(
        vec3(cos(u_dir.y), 0.0, sin(u_dir.y)),
        vec3(0.0, 1.0, 0),
        vec3(-sin(u_dir.y), 0.0, cos(u_dir.y))
    );
    mat3 matz = mat3(
        vec3(cos(u_dir.z), -sin(u_dir.z), 0.0),
        vec3(sin(u_dir.z), cos(u_dir.z), 0.0),
        vec3(0.0, 0.0, 1.0)
    );

    return matx * maty * matz;
}

void main() {
    vec2 uv = ( gl_FragCoord.xy / u_resolution.xy ) * 2.0 - 1.0;
	uv.x *= u_resolution.x / u_resolution.y;
    vec3 color = vec3(1.0);
    vec3 ro = vec3(u_camera.x, u_camera.y, u_camera.z);
    vec3 rd = rotMat() * normalize(vec3(uv.x, uv.y, 1));

    vec4 d = rayMarch(ro, rd);
    
    vec3 p = ro + rd * d.w;
    float dif;
    if (getDist(p).w < SURF_DIST) dif = getLight(p);
    else dif = 0.0;

    color = d.xyz * vec3(dif);

    gl_FragColor = vec4(color, 1.0);
}