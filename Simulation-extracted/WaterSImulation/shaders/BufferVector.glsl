// === Texture-driven vector field with "unmovable particle culling" ===

uniform float iTime;
uniform float iTimeDelta;
uniform int iFrame;
uniform vec2 resolution;
uniform sampler2D vectorMap;   // prev state: .xy = last pos, .z = tracer

// --- data texture (low-res grayscale) ---
uniform sampler2D dataTex;
uniform vec2 dataTexSize;   // pixel size of dataTex
uniform float dataThreshold; // mask threshold (0 => no data)
uniform float gradScale;     // gradient->speed scale
uniform int flowMode;      // 0:+∇S, 1:-∇S, 2:⊥LH, 3:⊥RH

// --- NEW: kill particles that cannot move (too small gradient/velocity) ---
uniform float vKillEps;      // e.g. 1e-4 ~ 1e-3 (tune to dataset)

const float pVel = 0.6;
const float decay = 0.01;
const float spawnRate = 0.005;
const int smpDst = 2;

const uvec4 shft = uvec4(14U, 15U, 16U, 17U);
const float imf = 1.0 / float(0xFFFFFFFFU);

vec2 invRes;
float frmAdj;

// hash (keep)
vec4 bjhash128(vec4 p0) {
    uvec4 p = floatBitsToUint(p0);
    p ^= p >> shft;
    p *= uvec4(0xEAF649A9U, 0x6AF649A9U, 0x050C2D35U, 0xAAF649A9U);
    p ^= p.yzwx ^ p.zwxy;
    p ^= p >> shft.yzwx;
    p *= uvec4(0x21F0AAADU, 0x0D0C2D35U, 0xE8F649A9U, 0xD30332D3U);
    p ^= p.yzwx ^ p.zwxy;
    return vec4(p ^ p >> shft.wxyz) * imf;
}

// mask sample (RGB equal grayscale)
float sampleMask(vec2 uv) {
    return texture(dataTex, uv).r;
}

// central diff gradient
vec2 gradientAt(vec2 uv) {
    vec2 t = 1.0 / dataTexSize;
    float l = texture(dataTex, uv - vec2(t.x, 0.0)).r;
    float r = texture(dataTex, uv + vec2(t.x, 0.0)).r;
    float d = texture(dataTex, uv - vec2(0.0, t.y)).r;
    float u = texture(dataTex, uv + vec2(0.0, t.y)).r;
    return 0.5 * vec2(r - l, u - d);
}

vec2 orientField(vec2 g) {
    if(flowMode == 1)
        return -g;
    if(flowMode == 2)
        return vec2(-g.y, g.x);
    if(flowMode == 3)
        return vec2(g.y, -g.x);
    return g;
}

// neighborhood backtrace (only from movable & valid-data sources)
vec2 sc(vec2 pos) {
    vec2 uvCenter = pos * invRes;
    if(sampleMask(uvCenter) <= dataThreshold)
        return vec2(0.0);

    for(int i = -smpDst; i <= smpDst; ++i) {
        for(int j = -smpDst; j <= smpDst; ++j) {
            vec2 spos = pos + vec2(i, j);
            vec2 suv = spos * invRes;

            // source must have data
            if(sampleMask(suv) <= dataThreshold)
                continue;

            // source must be able to move (non-trivial gradient)
            vec2 gS = orientField(gradientAt(suv));
            if(length(gS) <= vKillEps)
                continue;

            vec2 res = texture(vectorMap, suv).xy;
            if(all(lessThan(abs(res - pos), vec2(0.5))))
                return res;
        }
    }
    return vec2(0.0);
}

// particle step (culls unmovable ones)
vec3 ss(vec2 pos, vec2 scr) {
    vec2 uv = pos * invRes;

    // must be valid data region
    float mask = sampleMask(uv);
    if(mask <= dataThreshold)
        return vec3(0.0);

    // gradient-driven velocity
    vec2 g = orientField(gradientAt(uv));
    float glen = length(g);

    // --- KILL: cannot move if gradient too small ---
    if(glen <= vKillEps)
        return vec3(0.0);

    vec2 vdir = g / glen;
    vec2 v = vdir * (gradScale * glen) * pVel * frmAdj;

    // spawn only when the field is movable
    vec4 hash = bjhash128(vec4(pos, float(iFrame), 1.738765));
    if(hash.w <= spawnRate * frmAdj * 800.0 / resolution.x) {
        scr = pos + hash.xy;
    }

    // write next position and mark tracer = 1
    return any(greaterThan(scr, vec2(0.0))) ? vec3(scr + v, 1.0) : vec3(0.0);
}

void main() {
    frmAdj = min(1.0, 144.0 * iTimeDelta);
    invRes = 1.0 / resolution.xy;

    vec2 uv = gl_FragCoord.xy * invRes;
    float mask = sampleMask(uv);
    float rPrev = texture(vectorMap, uv).z;

    // base tracer decay / mask clear
    float r = (mask > dataThreshold) ? max(0.0, rPrev - decay * frmAdj) : 0.0;

    // backtrace only in data region
    vec2 scRes = (mask > dataThreshold) ? sc(gl_FragCoord.xy) : vec2(0.0);
    vec3 ssRes = ss(gl_FragCoord.xy, scRes);

    // only if a movable particle actually persisted this frame, set tracer to 1
    if(ssRes.b > 0.5)
        r = 1.0;

    out_FragColor = vec4(ssRes.xy, r, 1.0);
}
