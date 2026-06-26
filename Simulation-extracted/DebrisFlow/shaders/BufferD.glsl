
// Update Outflow 2nd pass
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D waterHeightMap;
uniform sampler2D rangeMap;
uniform float iTime;
uniform int iFrame;
vec2 readHeight(ivec2 p) {
    p = clamp(p, ivec2(0), ivec2(textureSize - 1));
    return texelFetch(iChannel0, p, 0).xy;
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

float computeOutFlowDir(vec2 centerHeight, ivec2 pos) {
    if(readCanFLow(pos) == 0.)
        return 0.0;
    vec2 dirHeight = readHeight(pos);
    return max(0.0, (centerHeight.x + centerHeight.y) - (dirHeight.x + dirHeight.y));
}

void main() {
    ivec2 p = ivec2(gl_FragCoord.xy);

   // Outside ?
    if(max(p.x, p.y) > textureSize)
        discard;

    vec4 oOutFlow = texelFetch(iChannel1, p, 0);
    vec2 height = readHeight(p);
    vec4 nOutFlow;
    nOutFlow.x = computeOutFlowDir(height, p + ivec2(1, 0));
    nOutFlow.y = computeOutFlowDir(height, p + ivec2(0, 1));
    nOutFlow.z = computeOutFlowDir(height, p + ivec2(-1, 0));
    nOutFlow.w = computeOutFlowDir(height, p + ivec2(0, -1));
    nOutFlow = attenuation * oOutFlow + strenght * nOutFlow;
    float totalFlow = nOutFlow.x + nOutFlow.y + nOutFlow.z + nOutFlow.w;
    if(totalFlow > minTotalFlow) {
        if(height.y < totalFlow) {
            nOutFlow = nOutFlow * (height.y / totalFlow);
        }
    } else {
        nOutFlow = vec4(0);
    }

  //  if (readCanFLow(p) ==0.)nOutFlow = vec4(0);

    out_FragColor = nOutFlow;
}