
// compute Terrain and update water level 1st pass
uniform sampler2D TerrainWaterMap;
uniform sampler2D OutFlow;
uniform sampler2D heightMap;
uniform sampler2D lakeMap;
uniform sampler2D rangeMap;
uniform sampler2D waterHeightMap;
uniform float iTime;
uniform int iFrame;
uniform vec4 waterAdd;
uniform vec2 resolution;
uniform vec4 range;

vec2 readHeight(ivec2 p) {
    p = clamp(p, ivec2(0), ivec2(ivec2(resolution) - 1));
    return texelFetch(TerrainWaterMap, p, 0).xy;
}

float readTerrain(ivec2 p) {
    p = clamp(p, ivec2(0), ivec2(ivec2(resolution) - 1));
    return texelFetch(heightMap, p, 0).r;
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

vec4 readOutFlow(ivec2 p) {
    if(p.x < 0 || p.y < 0 || p.x >= ivec2(resolution).x || p.y >= ivec2(resolution).y)
        return vec4(0);
    return texelFetch(OutFlow, p, 0);
}

float readinitWater(ivec2 p) {
    int lakeRadius = 1;
    for(int i = -lakeRadius; i <= lakeRadius; i++) for(int j = -lakeRadius; j <= lakeRadius; j++) {
            if(texelFetch(lakeMap, p + ivec2(i, j), 0).r != 0.)
                return 1.;
        }
    return 0.;
}

void main() {
   // Outside ?
    if(max(gl_FragCoord.x, gl_FragCoord.y) > float(textureSize))
        discard;

   // Terrain
    vec2 uv = gl_FragCoord.xy / float(textureSize);
    float t = iTime / transitionTime;
    float terrainElevation = readTerrain(ivec2(gl_FragCoord.xy));
   // Water
    float waterDept = initialWaterLevel;
  //  if(terrainElevation<0.5) waterDept =  initialWaterLevel;
  //  else waterDept=0.;

    float canFlow;
    float fortranData;

    if(iFrame != 0) {
        ivec2 p = ivec2(gl_FragCoord.xy);
        vec2 height = readHeight(p);
        vec4 OutFlow = texelFetch(OutFlow, p, 0);
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

        if(readinitWater(p) != 0. && iFrame < 5)
            waterDept += 0.00002;

        canFlow = readCanFLow(p);

        fortranData = blur(waterHeightMap, p).r;
    }

    out_FragColor = vec4(terrainElevation, waterDept, canFlow, fortranData);
}