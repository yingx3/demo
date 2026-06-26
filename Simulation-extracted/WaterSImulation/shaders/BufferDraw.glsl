
// Created by David Gallardo - xjorma/2021
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0
#define AA
#define GAMMA 1
uniform sampler2D iChannel0;
// uniform sampler2D iChannel1;
uniform sampler2D heightMap;
uniform sampler2D lakeMap;
uniform sampler2D waterHeightMap;
uniform sampler2D waterVectorMap;
uniform vec4 waterColor;
uniform vec4 lightWaterColor;
uniform vec2 iResolution;
uniform float iTime;
uniform int iFrame;
uniform bool renderTerrain;
uniform bool renderHeatMap;
uniform bool renderOriginData;
in vec3 vo;
in vec3 vd;
in vec2 v_st;
const vec3 light = vec3(0., 4., 2.);
const float boxHeight = 0.45;
vec2 getHeight(in vec3 p) {
  p = p + .5;
  vec2 p2 = p.xz * vec2(float(textureSize)) / iResolution.xy;
  p2 = min(p2, vec2(float(textureSize) - 0.5) / iResolution.xy);
  vec2 h = texture(iChannel0, p2).xy;
  h.y += h.x;
  return h - boxHeight;
}

vec2 getAttr(in vec3 p) {
  //  p = (p + 1.0) * 0.5;
  p = p + .5;
  vec2 p2 = p.xz * vec2(float(textureSize)) / iResolution.xy;
  p2 = min(p2, vec2(float(textureSize) - 0.5) / iResolution.xy);
  vec2 h = texture(iChannel0, p2).zw;
  return h;
}

vec2 getWaterHeight(in vec3 p) {
  //  p = (p + 1.0) * 0.5;
  p = p + .5;
  vec2 p2 = p.xz * vec2(float(textureSize)) / iResolution.xy;
  p2 = min(p2, vec2(float(textureSize) - 0.5) / iResolution.xy);
  vec2 h = texture(waterHeightMap, p2).xy;
  return h;
}

vec3 getNormal(in vec3 p, int comp) {
  float d = 2.0 / float(textureSize);
  //  float d = 2.0 / float(iResolution.xy);
  float hMid = getHeight(p)[comp];
  float hRight = getHeight(p + vec3(d, 0, 0))[comp];
  float hTop = getHeight(p + vec3(0, 0, d))[comp];
  return normalize(cross(vec3(0, hTop - hMid, d), vec3(d, hRight - hMid, 0)));
}

vec4 terrainColor(in vec3 p, in vec3 n, out float spec) {
  //  spec = 0.1;
  //  vec3 c = vec3(0.21, 0.50, 0.07);
  //  float cliff = smoothstep(0.8, 0.3, n.y);
  //  c = mix(c, vec3(0.25), cliff);
  //  spec = mix(spec, 0.3, cliff);
  //  float snow = smoothstep(0.05, 0.25, p.y) * smoothstep(0.5, 0.7, n.y);
  //  c = mix(c, vec3(0.95, 0.95, 0.85), snow);
  //  spec = mix(spec, 0.4, snow);
  //  vec3 t = texture(iChannel1, p.xz * 5.0).xyz;
  //  return mix(c, c * t, 0.75);
  // return vec4(.22,.49,.91,1.);
  // return vec4(p.y);
  // return vec4(.62,.79,.91,1.);
  // return vec4(0.7176,0.5508,0.0703,1.);
  return lightWaterColor;
}

vec3 undergroundColor(float d) {
  vec3 color[4] = vec3[](vec3(0.5, 0.45, 0.5), vec3(0.40, 0.35, 0.25), vec3(0.55, 0.50, 0.4), vec3(0.45, 0.30, 0.20));
  d *= 6.0;
  d = min(d, 3.0 - 0.001);
  float fr = fract(d);
  float fl = floor(d);
  return mix(color[int(fl)], color[int(fl) + 1], fr);
}

vec4 Render(in vec3 ro, in vec3 rd) {
  vec3 n;
  vec3 rayDir = normalize(rd);
  vec2 ret = hitBox(ro, rayDir);
  if(ret.x > ret.y)
    discard;
  ret.x = max(ret.x, 0.0);
  vec3 p = ro + ret.x * rayDir;

  if(ret.x > 0.0) {
    vec3 pi = ro + rd * ret.x;
    vec4 tc;
    tc.a = 1.;
    vec3 tn;
    float tt = ret.x;
    vec2 h = getHeight(pi);
    float spec;
    if(pi.y < h.x) {
      tn = n;
      tc.xyz = undergroundColor(h.x - pi.y);
      tc.a = 0.;
    } else {
      for(int i = 0; i < 200; i++) {
        vec3 p = ro + rd * tt;
        float h = p.y - getHeight(p).x;
        if(h < 0.00002 || tt > ret.y)
          break;
        tt += h * 0.4 * .25;
      }
      tn = getNormal(ro + rd * tt, 0);
      tc = terrainColor(ro + rd * tt, tn, spec);

          //  tc.xyz = getColorByValue(getHeight(ro + rd * tt).y);
    }
    {
      vec3 lightDir = normalize(light - (ro + rd * tt));
      tc.xyz = tc.xyz * (max(0.0, dot(lightDir, tn)) + 0.3);
      spec *= pow(max(0., dot(lightDir, reflect(rd, tn))), 10.0);
      tc.xyz += spec;
    }
    if(tt > ret.y) {
      tc.xyz = vec3(0, 0, 0.4);
    }
    float wt = ret.x;
    h = getHeight(pi);
    vec3 waterNormal;
    if(pi.y < h.y) {
      waterNormal = n;
    } else {
      for(int i = 0; i < 200; i++) {
        vec3 p = ro + rd * wt;
        float h = p.y - getHeight(p).y;
        if(h < 0.00002 || wt > min(tt, ret.y))
          break;
        wt += h * 0.4 * .25;
      }
      waterNormal = getNormal(ro + rd * wt, 1);

          //  tc.rgb = mix(tc.rgb,vec3(1.,0.,0.),clamp((tt -wt)*10.,0.,1.));
    }
    if(wt < ret.y) {
      float dist = (min(tt, ret.y) - wt);
      vec3 p = waterNormal;
      vec3 lightDir = normalize(light - (ro + rd * wt));
          //  tc.xyz = applyFog( tc.xyz, vec3(0, 0, 0.4), dist * 15.0 * 17.);
          //  tc.xyz = applyFog( tc.xyz, vec3(0.7176,0.5508,0.0703), dist * 15.0 * 17.);
          //  tc.xyz = applyFog( tc.xyz, vec3(0.359375,0.2578125,0.14453125), dist * 15.0 * 17.);
      tc.xyz = applyFog(tc.xyz, waterColor.xyz, dist * 15.0 * 17.);
          //  if(renderHeatMap) tc.xyz = applyFog( tc.xyz, getColorByValue(getAttr((ro + rd * wt)).y * 4.), dist * 15.0 * 17.);
      float spec = pow(max(0., dot(lightDir, reflect(rd, waterNormal))), 20.0);
      if(spec < .01)
        spec *= 5.;
    } else {
      discard;
    }
    float alpha = 1.;
       //  if( h.y > 0.) alpha = 1.;
       //  else alpha = 0.;
       //  return vec4(tc,alpha);
      //  if(tt -wt < minTotalFlow *1. || h.y <=minTotalFlow) tc.a=0.;
      //  else tc.a = clamp(h.y / .2 , 0. ,1.) ;

    float heatV = texture(waterHeightMap, (ro + rd * tt).xz + .5).x;
    if(renderOriginData) {
          //  if(heatV < 0.00001 ) discard;
      return vec4(heatV);
    }
    if(renderHeatMap) {
      vec3 hColor = getColorByValue2(heatV);
      if(heatV < 0.00001)
        discard;
      return vec4(hColor, 1.);
    }

    vec4 arrow = texelFetch(waterVectorMap, ivec2((ro + rd * tt + .5).xz * iResolution * 4.), 0);
    if(!true) {
      if(arrow.a > 0.1 && length(arrow.xyz) > 0.1)
        tc.xyz = arrow.xyz;
    }

    if(!renderTerrain && (tt - wt) < 0.00001)
      discard;
    return tc;
  }
  discard;
}

vec3 vignette(vec3 color, vec2 q, float v) {
  color *= 0.3 + 0.8 * pow(16.0 * q.x * q.y * (1.0 - q.x) * (1.0 - q.y), v);
  return color;
}

void main() {
  //  vec4 c = texture(waterHeightMap,v_st);
  // //  vec4 c = texelFetch(lakeMap, ivec2(gl_FragCoord.xy), 0);
  //  out_FragColor = vec4( c.xyz, 1. );
  //  return;
  vec3 tot = vec3(0.0);
  vec3 rayDir = normalize(vd);
  vec4 col = Render(vo, rayDir);
  tot += col.rgb;
  out_FragColor = vec4(tot, 1.);
}
