
// water level 2nd pass
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D rangeMap;
uniform sampler2D waterHeightMap;
uniform vec4 range;
uniform float iTime;
uniform int iFrame;
vec2 readHeight(ivec2 p) {
    p = clamp(p, ivec2(0), ivec2(textureSize - 1));
    return texelFetch(iChannel0, p, 0).xy;
}

vec4 readOutFlow(ivec2 p) {
    if(p.x < 0 || p.y < 0 || p.x >= textureSize || p.y >= textureSize)
        return vec4(0);
    return texelFetch(iChannel1, p, 0);
}

float readCanFLow(ivec2 p) {
    int sum = 0;
    for(int i = -radius; i <= radius; i++) for(int j = -radius; j <= radius; j++) {
            if(texelFetch(rangeMap, p + ivec2(i, j), 0).r != 0.)
                sum++;
        }
    if(sum > radius * radius / 2)
        return 1.;
    return 0.;
}

void main() {
   // Outside ?
    if(max(gl_FragCoord.x, gl_FragCoord.y) > float(textureSize))
        discard;

    vec2 uv = gl_FragCoord.xy / float(textureSize);
   // Water
    ivec2 p = ivec2(gl_FragCoord.xy);
    vec2 height = readHeight(p);
    vec4 OutFlow = texelFetch(iChannel1, p, 0);
    float totalOutFlow = OutFlow.x + OutFlow.y + OutFlow.z + OutFlow.w;
    float totalInFlow = 0.0;
    totalInFlow += readOutFlow(p + ivec2(1, 0)).z;
    totalInFlow += readOutFlow(p + ivec2(0, 1)).w;
    totalInFlow += readOutFlow(p + ivec2(-1, 0)).x;
    totalInFlow += readOutFlow(p + ivec2(0, -1)).y;

    // float debris = texelFetch(waterHeightMap, p, 0).r * 5. / heightRange;
    float debris = texture(waterHeightMap, uv).r * (range.y - range.x) / heightRange;
    float waterDept = height.y - totalOutFlow + totalInFlow;
    if(waterDept < debris)
        waterDept = debris;

    float canFlow = readCanFLow(p);

    float fortranData = blur(waterHeightMap, p).r;

    out_FragColor = vec4(height.x, waterDept, canFlow, fortranData);
}