import{g as T,p as O,b as R,R as u,C,d as H,c as z,a as D,e as b,f as I}from"./Util-BcXxY0A4.js";import"./index-CZ4DaCNY.js";const P=`// Render\r
const vec3 backgroundColor = vec3(0.2);\r
// Terrain\r
const float transitionTime = 5.0;\r
const float transitionPercent = 0.3;\r
const int octaves = 7;\r
// Water simulation\r
const float attenuation = 0.995;\r
const float strenght = 0.00525;\r
const float minTotalFlow = 0.00001;\r
const float initialWaterLevel = 0.;\r
const int radius = 0;\r
\r
mat2 rot(in float ang) {\r
  return mat2(cos(ang), -sin(ang), sin(ang), cos(ang));\r
}\r
\r
// hash from Dave_Hoskins https://www.shadertoy.com/view/4djSRW\r
float hash12(vec2 p) {\r
  vec3 p3 = fract(vec3(p.xyx) * .1031);\r
  p3 += dot(p3, p3.yzx + 33.33);\r
  return fract((p3.x + p3.y) * p3.z);\r
}\r
\r
float hash13(vec3 p3) {\r
  p3 = fract(p3 * .1031);\r
  p3 += dot(p3, p3.zyx + 31.32);\r
  return fract((p3.x + p3.y) * p3.z);\r
}\r
\r
// Box intersection by IQ https://iquilezles.org/articles/boxfunctions\r
\r
vec2 boxIntersection(in vec3 ro, in vec3 rd, in vec3 rad, out vec3 oN) {\r
  vec3 m = 1.0 / rd;\r
  vec3 n = m * ro;\r
  vec3 k = abs(m) * rad;\r
  vec3 t1 = -n - k;\r
  vec3 t2 = -n + k;\r
\r
  float tN = max(max(t1.x, t1.y), t1.z);\r
  float tF = min(min(t2.x, t2.y), t2.z);\r
\r
  if(tN > tF || tF < 0.0)\r
    return vec2(-1.0); // no intersection\r
\r
  oN = -sign(rd) * step(t1.yzx, t1.xyz) * step(t1.zxy, t1.xyz);\r
\r
  return vec2(tN, tF);\r
}\r
\r
vec2 hitBox(vec3 orig, vec3 dir) {\r
  const vec3 box_min = vec3(-0.5);\r
  const vec3 box_max = vec3(0.5);\r
  vec3 inv_dir = 1.0 / dir;\r
  vec3 tmin_tmp = (box_min - orig) * inv_dir;\r
  vec3 tmax_tmp = (box_max - orig) * inv_dir;\r
  vec3 tmin = min(tmin_tmp, tmax_tmp);\r
  vec3 tmax = max(tmin_tmp, tmax_tmp);\r
  float t0 = max(tmin.x, max(tmin.y, tmin.z));\r
  float t1 = min(tmax.x, min(tmax.y, tmax.z));\r
  return vec2(t0, t1);\r
}\r
\r
vec4 blur(sampler2D tex, ivec2 uv) {\r
  int offset = 1;\r
  // 左上\r
  vec4 color = texelFetch(tex, ivec2(uv.x - offset, uv.y - offset), 0) * 0.0947416;\r
  // 上\r
  color += texelFetch(tex, ivec2(uv.x, uv.y - offset), 0) * 0.118318;\r
  // 右上\r
  color += texelFetch(tex, ivec2(uv.x + offset, uv.y + offset), 0) * 0.0947416;\r
  // 左\r
  color += texelFetch(tex, ivec2(uv.x - offset, uv.y), 0) * 0.118318;\r
  // 中\r
  color += texelFetch(tex, ivec2(uv.x, uv.y), 0) * 0.147761;\r
  // 右\r
  color += texelFetch(tex, ivec2(uv.x + offset, uv.y), 0) * 0.118318;\r
  // 左下\r
  color += texelFetch(tex, ivec2(uv.x - offset, uv.y + offset), 0) * 0.0947416;\r
  // 下\r
  color += texelFetch(tex, ivec2(uv.x, uv.y + offset), 0) * 0.118318;\r
  // 右下\r
  color += texelFetch(tex, ivec2(uv.x + offset, uv.y - offset), 0) * 0.0947416;\r
\r
  return color;\r
}\r
\r
// vec3 getColorByValue(float v){\r
//     vec3 colorRamp[5];\r
//     colorRamp[0]=vec3(55., 149., 196.) / 255.;\r
//     colorRamp[1]=vec3(161., 194., 153.) / 255.;\r
//     colorRamp[2]=vec3(250., 250., 102.) / 255.;\r
//     colorRamp[3]=vec3(250., 146., 55.) / 255.;\r
//     colorRamp[4]=vec3(232., 24., 21.) / 255.;\r
//     return colorRamp[int(clamp(v/.2,0.,4.))];\r
// }\r
\r
// Fog by IQ https://iquilezles.org/articles/fog\r
\r
vec3 applyFog(in vec3 rgb, vec3 fogColor, in float distance) {\r
  float fogAmount = exp(-distance);\r
  return mix(fogColor, rgb, fogAmount);\r
}\r
\r
// 在5个颜色之间进行插值的函数\r
vec3 getColorByValue(float value) {\r
\r
  vec3 colorRamp[5];\r
  colorRamp[0] = vec3(140., 120., 90.) / 255.;\r
  colorRamp[1] = vec3(160., 130., 80.) / 255.;\r
  colorRamp[2] = vec3(140., 100., 55.) / 255.;\r
  colorRamp[3] = vec3(110., 70., 35.) / 255.;\r
  colorRamp[4] = vec3(70., 40., 20.) / 255.;\r
    // 将值限制在[0, 1]范围内\r
  value = clamp(value, 0.0, 1.0);\r
\r
    // 将值映射到[0, 4]的范围（5个颜色段有4个区间）\r
  float scaledValue = value * 4.0;\r
\r
    // 获取当前所在的区间索引\r
  int index = int(floor(scaledValue));\r
\r
    // 获取在当前区间内的插值因子\r
  float t = scaledValue - floor(scaledValue);\r
\r
    // 根据索引进行颜色插值\r
    // 使用if-else而不是动态数组索引，提高兼容性\r
  vec3 color1, color2;\r
\r
  if(index == 0) {\r
    color1 = colorRamp[0];\r
    color2 = colorRamp[1];\r
  } else if(index == 1) {\r
    color1 = colorRamp[1];\r
    color2 = colorRamp[2];\r
  } else if(index == 2) {\r
    color1 = colorRamp[2];\r
    color2 = colorRamp[3];\r
  } else { // index >= 3\r
    color1 = colorRamp[3];\r
    color2 = colorRamp[4];\r
  }\r
\r
    // 线性插值\r
  return mix(color1, color2, t);\r
}`,E=`\r
// compute Terrain and update water level 1st pass\r
uniform sampler2D TerrainWaterMap;\r
uniform sampler2D OutFlow;\r
uniform sampler2D heightMap;\r
uniform sampler2D lakeMap;\r
uniform sampler2D rangeMap;\r
uniform sampler2D waterHeightMap;\r
uniform float iTime;\r
uniform int iFrame;\r
uniform vec4 waterAdd;\r
uniform vec2 resolution;\r
uniform vec4 range;\r
\r
vec2 readHeight(ivec2 p) {\r
    p = clamp(p, ivec2(0), ivec2(ivec2(resolution) - 1));\r
    return texelFetch(TerrainWaterMap, p, 0).xy;\r
}\r
\r
float readTerrain(ivec2 p) {\r
    p = clamp(p, ivec2(0), ivec2(ivec2(resolution) - 1));\r
    return texelFetch(heightMap, p, 0).r;\r
}\r
\r
float readCanFLow(ivec2 p) {\r
    int sum = 0;\r
    for(int i = -radius; i <= radius; i++) for(int j = -radius; j <= radius; j++) {\r
            if(texelFetch(rangeMap, p + ivec2(i, j), 0).r != 0.)\r
                sum++;\r
        }\r
    if(sum > radius * radius / 2)\r
        return 1.;\r
    return 0.;\r
}\r
\r
vec4 readOutFlow(ivec2 p) {\r
    if(p.x < 0 || p.y < 0 || p.x >= ivec2(resolution).x || p.y >= ivec2(resolution).y)\r
        return vec4(0);\r
    return texelFetch(OutFlow, p, 0);\r
}\r
\r
float readinitWater(ivec2 p) {\r
    int lakeRadius = 1;\r
    for(int i = -lakeRadius; i <= lakeRadius; i++) for(int j = -lakeRadius; j <= lakeRadius; j++) {\r
            if(texelFetch(lakeMap, p + ivec2(i, j), 0).r != 0.)\r
                return 1.;\r
        }\r
    return 0.;\r
}\r
\r
void main() {\r
   // Outside ?\r
    if(max(gl_FragCoord.x, gl_FragCoord.y) > float(textureSize))\r
        discard;\r
\r
   // Terrain\r
    vec2 uv = gl_FragCoord.xy / float(textureSize);\r
    float t = iTime / transitionTime;\r
    float terrainElevation = readTerrain(ivec2(gl_FragCoord.xy));\r
   // Water\r
    float waterDept = initialWaterLevel;\r
  //  if(terrainElevation<0.5) waterDept =  initialWaterLevel;\r
  //  else waterDept=0.;\r
\r
    float canFlow;\r
    float fortranData;\r
\r
    if(iFrame != 0) {\r
        ivec2 p = ivec2(gl_FragCoord.xy);\r
        vec2 height = readHeight(p);\r
        vec4 OutFlow = texelFetch(OutFlow, p, 0);\r
        float totalOutFlow = OutFlow.x + OutFlow.y + OutFlow.z + OutFlow.w;\r
        float totalInFlow = 0.0;\r
        totalInFlow += readOutFlow(p + ivec2(1, 0)).z;\r
        totalInFlow += readOutFlow(p + ivec2(0, 1)).w;\r
        totalInFlow += readOutFlow(p + ivec2(-1, 0)).x;\r
        totalInFlow += readOutFlow(p + ivec2(0, -1)).y;\r
\r
        // float debris = texelFetch(waterHeightMap, p, 0).r * 5. / heightRange;\r
        float debris = texture(waterHeightMap, uv).r * (range.y - range.x) / heightRange;\r
\r
        float waterDept = height.y - totalOutFlow + totalInFlow;\r
        if(waterDept < debris)\r
            waterDept = debris;\r
\r
        if(readinitWater(p) != 0. && iFrame < 5)\r
            waterDept += 0.00002;\r
\r
        canFlow = readCanFLow(p);\r
\r
        fortranData = blur(waterHeightMap, p).r;\r
    }\r
\r
    out_FragColor = vec4(terrainElevation, waterDept, canFlow, fortranData);\r
}`,L=`\r
// Update Outflow 1st pass\r
uniform sampler2D iChannel0;\r
uniform sampler2D iChannel1;\r
uniform sampler2D waterHeightMap;\r
uniform sampler2D rangeMap;\r
uniform float iTime;\r
uniform int iFrame;\r
vec2 readHeight(ivec2 p) {\r
    p = clamp(p, ivec2(0), ivec2(textureSize - 1));\r
    return texelFetch(iChannel0, p, 0).xy;\r
}\r
\r
float readCanFLow(ivec2 p) {\r
    int sum = 0;\r
    for(int i = -radius; i <= radius; i++) for(int j = -radius; j <= radius; j++) {\r
            if(texelFetch(rangeMap, p + ivec2(i, j), 0).r != 0.)\r
                sum++;\r
        }\r
    if(sum > radius * radius / 2)\r
        return 1.;\r
    return 0.;\r
}\r
\r
float computeOutFlowDir(vec2 centerHeight, ivec2 pos) {\r
    if(readCanFLow(pos) == 0.)\r
        return 0.0;\r
    vec2 dirHeight = readHeight(pos);\r
    return max(0.0, (centerHeight.x + centerHeight.y) - (dirHeight.x + dirHeight.y));\r
}\r
\r
void main() {\r
    ivec2 p = ivec2(gl_FragCoord.xy);\r
   // Init to zero at frame 0\r
    if(iFrame == 0) {\r
        out_FragColor = vec4(0);\r
        return;\r
    }    \r
\r
   // Outside ?\r
    if(max(p.x, p.y) > textureSize)\r
        discard;\r
\r
    vec4 oOutFlow = texelFetch(iChannel1, p, 0);\r
    vec2 height = readHeight(p);\r
    vec4 nOutFlow;\r
    nOutFlow.x = computeOutFlowDir(height, p + ivec2(1, 0));\r
    nOutFlow.y = computeOutFlowDir(height, p + ivec2(0, 1));\r
    nOutFlow.z = computeOutFlowDir(height, p + ivec2(-1, 0));\r
    nOutFlow.w = computeOutFlowDir(height, p + ivec2(0, -1));\r
    nOutFlow = attenuation * oOutFlow + strenght * nOutFlow;\r
    float totalFlow = nOutFlow.x + nOutFlow.y + nOutFlow.z + nOutFlow.w;\r
    if(totalFlow > minTotalFlow) {\r
        if(height.y < totalFlow) {\r
            nOutFlow = nOutFlow * (height.y / totalFlow);\r
        }\r
    } else {\r
        nOutFlow = vec4(0);\r
    }\r
\r
  // if (readCanFLow(p) ==0.)nOutFlow = vec4(0);\r
\r
    out_FragColor = nOutFlow;\r
}`,V=`\r
// water level 2nd pass\r
uniform sampler2D iChannel0;\r
uniform sampler2D iChannel1;\r
uniform sampler2D rangeMap;\r
uniform sampler2D waterHeightMap;\r
uniform vec4 range;\r
uniform float iTime;\r
uniform int iFrame;\r
vec2 readHeight(ivec2 p) {\r
    p = clamp(p, ivec2(0), ivec2(textureSize - 1));\r
    return texelFetch(iChannel0, p, 0).xy;\r
}\r
\r
vec4 readOutFlow(ivec2 p) {\r
    if(p.x < 0 || p.y < 0 || p.x >= textureSize || p.y >= textureSize)\r
        return vec4(0);\r
    return texelFetch(iChannel1, p, 0);\r
}\r
\r
float readCanFLow(ivec2 p) {\r
    int sum = 0;\r
    for(int i = -radius; i <= radius; i++) for(int j = -radius; j <= radius; j++) {\r
            if(texelFetch(rangeMap, p + ivec2(i, j), 0).r != 0.)\r
                sum++;\r
        }\r
    if(sum > radius * radius / 2)\r
        return 1.;\r
    return 0.;\r
}\r
\r
void main() {\r
   // Outside ?\r
    if(max(gl_FragCoord.x, gl_FragCoord.y) > float(textureSize))\r
        discard;\r
\r
    vec2 uv = gl_FragCoord.xy / float(textureSize);\r
   // Water\r
    ivec2 p = ivec2(gl_FragCoord.xy);\r
    vec2 height = readHeight(p);\r
    vec4 OutFlow = texelFetch(iChannel1, p, 0);\r
    float totalOutFlow = OutFlow.x + OutFlow.y + OutFlow.z + OutFlow.w;\r
    float totalInFlow = 0.0;\r
    totalInFlow += readOutFlow(p + ivec2(1, 0)).z;\r
    totalInFlow += readOutFlow(p + ivec2(0, 1)).w;\r
    totalInFlow += readOutFlow(p + ivec2(-1, 0)).x;\r
    totalInFlow += readOutFlow(p + ivec2(0, -1)).y;\r
\r
    // float debris = texelFetch(waterHeightMap, p, 0).r * 5. / heightRange;\r
    float debris = texture(waterHeightMap, uv).r * (range.y - range.x) / heightRange;\r
    float waterDept = height.y - totalOutFlow + totalInFlow;\r
    if(waterDept < debris)\r
        waterDept = debris;\r
\r
    float canFlow = readCanFLow(p);\r
\r
    float fortranData = blur(waterHeightMap, p).r;\r
\r
    out_FragColor = vec4(height.x, waterDept, canFlow, fortranData);\r
}`,N=`\r
// Update Outflow 2nd pass\r
uniform sampler2D iChannel0;\r
uniform sampler2D iChannel1;\r
uniform sampler2D waterHeightMap;\r
uniform sampler2D rangeMap;\r
uniform float iTime;\r
uniform int iFrame;\r
vec2 readHeight(ivec2 p) {\r
    p = clamp(p, ivec2(0), ivec2(textureSize - 1));\r
    return texelFetch(iChannel0, p, 0).xy;\r
}\r
\r
float readCanFLow(ivec2 p) {\r
    int sum = 0;\r
    for(int i = -radius; i <= radius; i++) for(int j = -radius; j <= radius; j++) {\r
            if(texelFetch(rangeMap, p + ivec2(i, j), 0).r != 0.)\r
                sum++;\r
        }\r
    if(sum > radius * radius / 2)\r
        return 1.;\r
    return 0.;\r
}\r
\r
float computeOutFlowDir(vec2 centerHeight, ivec2 pos) {\r
    if(readCanFLow(pos) == 0.)\r
        return 0.0;\r
    vec2 dirHeight = readHeight(pos);\r
    return max(0.0, (centerHeight.x + centerHeight.y) - (dirHeight.x + dirHeight.y));\r
}\r
\r
void main() {\r
    ivec2 p = ivec2(gl_FragCoord.xy);\r
\r
   // Outside ?\r
    if(max(p.x, p.y) > textureSize)\r
        discard;\r
\r
    vec4 oOutFlow = texelFetch(iChannel1, p, 0);\r
    vec2 height = readHeight(p);\r
    vec4 nOutFlow;\r
    nOutFlow.x = computeOutFlowDir(height, p + ivec2(1, 0));\r
    nOutFlow.y = computeOutFlowDir(height, p + ivec2(0, 1));\r
    nOutFlow.z = computeOutFlowDir(height, p + ivec2(-1, 0));\r
    nOutFlow.w = computeOutFlowDir(height, p + ivec2(0, -1));\r
    nOutFlow = attenuation * oOutFlow + strenght * nOutFlow;\r
    float totalFlow = nOutFlow.x + nOutFlow.y + nOutFlow.z + nOutFlow.w;\r
    if(totalFlow > minTotalFlow) {\r
        if(height.y < totalFlow) {\r
            nOutFlow = nOutFlow * (height.y / totalFlow);\r
        }\r
    } else {\r
        nOutFlow = vec4(0);\r
    }\r
\r
  //  if (readCanFLow(p) ==0.)nOutFlow = vec4(0);\r
\r
    out_FragColor = nOutFlow;\r
}`,W=`uniform ivec2 rect;\r
uniform sampler2D rangeMap;\r
uniform sampler2D waterHeightMap;\r
void main() {\r
   // Outside ?\r
    if(max(gl_FragCoord.x, gl_FragCoord.y) > float(textureSize))\r
        discard;\r
\r
    ivec2 p = ivec2(gl_FragCoord.xy);\r
    ivec2 p2 = ivec2(gl_FragCoord.xy);\r
    if(rect.x > rect.y)\r
        p2.y -= (rect.x - rect.y) / 2;\r
    else\r
        p2.x -= (rect.y - rect.x) / 2;\r
    float canFlow = 0.;\r
    if(texelFetch(rangeMap, p, 0).r != 0.)\r
        canFlow = 1.;\r
    if(texelFetch(waterHeightMap, p2, 0).r != 0.)\r
        canFlow = 1.;\r
\r
    out_FragColor = vec4(vec3(canFlow), 1.);\r
}`,G=`\r
// Created by David Gallardo - xjorma/2021\r
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0\r
#define AA\r
#define GAMMA 1\r
uniform sampler2D iChannel0;\r
// uniform sampler2D iChannel1;\r
uniform sampler2D heightMap;\r
uniform sampler2D rangeMap;\r
uniform sampler2D waterHeightMap;\r
uniform sampler2D phase2;\r
uniform sampler2D phase3;\r
uniform vec4 waterColor;\r
uniform vec4 lightWaterColor;\r
uniform vec2 iResolution;\r
uniform float iTime;\r
uniform int iFrame;\r
uniform bool renderTerrain;\r
uniform bool renderHeatMap;\r
uniform bool renderOriginData;\r
uniform bool renderOriginData2;\r
uniform bool renderOriginData3;\r
in vec3 vo;\r
in vec3 vd;\r
in vec2 v_st;\r
const vec3 light = vec3(0., 4., 2.);\r
const float boxHeight = 0.45;\r
vec2 getHeight(in vec3 p) {\r
  //  p = (p + 1.0) * 0.5;\r
  p = p + .5;\r
  vec2 p2 = p.xz * vec2(float(textureSize)) / iResolution.xy;\r
  p2 = min(p2, vec2(float(textureSize) - 0.5) / iResolution.xy);\r
  vec2 h = texture(iChannel0, p2).xy;\r
  h.y += h.x;\r
  return h - boxHeight;\r
}\r
\r
vec2 getAttr(in vec3 p) {\r
  //  p = (p + 1.0) * 0.5;\r
  p = p + .5;\r
  vec2 p2 = p.xz * vec2(float(textureSize)) / iResolution.xy;\r
  p2 = min(p2, vec2(float(textureSize) - 0.5) / iResolution.xy);\r
  vec2 h = texture(iChannel0, p2).zw;\r
  return h;\r
}\r
\r
vec3 getNormal(in vec3 p, int comp) {\r
  float d = 2.0 / float(textureSize);\r
  //  float d = 2.0 / float(iResolution.xy);\r
  float hMid = getHeight(p)[comp];\r
  float hRight = getHeight(p + vec3(d, 0, 0))[comp];\r
  float hTop = getHeight(p + vec3(0, 0, d))[comp];\r
  return normalize(cross(vec3(0, hTop - hMid, d), vec3(d, hRight - hMid, 0)));\r
}\r
\r
vec4 terrainColor(in vec3 p, in vec3 n, out float spec) {\r
  //  spec = 0.1;\r
  //  vec3 c = vec3(0.21, 0.50, 0.07);\r
  //  float cliff = smoothstep(0.8, 0.3, n.y);\r
  //  c = mix(c, vec3(0.25), cliff);\r
  //  spec = mix(spec, 0.3, cliff);\r
  //  float snow = smoothstep(0.05, 0.25, p.y) * smoothstep(0.5, 0.7, n.y);\r
  //  c = mix(c, vec3(0.95, 0.95, 0.85), snow);\r
  //  spec = mix(spec, 0.4, snow);\r
  //  vec3 t = texture(iChannel1, p.xz * 5.0).xyz;\r
  //  return mix(c, c * t, 0.75);\r
  // return vec4(.22,.49,.91,1.);\r
  // return vec4(p.y);\r
  // return vec4(.62,.79,.91,1.);\r
  // return vec4(0.7176,0.5508,0.0703,1.);\r
  return lightWaterColor;\r
}\r
\r
vec3 undergroundColor(float d) {\r
  vec3 color[4] = vec3[](vec3(0.5, 0.45, 0.5), vec3(0.40, 0.35, 0.25), vec3(0.55, 0.50, 0.4), vec3(0.45, 0.30, 0.20));\r
  d *= 6.0;\r
  d = min(d, 3.0 - 0.001);\r
  float fr = fract(d);\r
  float fl = floor(d);\r
  return mix(color[int(fl)], color[int(fl) + 1], fr);\r
}\r
\r
vec4 Render(in vec3 ro, in vec3 rd) {\r
  vec3 n;\r
  vec3 rayDir = normalize(rd);\r
  vec2 ret = hitBox(ro, rayDir);\r
  if(ret.x > ret.y)\r
    discard;\r
  ret.x = max(ret.x, 0.0);\r
  vec3 p = ro + ret.x * rayDir;\r
\r
  if(ret.x > 0.0) {\r
    vec3 pi = ro + rd * ret.x;\r
    vec4 tc;\r
    vec3 tn;\r
    float tt = ret.x;\r
    vec2 h = getHeight(pi);\r
    float spec;\r
    if(pi.y < h.x) {\r
      tn = n;\r
      tc.xyz = undergroundColor(h.x - pi.y);\r
      tc.a = 0.;\r
    } else {\r
      for(int i = 0; i < 200; i++) {\r
        vec3 p = ro + rd * tt;\r
        float h = p.y - getHeight(p).x;\r
        if(h < 0.00002 || tt > ret.y)\r
          break;\r
        tt += h * 0.4 * .25;\r
      }\r
      tn = getNormal(ro + rd * tt, 0);\r
      tc = terrainColor(ro + rd * tt, tn, spec);\r
\r
          //  tc.xyz = getColorByValue(getHeight(ro + rd * tt).y);\r
    }\r
    {\r
      vec3 lightDir = normalize(light - (ro + rd * tt));\r
      tc.xyz = tc.xyz * (max(0.0, dot(lightDir, tn)) + 0.3);\r
      spec *= pow(max(0., dot(lightDir, reflect(rd, tn))), 10.0);\r
      tc.xyz += spec;\r
    }\r
    if(tt > ret.y) {\r
      tc.xyz = vec3(0, 0, 0.4);\r
    }\r
    float wt = ret.x;\r
    h = getHeight(pi);\r
    vec3 waterNormal;\r
    if(pi.y < h.y) {\r
      waterNormal = n;\r
    } else {\r
      for(int i = 0; i < 200; i++) {\r
        vec3 p = ro + rd * wt;\r
        float h = p.y - getHeight(p).y;\r
        if(h < 0.00002 || wt > min(tt, ret.y))\r
          break;\r
        wt += h * 0.4 * .25;\r
      }\r
      waterNormal = getNormal(ro + rd * wt, 1);\r
    }\r
    if(wt < ret.y) {\r
      float dist = (min(tt, ret.y) - wt);\r
      vec3 p = waterNormal;\r
      vec3 lightDir = normalize(light - (ro + rd * wt));\r
      tc.xyz = applyFog(tc.xyz, waterColor.xyz, dist * 15.0 * 17.);\r
      float spec = pow(max(0., dot(lightDir, reflect(rd, waterNormal))), 20.0);\r
      if(spec < .01)\r
        spec *= 5.;\r
    } else {\r
      discard;\r
    }\r
    float alpha = 1.;\r
\r
    float heatV = texture(waterHeightMap, (ro + rd * tt).xz + .5).x;\r
    // float heatV = texture(rangeMap, (ro + rd * tt).xz + .5).x;\r
\r
    if(renderOriginData3) {\r
      return texture(phase3, (ro + rd * tt).xz + .5);\r
    }\r
    if(renderOriginData2) {\r
      return texture(phase2, (ro + rd * tt).xz + .5);\r
    }\r
\r
    if(renderOriginData) {\r
          //  if(heatV < 0.00001 ) discard;\r
      return vec4(vec3(heatV), 1.);\r
    }\r
    if(renderHeatMap) {\r
      if(heatV < 0.00001)\r
        discard;\r
\r
      vec3 hColor = getColorByValue(heatV);\r
      float alpha = smoothstep(0.0, 1.0, heatV);\r
\r
      return vec4(hColor, alpha);\r
    }\r
\r
    if(!renderTerrain && (tt - wt) < 0.0008)\r
      tc.a = 0.;\r
    return tc;\r
  }\r
  discard;\r
}\r
\r
vec3 vignette(vec3 color, vec2 q, float v) {\r
  color *= 0.3 + 0.8 * pow(16.0 * q.x * q.y * (1.0 - q.x) * (1.0 - q.y), v);\r
  return color;\r
}\r
\r
void main() {\r
  // vec4 c = texture(rangeMap, v_st);\r
  // // out_FragColor = getVectorColor(v_st);\r
  // out_FragColor = vec4(c.xyz, 1.);\r
  // return;\r
\r
  vec3 tot = vec3(0.0);\r
  vec3 rayDir = normalize(vd);\r
  vec4 col = Render(vo, rayDir);\r
  tot += col.rgb;\r
  out_FragColor = vec4(tot, col.a);\r
}`,j=async(_,e)=>{const t=[];return e.forEach((n,r)=>{const i=new Promise((o,c)=>{if(n.height=_.scene.sampleHeight(n),!n.height)debugger;if(n.height==null)debugger;o(n),console.log("finshed:"+r)});t.push(i)}),Promise.all(t)};class U{constructor(e){this._viewer=e.viewer,this._width=e.width??1024,this._height=e.height??1024,this.cellSize=e.cellSize??30,this.rect=new Cesium.Cartesian2(e.rect[0],e.rect[1]),this._resolution=new Cesium.Cartesian2(this._width,this._height),this._waterAdd=new Cesium.Cartesian4(0,0,0,0),this.deepWaterColor=e.deepWaterColor??"#5C4225",this.lightWaterColor=e.lightWaterColor??"#B78C12",this.renderTerrain=e.renderTerrain??!1,this.renderHeatMap=e.renderHeatMap??!1,this.renderOriginData=e.renderOriginData??!1,this.renderOriginData2=e.renderOriginData2??!1,this.renderOriginData3=e.renderOriginData3??!1,this.LakeGeoJson=e.debrisJSON,this.lakeName=e.lakeName,this.range=new Cesium.Cartesian2(e.range[0],e.range[1]),this.dataSet=[],this.dataSet2=[],this.dataSet3=[],this.renderSpeed=1,this.preRender=e.preRender,this.postRender=e.postRender,this.onDataUpdate=e.onDataUpdate}async initBox(e){this.center=e.center;const t=this.lakeName=="YaAn"?YaAnHeight:await this.initTerrain(e.center,e.level);await this.genDemTexture(t),this.initShader(),await this.initTexture(),this.initFrameBuffer(),this.initRender()}initTerrain(e,t){const n=[];for(let r=0;r<this._height;r++)for(let i=0;i<this._width;i++){const o=[(i-this._width/2+.5)*this.cellSize,(r-this._height/2+.5)*this.cellSize],c=T(e,o);n.push(Cesium.Cartographic.fromCartesian(c))}return this.lakeName=="YaAn"?j(this._viewer,n):Cesium.sampleTerrain(this._viewer.terrainProvider,t,n)}genDemForModel(e){}loadImage(e){return new Promise((t,n)=>{const r=new Image;r.setAttribute("crossOrigin","anonymous"),r.src=e,r.onload=()=>{t(r)},r.onerror=()=>{n(new Error("图像加载失败"))}})}async genDemTexture(e){this.terrainData=e;const t=this._width,n=this._height,r=new Float32Array(t*n*4),i=new Float32Array(t*n*4);let o=0;const c=300,a=new ArrayBuffer(t*n*4),x=new ArrayBuffer(t*n*4),m=new ArrayBuffer(t*n*4),p=new ArrayBuffer(t*n*4),w=new DataView(a),v=new DataView(x),y=new DataView(m),s=new DataView(p);let l=0,g=999999;for(let f=0;f<n;f++)for(let d=0;d<t;d++){let h=f*t+d;l=Math.max(e[h].height,l),g=Math.min(e[h].height,g)}function M(f,d,h){return Math.min(Math.max(f,d),h)}for(let f=0;f<n;f++)for(let d=0;d<t;d++){let h=f*t+d,F=(n-1-f)*t+d;const B=M((e[h].height-g)/(l-g),0,1);r[h*4]=r[h*4+1]=r[h*4+2]=r[h*4+3]=B,w.setInt32(F*4,e[h].height,!1),s.setInt32(F*4,100,!1);const S=O([Cesium.Math.toDegrees(e[h].longitude),Cesium.Math.toDegrees(e[h].latitude)]);this.LakeGeoJson.features.forEach(A=>{R(S,A)&&(i[h*4]=i[h*4+1]=i[h*4+2]=i[h*4+3]=1,v.setInt32(F*4,80,!1),o<c&&(y.setInt32(F*4,10,!1),o++))})}this.demMap=u.createTexture({context:this._viewer.scene.context,width:this._width,height:this._height,pixelFormat:Cesium.PixelFormat.RGBA,pixelDatatype:Cesium.PixelDatatype.FLOAT,arrayBufferView:r}),this.lakeMap=u.createTexture({context:this._viewer.scene.context,width:this._width,height:this._height,pixelFormat:Cesium.PixelFormat.RGBA,pixelDatatype:Cesium.PixelDatatype.FLOAT,arrayBufferView:i}),this.waterHeightMap=u.createTexture({context:this._viewer.scene.context,width:this._width,height:this._height,pixelFormat:Cesium.PixelFormat.RGBA,pixelDatatype:Cesium.PixelDatatype.FLOAT,arrayBufferView:i}),this.phase2=u.createTexture({context:this._viewer.scene.context,width:this._width,height:this._height,pixelFormat:Cesium.PixelFormat.RGBA,pixelDatatype:Cesium.PixelDatatype.FLOAT,arrayBufferView:i}),this.phase3=u.createTexture({context:this._viewer.scene.context,width:this._width,height:this._height,pixelFormat:Cesium.PixelFormat.RGBA,pixelDatatype:Cesium.PixelDatatype.FLOAT,arrayBufferView:i}),this.rangeMap=u.createTexture({context:this._viewer.scene.context,width:this._width,height:this._height,pixelFormat:Cesium.PixelFormat.RGBA,pixelDatatype:Cesium.PixelDatatype.FLOAT,arrayBufferView:i}),this.rangeTempMap=u.createTexture({context:this._viewer.scene.context,width:this._width,height:this._height,pixelFormat:Cesium.PixelFormat.RGBA,pixelDatatype:Cesium.PixelDatatype.FLOAT,arrayBufferView:i}),this.max=l,this.min=g,this.texData=r,this.demBlob=new Blob([a],{type:"application/octet-stream"}),this.binghuBlob=new Blob([x],{type:"application/octet-stream"}),this.sourceBlob=new Blob([m],{type:"application/octet-stream"}),this.glacierBlob=new Blob([p],{type:"application/octet-stream"}),this.demBuffer=a,this.binghuBuffer=x,this.sourceBuffer=m,this.glacierBuffer=p}scaleDemTex(){const e=new Float32Array(this._width*this._height*4);for(let t=0;t<this._height;t++)for(let n=0;n<this._width;n++){const r=t*this._width+n,i=parseInt(t)*this._width+parseInt(n);e[r*4]=this.texData[i*4],e[r*4+1]=this.texData[i*4+1],e[r*4+2]=this.texData[i*4+2],e[r*4+3]=this.texData[i*4+3]}this.texData=e,this.demMap=u.createTexture({context:this._viewer.scene.context,width:this._width,height:this._height,pixelFormat:Cesium.PixelFormat.RGBA,pixelDatatype:Cesium.PixelDatatype.FLOAT,arrayBufferView:e})}initShader(){this.Command=`precision highp float;
      const int textureSize = `+this._width+`;
      const float heightRange = `+(this.max-this.min)+";"+P,this.BufferA=E,this.BufferB=L,this.BufferC=V,this.BufferD=N,this.renderShaderSource=G,this.bufferRange=W}async initTexture(){this.texA=u.createTexture({context:this._viewer.scene.context,width:this._width,height:this._height,pixelFormat:Cesium.PixelFormat.RGBA,pixelDatatype:Cesium.PixelDatatype.FLOAT,arrayBufferView:new Float32Array(this._width*this._height*4)}),this.texB=u.createTexture({context:this._viewer.scene.context,width:this._width,height:this._height,pixelFormat:Cesium.PixelFormat.RGBA,pixelDatatype:Cesium.PixelDatatype.FLOAT,arrayBufferView:new Float32Array(this._width*this._height*4)}),this.texC=u.createTexture({context:this._viewer.scene.context,width:this._width,height:this._height,pixelFormat:Cesium.PixelFormat.RGBA,pixelDatatype:Cesium.PixelDatatype.FLOAT,arrayBufferView:new Float32Array(this._width*this._height*4)}),this.texD=u.createTexture({context:this._viewer.scene.context,width:this._width,height:this._height,pixelFormat:Cesium.PixelFormat.RGBA,pixelDatatype:Cesium.PixelDatatype.FLOAT,arrayBufferView:new Float32Array(this._width*this._height*4)})}initFrameBuffer(){const e=this;this.quadGeometry=u.getFullscreenQuad(),this.Buffer_RangeT=new C({commandType:"Compute",uniformMap:{rect:()=>this.rect,rangeMap:()=>this.rangeMap,waterHeightMap:()=>this.waterHeightMap},fragmentShaderSource:new Cesium.ShaderSource({sources:[this.Command,this.bufferRange]}),geometry:this.quadGeometry,outputTexture:this.rangeTempMap,preExecute:function(){e.Buffer_RangeT.commandToExecute.outputTexture=e.rangeTempMap}}),this.Buffer_Range=new C({commandType:"Compute",uniformMap:{rect:()=>this.rect,rangeMap:()=>this.rangeTempMap,waterHeightMap:()=>this.waterHeightMap},fragmentShaderSource:new Cesium.ShaderSource({sources:[this.Command,this.bufferRange]}),geometry:this.quadGeometry,outputTexture:this.rangeMap,preExecute:function(){e.Buffer_Range.commandToExecute.outputTexture=e.rangeMap}}),this.Buffer_A=new C({commandType:"Compute",uniformMap:{iTime:()=>this.time,iFrame:()=>this.frame,waterAdd:()=>this._waterAdd,resolution:()=>this._resolution,range:()=>this.range,TerrainWaterMap:()=>this.texC,OutFlow:()=>this.texD,heightMap:()=>this.demMap,lakeMap:()=>this.lakeMap,rangeMap:()=>this.rangeMap,waterHeightMap:()=>this.waterHeightMap},fragmentShaderSource:new Cesium.ShaderSource({sources:[this.Command,this.BufferA]}),geometry:this.quadGeometry,outputTexture:this.texA,preExecute:function(){e.Buffer_A.commandToExecute.outputTexture=e.texA}}),this.Buffer_B=new C({commandType:"Compute",uniformMap:{iTime:()=>this.time,iFrame:()=>this.frame,resolution:()=>this._resolution,iChannel0:()=>this.texA,iChannel1:()=>this.texD,waterHeightMap:()=>this.waterHeightMap,rangeMap:()=>this.rangeMap},fragmentShaderSource:new Cesium.ShaderSource({sources:[this.Command,this.BufferB]}),geometry:this.quadGeometry,outputTexture:this.texB,preExecute:function(){e.Buffer_B.commandToExecute.outputTexture=e.texB}}),this.Buffer_C=new C({commandType:"Compute",uniformMap:{iTime:()=>this.time,iFrame:()=>this.frame,resolution:()=>this._resolution,range:()=>this.range,iChannel0:()=>this.texA,iChannel1:()=>this.texB,rangeMap:()=>this.rangeMap,waterHeightMap:()=>this.waterHeightMap},fragmentShaderSource:new Cesium.ShaderSource({sources:[this.Command,this.BufferC]}),geometry:this.quadGeometry,outputTexture:this.texC,preExecute:function(){e.Buffer_C.commandToExecute.outputTexture=e.texC}}),this.Buffer_D=new C({commandType:"Compute",uniformMap:{iTime:()=>this.time,iFrame:()=>this.frame,resolution:()=>this._resolution,iChannel0:()=>this.texC,iChannel1:()=>this.texB,waterHeightMap:()=>this.waterHeightMap,rangeMap:()=>this.rangeMap},fragmentShaderSource:new Cesium.ShaderSource({sources:[this.Command,this.BufferD]}),geometry:this.quadGeometry,outputTexture:this.texD,preExecute:function(){e.Buffer_D.commandToExecute.outputTexture=e.texD}})}initRender(){const e={QZKC:-300,JLC:-300,YaAn:0,avaflow:-200},t=Cesium.Cartographic.fromCartesian(this.center),n=[Cesium.Math.toDegrees(t.longitude),Cesium.Math.toDegrees(t.latitude),(this.max+this.min)/2+(e[this.lakeName]??0)],r=H(n,[90,0,0],[this._width*this.cellSize,this.max-this.min,this._height*this.cellSize]),i=Cesium.BoxGeometry.fromDimensions({vertexFormat:Cesium.VertexFormat.POSITION_AND_ST,dimensions:new Cesium.Cartesian3(1,1,1)}),o=Cesium.BoxGeometry.createGeometry(i),c=Cesium.GeometryPipeline.createAttributeLocations(o);this.fluidCommand=new C({commandType:"Draw",uniformMap:{iTime:()=>this.time,iFrame:()=>this.frame,iResolution:()=>this._resolution,iChannel0:()=>this.texC,heightMap:()=>this.demMap,waterColor:()=>Cesium.Color.fromCssColorString(a.deepWaterColor),lightWaterColor:()=>Cesium.Color.fromCssColorString(a.lightWaterColor),waterHeightMap:()=>this.waterHeightMap,phase2:()=>this.phase2,phase3:()=>this.phase3,rangeMap:()=>this.rangeMap,renderTerrain:()=>this.renderTerrain,renderHeatMap:()=>this.renderHeatMap,renderOriginData:()=>this.renderOriginData,renderOriginData2:()=>this.renderOriginData2,renderOriginData3:()=>this.renderOriginData3},geometry:o,modelMatrix:r,attributeLocations:c,vertexShaderSource:new Cesium.ShaderSource({sources:[`
                   in vec3 position;
                   in vec2 st;
                 
                   out vec3 vo;
                   out vec3 vd;
                   out vec2 v_st;
                   void main()
                   {    
                       vo = czm_encodedCameraPositionMCHigh + czm_encodedCameraPositionMCLow;
                       vd = position - vo;
                       v_st = st;
                       gl_Position = czm_modelViewProjection * vec4(position,1.0);
                   }
                   `]}),fragmentShaderSource:new Cesium.ShaderSource({sources:[this.Command+this.renderShaderSource]}),rawRenderState:{depthTest:{enabled:!0},blending:Cesium.BlendingState.ALPHA_BLEND}}),this._viewer.scene.primitives.add(this.Buffer_RangeT),this._viewer.scene.primitives.add(this.Buffer_Range),this._viewer.scene.primitives.add(this.Buffer_A),this._viewer.scene.primitives.add(this.Buffer_B),this._viewer.scene.primitives.add(this.Buffer_C),this._viewer.scene.primitives.add(this.Buffer_D),this._viewer.scene.primitives.add(this.fluidCommand);const a=this;this.time=0,this.frame=0,this.dataSetIdx=0,this.preEvent=()=>{a.preRender&&a.preRender(a)},this.postEvent=()=>{performance.now(),a.time+=.002*a.renderSpeed,a.frame+=.01*a.renderSpeed,a.dataSet.length&&(a.updateDataSets(a.dataSetIdx),a.dataSetIdx=Number.parseInt(a.frame*2%a.dataSet.length),a.dataSetIdx>=a.dataSet.length&&(a.dataSetIdx=a.dataSet.length-1),a.onDataUpdate&&a.onDataUpdate(a)),a.postRender&&a.postRender(a)},this._viewer.scene.preRender.addEventListener(this.preEvent),this._viewer.scene.postRender.addEventListener(this.postEvent)}addWater(e,t){const{theta:n,distance:r}=z(this.center,e),i=r*Math.cos(Cesium.Math.toRadians(n)),o=r*Math.sin(Cesium.Math.toRadians(n));if(Math.abs(i)>this._height*this.cellSize||Math.abs(o)>this._width*this.cellSize){this._waterAdd.w=0;return}const c=parseInt(o/this.cellSize)+this._width/2,a=parseInt(i/this.cellSize)+this._height/2;this._waterAdd.x=c,this._waterAdd.y=this._height-1-a,this._waterAdd.z=t,this._waterAdd.w=1}StopAddWater(){this._waterAdd.w=0}async pushFortronData(e){this.dataSet.push("data:image/png;base64,"+e)}async updateDataSets(e){const t=await D(this.dataSet[e]),n=new Cesium.Texture({context:this._viewer.scene.frameState.context,source:t,flipY:!1,sampler:new Cesium.Sampler({wrapS:Cesium.TextureWrap.REPEAT,wrapT:Cesium.TextureWrap.REPEAT,magnificationFilter:Cesium.TextureMagnificationFilter.LINEAR,minificationFilter:Cesium.TextureMinificationFilter.LINEAR_MIPMAP_LINEAR})});n.generateMipmap();let r=this.waterHeightMap;this.waterHeightMap=n,r.destroy();const i=await D(this.dataSet2[e]),o=new Cesium.Texture({context:this._viewer.scene.frameState.context,source:i,flipY:!1,sampler:new Cesium.Sampler({wrapS:Cesium.TextureWrap.REPEAT,wrapT:Cesium.TextureWrap.REPEAT,magnificationFilter:Cesium.TextureMagnificationFilter.LINEAR,minificationFilter:Cesium.TextureMinificationFilter.LINEAR_MIPMAP_LINEAR})});o.generateMipmap(),r=this.phase2,this.phase2=o,r.destroy();const c=await D(this.dataSet3[e]),a=new Cesium.Texture({context:this._viewer.scene.frameState.context,source:c,flipY:!1,sampler:new Cesium.Sampler({wrapS:Cesium.TextureWrap.REPEAT,wrapT:Cesium.TextureWrap.REPEAT,magnificationFilter:Cesium.TextureMagnificationFilter.LINEAR,minificationFilter:Cesium.TextureMinificationFilter.LINEAR_MIPMAP_LINEAR})});a.generateMipmap(),r=this.phase3,this.phase3=a,r.destroy()}async setWaterHeight(e){const t=await D(e),n=new Cesium.Texture({context:this._viewer.scene.frameState.context,source:t,flipY:!1,sampler:new Cesium.Sampler({wrapS:Cesium.TextureWrap.REPEAT,wrapT:Cesium.TextureWrap.REPEAT,magnificationFilter:Cesium.TextureMagnificationFilter.LINEAR,minificationFilter:Cesium.TextureMinificationFilter.LINEAR_MIPMAP_LINEAR})});n.generateMipmap();const r=this.waterHeightMap;this.waterHeightMap=n,r.destroy()}async getInundation(e){const t=this;return new Promise((r,i)=>{k(t.dataSet[t.dataSetIdx]).then(o=>{const c=[];for(let m=0;m<t._height;m++)for(let p=0;p<t._width;p++){m*t._width+p;let w=(t._height-1-m)*t._width+p;if(o[w*4]!=0&&o[w*4+1]!=0&&o[w*4+2]!=0){const v=[(p-t._width/2+.5)*t.cellSize,(m-t._height/2+.5)*t.cellSize],y=T(t.center,v),s=Cesium.Cartographic.fromCartesian(y);c.push(O([Cesium.Math.toDegrees(s.longitude),Cesium.Math.toDegrees(s.latitude)]))}}const a={units:"miles",maxEdge:10},x=b(I(c),a);r(x)})})}async loadAscAsWaterHeight(e,t){const r=(await fetch(e).then(s=>s.text())).trim().split(/\r?\n/),i={};for(let s=0;s<6;s++){const l=r[s].trim().split(/\s+/);i[l[0].toLowerCase()]=Number(l[1])}const o=i.ncols,c=i.nrows,a=i.nodata_value,x=new Float32Array(o*c);let m=0;for(let s=6;s<r.length;s++){const l=r[s].trim().split(/\s+/).map(Number);for(const g of l)m<x.length&&(x[m++]=g===a?0:g)}const p=[];for(const s of x)s>0&&p.push(s);const w=t||Math.max(...p);this.range=new Cesium.Cartesian2(0,w);const v=new Float32Array(this._width*this._height*4);for(let s=0;s<this._height;s++)for(let l=0;l<this._width;l++){const g=Math.min(o-1,Math.floor(l/this._width*o)),M=Math.min(c-1,Math.floor(s/this._height*c)),f=c-1-M,d=x[f*o+g],h=Cesium.Math.clamp(d/w,0,1),F=(s*this._width+l)*4;v[F]=h,v[F+1]=h,v[F+2]=h,v[F+3]=1}const y=u.createTexture({context:this._viewer.scene.context,width:this._width,height:this._height,pixelFormat:Cesium.PixelFormat.RGBA,pixelDatatype:Cesium.PixelDatatype.FLOAT,arrayBufferView:v});this.waterHeightMap&&this.waterHeightMap.destroy(),this.waterHeightMap=y,console.log("[loadAscAsWaterHeight]",o,"x",c,"→",this._width,"x",this._height,"max:",w.toFixed(2))}remove(){this._viewer.scene.primitives.remove(this.fluidCommand),this._viewer.scene.primitives.remove(this.Buffer_D),this._viewer.scene.primitives.remove(this.Buffer_C),this._viewer.scene.primitives.remove(this.Buffer_B),this._viewer.scene.primitives.remove(this.Buffer_A),this._viewer.scene.preRender.removeEventListener(this.preEvent),this._viewer.scene.postRender.removeEventListener(this.postEvent)}}const k=async _=>new Promise((t,n)=>{const r=new Image;r.onload=function(){const i=document.createElement("canvas");i.width=r.width,i.height=r.height;const o=i.getContext("2d");o.drawImage(r,0,0);const a=o.getImageData(0,0,i.width,i.height).data;t(a)},r.src=_});export{U as default};
