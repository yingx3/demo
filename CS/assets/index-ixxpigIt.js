import{g as R,p as T,b as A,R as x,C as w,d as P,c as L,a as b,e as I,f as H}from"./Util-BcXxY0A4.js";import"./index-CZ4DaCNY.js";const E=`#define ch0 iChannel0\r
#define ch1 iChannel1\r
#define ch2 iChannel2\r
#define ch3 iChannel3\r
\r
#define LOAD(ch, pos) texelFetch(ch, ivec2(pos), 0)\r
#define LOAD3D(ch, pos) texelFetch(ch, ivec2(dim2from3(pos)), 0)\r
\r
#define PI 3.1415926535\r
#define TWO_PI 6.28318530718\r
\r
#define light_dir normalize(vec3(0.820,1.000,0.702))\r
\r
#define surface_tension 0.5\r
#define surface_tension_rad 2.0\r
#define initial_particle_density 2u\r
#define dt 0.7\r
#define rest_density 1.0\r
#define gravity 0.01\r
#define force_k 0.15\r
#define force_coef_a -.5\r
#define force_coef_b 0.0\r
#define force_mouse 0.005\r
#define force_mouse_rad 40.0\r
#define force_boundary 5.0\r
#define boundary_h 5.0\r
#define max_velocity 2.0\r
#define cooling 0.0\r
\r
#define R iResolution.xy\r
\r
#define GD(x, R) exp(-dot(x/R,x/R))/(R*R)\r
#define GS(x) exp(-dot(x,x))\r
\r
#define loop(i,x) for(int i = 0; i < x; i++)\r
#define range(i,a,b) for(int i = a; i <= b; i++)\r
\r
//3d slice aspect ratio \r
#define ar vec2(1.,1.)\r
vec2 SCALE;\r
vec3 size3d;\r
\r
vec4 iMouse = vec4(0.);\r
\r
vec2 dim2from3(vec3 p3d) {\r
  p3d = clamp(p3d, vec3(0.0), size3d);\r
  float ny = floor(p3d.z / SCALE.x);\r
  float nx = floor(p3d.z) - ny * SCALE.x;\r
  return vec2(nx, ny) * vec2(size3d.xy) + p3d.xy;\r
}\r
\r
vec3 dim3from2(vec2 p2d) {\r
  return vec3(p2d - size3d.xy * floor(p2d / size3d.xy), (floor(p2d.x / size3d.x) + SCALE.x * floor(p2d.y / size3d.y)));\r
}\r
\r
#define pixel(a, p, s) texture(a, p/vec2(s))\r
vec4 voxel(sampler2D ch, vec3 p3d) {\r
  return pixel(ch, dim2from3(p3d), textureSize(ch, 0));\r
}\r
\r
//trilinear interpolation = linear interp between layers\r
vec4 trilinear(sampler2D ch, vec3 p3d) {\r
  return mix(voxel(ch, vec3(p3d.xy, floor(p3d.z))), voxel(ch, vec3(p3d.xy, ceil(p3d.z))), fract(p3d.z));\r
}\r
\r
float sdBox(vec3 p, vec3 b) {\r
  vec3 d = abs(p) - b;\r
  return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));\r
}\r
\r
vec2 hash21(float p) {\r
  vec3 p3 = fract(vec3(p) * vec3(.1031, .1030, .0973));\r
  p3 += dot(p3, p3.yzx + 33.33);\r
  return fract((p3.xx + p3.yz) * p3.zy);\r
}\r
\r
vec2 hash23(vec3 p3) {\r
  p3 = fract(p3 * vec3(.1031, .1030, .0973));\r
  p3 += dot(p3, p3.yzx + 33.33);\r
  return fract((p3.xx + p3.yz) * p3.zy);\r
}\r
\r
vec3 udir(vec2 rng) {\r
  float phi = 2. * PI * rng.x;\r
  float ctheta = 2. * rng.y - 1.;\r
  float stheta = sqrt(1.0 - ctheta * ctheta);\r
  return vec3(cos(phi) * stheta, sin(phi) * stheta, ctheta);\r
}\r
\r
struct Particle {\r
  uint mass;\r
  bool sand;      // Uses 1 bit\r
  vec3 pos;\r
  vec3 vel;\r
  vec3 force;\r
  float density;\r
};\r
\r
//5 bits for shared exponent, 9 bits for each component\r
uint packvec3(vec3 v) {\r
    //get the exponent\r
  float maxv = max(abs(v.x), max(abs(v.y), abs(v.z)));\r
  int exp = clamp(int(ceil(log2(maxv))), -15, 15);\r
  float scale = exp2(-float(exp));\r
  uvec3 sv = uvec3(round(clamp(v * scale, -1.0, 1.0) * 255.0) + 255.0);\r
  uint packed = uint(exp + 15) | (sv.x << 5) | (sv.y << 14) | (sv.z << 23);\r
  return packed;\r
}\r
\r
vec3 unpackvec3(uint packed) {\r
  int exp = int(packed & 0x1Fu) - 15;\r
  vec3 sv = vec3((packed >> 5) & 0x1FFu, (packed >> 14) & 0x1FFu, (packed >> 23) & 0x1FFu);\r
  vec3 v = (sv - 255.0) / 255.0;\r
  v *= exp2(float(exp));\r
  return v;\r
}\r
\r
vec4 packParticles(Particle p0, Particle p1, vec3 pos) {\r
  p0.pos -= pos;\r
  p1.pos -= pos;\r
\r
  uvec3 pos0 = uvec3(clamp(p0.pos, 0.0, 1.0) * 255.0);\r
  uvec3 pos1 = uvec3(clamp(p1.pos, 0.0, 1.0) * 255.0);\r
\r
    // Pack mass (7 bits) and sand (1 bit) for both particles\r
  uint p0_mass_sand = p0.mass | (p0.sand ? 0x80u : 0x00u);  // sand in bit 7\r
  uint p1_mass_sand = p1.mass | (p1.sand ? 0x80u : 0x00u);\r
\r
  uint data1 = p0_mass_sand | (p1_mass_sand << 8) | (pos0.x << 16) | (pos0.y << 24);\r
  float f1 = uintBitsToFloat(data1);\r
  uint data2 = pos0.z | (pos1.x << 8) | (pos1.y << 16) | (pos1.z << 24);\r
  float f2 = uintBitsToFloat(data2);\r
  uint data3 = packvec3(p0.vel);\r
  float f3 = uintBitsToFloat(data3);\r
  uint data4 = packvec3(p1.vel);\r
  float f4 = uintBitsToFloat(data4);\r
  return vec4(f1, f2, f3, f4);\r
}\r
\r
void unpackParticles(vec4 packed, vec3 pos, out Particle p0, out Particle p1) {\r
  uint data1 = floatBitsToUint(packed.x);\r
  uint data2 = floatBitsToUint(packed.y);\r
  uint data3 = floatBitsToUint(packed.z);\r
  uint data4 = floatBitsToUint(packed.w);\r
\r
    // Unpack mass and sand for both particles\r
  p0.mass = data1 & 0x7Fu;         // Lower 7 bits for mass\r
  p0.sand = ((data1 & 0x80u) != uint(0)); // Bit 7 for sand\r
\r
  p1.mass = (data1 >> 8) & 0x7Fu;\r
  p1.sand = ((data1 >> 8) & 0x80u) != uint(0);\r
\r
  uvec3 pos0 = uvec3((data1 >> 16) & 0xFFu, (data1 >> 24) & 0xFFu, data2 & 0xFFu);\r
  uvec3 pos1 = uvec3((data2 >> 8) & 0xFFu, (data2 >> 16) & 0xFFu, (data2 >> 24) & 0xFFu);\r
\r
  p0.pos = vec3(pos0) / 255.0 + pos;\r
  p1.pos = vec3(pos1) / 255.0 + pos;\r
\r
  p0.vel = unpackvec3(data3);\r
  p1.vel = unpackvec3(data4);\r
}\r
\r
float sdBox(in vec2 p, in vec2 b) {\r
  vec2 d = abs(p) - b;\r
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);\r
}\r
\r
int ClosestCluster(Particle p0, Particle p1, Particle incoming) {\r
    //first try to choose the particle with significantly smaller mass\r
  if(float(p0.mass) < 0.01 * float(p1.mass) || float(p1.mass) < 0.01 * float(p0.mass)) {\r
    return p0.mass < p1.mass ? 0 : 1;\r
  }\r
\r
    //otherwise choose the closest one\r
  float d0 = length(p0.pos - incoming.pos);\r
  float d1 = length(p1.pos - incoming.pos);\r
  return d0 < d1 ? 0 : 1;\r
}\r
\r
void BlendParticle(inout Particle p, in Particle incoming) {\r
  uint newMass = p.mass + incoming.mass;\r
  vec2 weight = vec2(p.mass, incoming.mass) / float(newMass);\r
  p.pos = p.pos * weight.x + incoming.pos * weight.y;\r
  p.vel = p.vel * weight.x + incoming.vel * weight.y;\r
  p.mass = newMass;\r
  p.sand = p.mass > incoming.mass ? p.sand : incoming.sand;\r
}\r
\r
void Clusterize(inout Particle p0, inout Particle p1, in Particle incoming, vec3 pos) {\r
    //check if the incoming particle is in the cell\r
  if(!all(equal(pos, floor(incoming.pos)))) {\r
    return;\r
  }\r
\r
  int closest = ClosestCluster(p0, p1, incoming);\r
  if(closest == 0) {\r
    BlendParticle(p0, incoming);\r
  } else {\r
    BlendParticle(p1, incoming);\r
  }\r
}\r
\r
void SplitParticle(inout Particle p1, inout Particle p2) {\r
  vec3 pos = p1.pos;\r
  uint newMass = p1.mass;\r
  p1.mass = newMass / 2u;\r
  p2.mass = newMass - p1.mass;\r
  vec3 dir = udir(hash23(pos));\r
  p1.pos = pos - dir * 5e-3;\r
  p2.pos = pos + dir * 5e-3;\r
  p2.vel = p1.vel;\r
  p2.sand = p1.sand;\r
}\r
\r
// 粒子作用力计算修改\r
void ApplyForce(inout Particle p, in Particle incoming) {\r
  float d = distance(p.pos, incoming.pos);\r
  vec3 dir = (incoming.pos - p.pos) / max(d, 1e-5);\r
  vec3 dvel = incoming.vel - p.vel;\r
  float irho = float(incoming.mass);\r
  float rho = 0.5 * (p.density + incoming.density);\r
    // 根据粒子类型调整参数\r
  float pressure = max(rho / rest_density - 1.0, -0.0);\r
  float f = force_coef_a * GD(d, 1.5);\r
  float SPH_F = f * pressure;\r
    // 表面张力仅作用于非沙粒\r
  float F = p.sand ? surface_tension * GD(d, surface_tension_rad) * .5 : surface_tension * GD(d, surface_tension_rad);\r
    // 摩擦系数根据沙粒调整\r
  float frictionCoeff = p.sand ? 0.9 : 0.45; // 沙粒摩擦更大\r
  float Friction = frictionCoeff * dot(dir, dvel) * GD(d, 1.5);\r
    // 沙粒禁用SPH压力项\r
    // if (p.sand) {\r
    //     SPH_F = 0.0;\r
    // }\r
    // 组合力并应用\r
  vec3 totalForce = force_k * dir * (F + SPH_F + Friction) * irho / rest_density;\r
  p.force += totalForce;\r
}\r
\r
float minv(vec3 a) {\r
  return min(min(a.x, a.y), a.z);\r
}\r
\r
float maxv(vec3 a) {\r
  return max(max(a.x, a.y), a.z);\r
}\r
\r
float distance2border(vec3 p) {\r
  vec3 a = vec3(size3d - 1.) - p;\r
  return min(minv(p), minv(a)) + 1.;\r
}\r
\r
vec4 border_grad(vec3 p) {\r
  const float dx = 0.001;\r
  const vec3 k = vec3(1, -1, 0);\r
  return (k.xyyx * distance2border(p + k.xyy * dx) +\r
    k.yyxx * distance2border(p + k.yyx * dx) +\r
    k.yxyx * distance2border(p + k.yxy * dx) +\r
    k.xxxx * distance2border(p + k.xxx * dx)) / vec4(4. * dx, 4. * dx, 4. * dx, 4.);\r
}\r
\r
float GetTerrainHeight(vec2 posXY, vec2 iR, sampler2D heightMap, float heightScale) {\r
    // return min(((size3d.x-posXY.x)+(size3d.y-posXY.y))*0.2,size3d.z/4.);\r
\r
  ivec2 p = ivec2(posXY / size3d.xy * iR / 10.);\r
    // ivec2 p = ivec2(posXY);\r
  p = ivec2(p.x, iR.y / 10. - float(p.y) - 1.);\r
\r
  p = clamp(p, ivec2(0), ivec2(ivec2(iR) - 1));\r
  return 0.05 + texelFetch(heightMap, p, 0).x * size3d.z * heightScale * 1.2;\r
}\r
\r
vec4 sampleTexture(vec2 posXY, vec2 iR, sampler2D texture) {\r
  ivec2 p = ivec2(posXY / size3d.xy * iR);\r
  p = ivec2(p.x, iR.y - float(p.y) - 1.);\r
  vec4 color = vec4(texelFetch(texture, clamp(p, ivec2(0), ivec2(ivec2(iR) - 1)), 0));\r
  return color;\r
}\r
\r
float readinitWater(vec2 posXY, vec2 iR, sampler2D texture) {\r
  ivec2 p = ivec2(posXY / size3d.xy * iR / 10.);\r
  // p = ivec2(p.x,iR.y / 10.-float(p.y)-1.);\r
\r
  int bord = 10;\r
  if(p.x < bord || p.y < bord || p.x > int(iR / 10.) - bord || p.y > int(iR / 10.) - bord)\r
    return 0.;\r
  int lakeRadius = 2;\r
  for(int i = -lakeRadius; i <= lakeRadius; i++) for(int j = -lakeRadius; j <= lakeRadius; j++) {\r
      if(texelFetch(texture, clamp(p + ivec2(i, j), ivec2(0), ivec2(ivec2(iR / 10.) - 1)) + ivec2(0, 0), 0).r == 0.)\r
        return 0.;\r
    }\r
  return 1.;\r
}\r
\r
float readCanFLow(vec2 posXY, vec2 iR, sampler2D lakeTexture, sampler2D flowTexture, vec2 texR, vec2 texOffset) {\r
  ivec2 p = ivec2(posXY / size3d.xy * texR);\r
  //  p = ivec2(p.x,texR.y-float(p.y)-1.);\r
\r
  int bord = 10;\r
  if(p.x < bord || p.y < bord || p.x > int(iR / 10.) - bord || p.y > int(iR / 10.) - bord)\r
    return 0.;\r
\r
  int radius = 7;\r
  int sum = 0;\r
  for(int i = -radius; i <= radius; i++) for(int j = -radius; j <= radius; j++) {\r
      if(readinitWater(posXY, iR, lakeTexture) == 1.)\r
        sum++;\r
      if(texelFetch(flowTexture, clamp(p + ivec2(i, j), ivec2(0), ivec2(ivec2(texR) - 1)) + ivec2(texOffset) + ivec2(5, 0), 0).r != 0.)\r
        sum++;\r
        //  if(texelFetch(flowTexture, clamp(p + ivec2(i, j), ivec2(0), ivec2(ivec2(texR) - 1)) + ivec2(texOffset), 0).r!=0.) sum++;\r
    }\r
  if(sum > radius / 2)\r
    return 1.;\r
  return 0.;\r
}\r
\r
vec3 terrainNormal(vec2 posXY, vec2 iR, sampler2D heightMap, float heightScale) {\r
  ivec2 p = ivec2(posXY / size3d.xy * iR / 10.);\r
\r
    // p = ivec2(p.x,iR.y / 10.-float(p.y)-1.);\r
    // p = ivec2(iR.x / 10.-float(p.x)-1., p.y);\r
\r
  float hL = texelFetch(heightMap, clamp(p + ivec2(-1, 0), ivec2(0), ivec2(ivec2(iR / 10.) - 1)), 0).x * size3d.z * 1.2;\r
  float hR = texelFetch(heightMap, clamp(p + ivec2(1, 0), ivec2(0), ivec2(ivec2(iR / 10.) - 1)), 0).x * size3d.z * 1.2;\r
  float hD = texelFetch(heightMap, clamp(p + ivec2(0, -1), ivec2(0), ivec2(ivec2(iR / 10.) - 1)), 0).x * size3d.z * 1.2;\r
  float hU = texelFetch(heightMap, clamp(p + ivec2(0, 1), ivec2(0), ivec2(ivec2(iR / 10.) - 1)), 0).x * size3d.z * 1.2;\r
\r
  vec3 dx = vec3(2.0 * size3d.x, 0.0, hR - hL);\r
  vec3 dy = vec3(0.0, 2.0 * size3d.y, hU - hD);\r
  return normalize(cross(dx, dy));\r
}\r
\r
vec3 terrainDownDir(vec2 posXY, vec2 iR, sampler2D heightMap, float heightScale) {\r
  ivec2 p = ivec2(posXY / size3d.xy * iR / 10.);\r
    // p = ivec2(p.x,iR.y-float(p.y)-1.);\r
    // p = ivec2(iR.x-float(p.x)-1., p.y);\r
\r
  float hL = texelFetch(heightMap, clamp(p + ivec2(-1, 0), ivec2(0), ivec2(ivec2(iR / 10.) - 1)), 0).x * size3d.z;\r
  float hR = texelFetch(heightMap, clamp(p + ivec2(1, 0), ivec2(0), ivec2(ivec2(iR / 10.) - 1)), 0).x * size3d.z;\r
  float hD = texelFetch(heightMap, clamp(p + ivec2(0, -1), ivec2(0), ivec2(ivec2(iR / 10.) - 1)), 0).x * size3d.z;\r
  float hU = texelFetch(heightMap, clamp(p + ivec2(0, 1), ivec2(0), ivec2(ivec2(iR / 10.) - 1)), 0).x * size3d.z;\r
\r
  if(p.x - 1 < 0)\r
    hL = size3d.z * 2.;\r
  if(p.x + 1 > int(iR.x) - 1)\r
    hR = size3d.z * 2.;\r
  if(p.y - 1 < 0)\r
    hD = size3d.z * 2.;\r
  if(p.y - 1 > int(iR.x) - 1)\r
    hU = size3d.z * 2.;\r
\r
  return -normalize(vec3((hR - hL) / 2., (hU - hD) / 2., -1. / size3d.z / 1.4));\r
}\r
\r
void IntegrateParticle(inout Particle p, vec3 pos, vec2 iR, vec4 iM, float time, sampler2D heightMap, float heightScale, sampler2D lakeTexture, sampler2D flowTexture, vec2 texR, vec2 texOffset) {\r
  p.force = p.force;/// max(0.0001, float(p.mass));\r
    // p.force += gravity*vec3(0.4*sin(0.7*time), 0.2*cos(0.5*time), -1.0); //gravity\r
  p.force += vec3(0., 0., -0.096);\r
\r
  vec4 border = border_grad(p.pos);\r
  vec3 bound = 1. * normalize(border.xyz) * exp(-0.4 * border.w * border.w);\r
  bound.z = max(0.0, bound.z);\r
  p.force += force_boundary * bound * dt * 10.;\r
    //p.force += vec2(0.0, 0.0)*GS(distance(p.pos, iR*vec2(0.2,0.5))/force_mouse_rad);\r
\r
    //if(iM.z > 0.)\r
    //{\r
    //    vec3 dx = pos - vec3(iM.xy, 0.0);\r
    //    p.force -= force_mouse*dx*GS(dx/force_mouse_rad);\r
    //}\r
\r
  p.vel += p.force * dt;\r
\r
    //velocity limit\r
  float v = length(p.vel) / max_velocity;\r
  p.vel /= (v > 1.) ? v : 1.;\r
\r
    // --- 新增：地形碰撞检测 ---\r
  vec3 newPos = p.pos + p.vel * dt;\r
  float terrainZ = GetTerrainHeight(newPos.xy, iR, heightMap, heightScale);\r
\r
  if(newPos.z < terrainZ) {\r
        // 碰撞响应：推回地形表面 + 速度修正\r
        // newPos.z = terrainZ;\r
        // p.vel.z *= -0.5;  // 弹性反弹\r
        // p.vel.xy *= 0.8;  // 摩擦力\r
\r
        // p.vel += terrainNormal(newPos.xy, iR, heightMap, heightScale)*(terrainZ-newPos.z);\r
    p.vel *= 0.;\r
    p.pos.z -= 5.;\r
    p.vel += terrainDownDir(newPos.xy, iR, heightMap, heightScale) * (terrainZ - newPos.z) / size3d.z;\r
  }\r
\r
    // p.pos = newPos; // 更新位置\r
\r
  if(readCanFLow(newPos.xy, iR, lakeTexture, flowTexture, texR, texOffset) == 0.) {\r
    vec3 rxVel = p.vel * vec3(-0.8, 1., 1.);\r
    vec3 ryVel = p.vel * vec3(1., -0.8, 1.);\r
    if(readCanFLow((p.pos + rxVel * dt).xy, iR, lakeTexture, flowTexture, texR, texOffset) != 0.)\r
      p.vel = rxVel;\r
    else if(readCanFLow((p.pos + ryVel * dt).xy, iR, lakeTexture, flowTexture, texR, texOffset) != 0.)\r
      p.vel = ryVel;\r
    else\r
      p.mass = 0u;\r
  }\r
\r
  if(p.sand)\r
    p.vel *= 0.92;\r
}\r
\r
void InitGrid(vec2 iR) {\r
  SCALE = floor(ar * pow(iR.x * iR.y, 0.1666666));\r
  size3d = vec3(floor(iR.xy / SCALE), SCALE.x * SCALE.y);\r
}\r
\r
vec3 hsv2rgb(in vec3 c) {\r
  vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);\r
\r
  rgb = rgb * rgb * (3.0 - 2.0 * rgb); // cubic smoothing	\r
\r
  return c.z * mix(vec3(1.0), rgb, c.y);\r
}`,O=`uniform ivec2 rect;\r
uniform sampler2D rangeMap;\r
uniform sampler2D waterHeightMap;\r
void main() {\r
    // ivec2 p = ivec2(gl_FragCoord.xy);\r
    // ivec2 p2 = ivec2(gl_FragCoord.xy);\r
    // if(rect.x > rect.y)\r
    //     p2.y -= (rect.x - rect.y) / 2;\r
    // else\r
    //     p2.x -= (rect.y - rect.x) / 2;\r
    // float canFlow = 0.;\r
    // if(texelFetch(rangeMap, p, 0).r != 0.)\r
    //     canFlow = 1.;\r
    // if(texelFetch(waterHeightMap, p2, 0).r != 0.)\r
    //     canFlow = 1.;\r
\r
    ivec2 p = ivec2(gl_FragCoord.xy);\r
    float canFlow = 0.;\r
    if(texelFetch(rangeMap, p, 0).r != 0.)\r
        canFlow = 1.;\r
    if(texelFetch(waterHeightMap, p, 0).r != 0.)\r
        canFlow = 1.;\r
\r
    out_FragColor = vec4(vec3(canFlow), 1.);\r
}`,G=`uniform float     iTime;\r
uniform int     iFrame;\r
uniform vec2 iResolution;\r
uniform sampler2D iChannel0;\r
void main()\r
{\r
    InitGrid(iResolution.xy);\r
    vec2 fragCoord = floor(gl_FragCoord.xy);\r
    vec3 pos = dim3from2(fragCoord);\r
    \r
    Particle p0, p1;\r
    p0.mass = 0u;\r
    p0.pos = vec3(0);\r
    p0.vel = vec3(0);\r
\r
    p1.mass = 0u;\r
    p1.pos = vec3(0);\r
    p1.vel = vec3(0);\r
\r
    //advect neighbors and accumulate + clusterize density if they fall into this cell\r
    range(i, -2, 2) range(j, -2, 2) range(k, -2, 2)\r
    {\r
        //load the particles \r
        vec3 pos1 = pos + vec3(i, j, k);\r
        if(!all(lessThanEqual(pos1, size3d)) || !all(greaterThanEqual(pos1, vec3(0.0))))\r
        {\r
            continue;\r
        }\r
        Particle p0_, p1_;\r
        unpackParticles(LOAD3D(ch0, pos1), pos1, p0_, p1_);\r
        \r
        if(p0_.mass > 0u)\r
        {\r
            p0_.pos += p0_.vel*dt;\r
            Clusterize(p0, p1, p0_, pos);\r
        }\r
   \r
        if(p1_.mass > 0u)\r
        {\r
            p1_.pos += p1_.vel*dt;\r
            Clusterize(p0, p1, p1_, pos);\r
        }\r
    }\r
    \r
    if(p1.mass == 0u && p0.mass > 0u)\r
    {\r
        SplitParticle(p0, p1);\r
    }\r
\r
    if(p0.mass == 0u && p1.mass > 0u)\r
    {\r
        SplitParticle(p1, p0);\r
    }\r
    \r
    vec4 packed = packParticles(p0, p1, pos);\r
    out_FragColor = packed;\r
}`,V=`uniform float     iTime;\r
uniform int     iFrame;\r
uniform vec2 iResolution;\r
uniform sampler2D iChannel0;\r
void AddDensity(inout Particle p, in Particle incoming, float rad)\r
{\r
    if(incoming.mass == 0u) return;\r
    float d = distance(p.pos, incoming.pos);\r
    float irho = float(incoming.mass);\r
    float rho = 0.25*irho*GD(d,rad);\r
    p.density += rho;\r
}\r
\r
//compute particle SPH densities\r
void main()\r
{\r
    InitGrid(iResolution.xy);\r
    vec2 fragCoord = floor(gl_FragCoord.xy);\r
    vec3 pos = dim3from2(fragCoord);\r
    \r
    Particle p0, p1, pV;\r
    pV.pos = pos + 0.5;\r
    \r
    //load the particles\r
    vec4 packed = LOAD3D(ch0, pos);\r
    unpackParticles(packed, pos, p0, p1);\r
    \r
    range(i, -2, 2) range(j, -2, 2) range(k, -2, 2)\r
    {\r
        if(i == 0 && j == 0 && k == 0) continue;\r
        vec3 pos1 = pos + vec3(i, j, k);\r
        Particle p0_, p1_;\r
        unpackParticles(LOAD3D(ch0, pos1), pos1, p0_, p1_);\r
\r
        if(p0.mass > 0u)\r
        {\r
            AddDensity(p0, p0_, 1.5);\r
            AddDensity(p0, p1_, 1.5);\r
        }\r
        if(p1.mass > 0u)\r
        {\r
            AddDensity(p1, p0_, 1.5);\r
            AddDensity(p1, p1_, 1.5);\r
        }\r
        \r
        AddDensity(pV, p0_, 1.6);\r
        AddDensity(pV, p1_, 1.6);\r
    }\r
\r
    if(p0.mass > 0u)\r
    {\r
        AddDensity(p0, p0, 1.5);\r
        AddDensity(p0, p1, 1.5);\r
    }\r
    if(p1.mass > 0u)\r
    {\r
        AddDensity(p1, p0, 1.5);\r
        AddDensity(p1, p1, 1.5);\r
    }\r
    AddDensity(pV, p0, 1.6);\r
    AddDensity(pV, p1, 1.6);\r
\r
    out_FragColor = vec4(p0.density, p1.density, pV.density, 0.0);\r
}`,N=`uniform float iTime;\r
uniform int iFrame;\r
uniform vec2 iResolution;\r
uniform vec2 texR;\r
uniform vec2 texOffset;\r
uniform float heightScale;\r
uniform sampler2D iChannel0;\r
uniform sampler2D iChannel1;\r
uniform sampler2D lakeMap;\r
uniform sampler2D heightMap;\r
uniform sampler2D waterHeightMap;\r
uniform sampler2D rangeMap;\r
void main() {\r
    InitGrid(iResolution.xy);\r
    vec2 fragCoord = floor(gl_FragCoord.xy);\r
    vec3 pos = dim3from2(fragCoord);\r
\r
    Particle p0, p1;\r
\r
    //load the particles\r
    vec4 packed = LOAD3D(ch0, pos);\r
    unpackParticles(packed, pos, p0, p1);\r
\r
    //load density\r
    vec2 densities = LOAD3D(ch1, pos).xy;\r
    p0.density = densities.x;\r
    p1.density = densities.y;\r
\r
    if(p0.mass + p1.mass > 0u) {\r
        range(i, -2, 2) range(j, -2, 2) range(k, -2, 2) {\r
            if(i == 0 && j == 0 && k == 0)\r
                continue;\r
            vec3 pos1 = pos + vec3(i, j, k);\r
            Particle p0_, p1_;\r
            unpackParticles(LOAD3D(ch0, pos1), pos1, p0_, p1_);\r
\r
            vec2 densities_ = LOAD3D(ch1, pos1).xy;\r
            p0_.density = densities_.x;\r
            p1_.density = densities_.y;\r
\r
            //apply the force\r
            ApplyForce(p0, p0_);\r
            ApplyForce(p0, p1_);\r
            ApplyForce(p1, p0_);\r
            ApplyForce(p1, p1_);\r
        }\r
\r
        ApplyForce(p0, p1);\r
        ApplyForce(p1, p0);\r
\r
        IntegrateParticle(p0, pos, iResolution.xy, iMouse, iTime, heightMap, heightScale, lakeMap, rangeMap, texR, texOffset);\r
        IntegrateParticle(p1, pos, iResolution.xy, iMouse, iTime, heightMap, heightScale, lakeMap, rangeMap, texR, texOffset);\r
    }\r
\r
    // if(iFrame < 10)\r
    // {\r
    //     if(pos.x < 0.2*size3d.x && pos.x > 0.0*size3d.x && \r
    //        pos.y < 0.2*size3d.y && pos.y > 0.0*size3d.y &&\r
    //        pos.z < 0.99*size3d.z && pos.z > 0.85*size3d.z)\r
    //     {\r
    //         p0.mass = initial_particle_density;\r
    //         p1.mass = 0u;\r
    //     }\r
\r
    //     p0.pos = pos;\r
    //     p0.vel = vec3(0.0);\r
    //     p1.pos = pos;\r
    //     p1.vel = vec3(0.0);\r
    // }\r
\r
    if(iFrame > 1 && iFrame < 20) {\r
        // if(pos.x < 0.4*size3d.x && pos.x > 0.0*size3d.x && \r
        //    pos.y < 0.45*size3d.y && pos.y > 0.15*size3d.y &&\r
        //    pos.z < 0.99*size3d.z && pos.z > 0.75*size3d.z && iFrame <= 2)\r
\r
        float p_height = GetTerrainHeight(pos.xy, iResolution, heightMap, heightScale);\r
        if(readinitWater(pos.xy, iResolution, lakeMap) != 0. && pos.z < p_height + 0.02 * size3d.z && pos.z > p_height + 0.01 * size3d.z)\r
        // ivec2 p = ivec2(pos.xy / size3d.xy * texR);\r
        // if(texelFetch(waterHeightMap, p + ivec2(texOffset) + ivec2(20,-10), 0).r!=0.)\r
        // if(readCanFLow(pos.xy, iResolution, lakeMap, waterHeightMap, texR, texOffset)!=0.  && pos.z < p_height+0.02*size3d.z && pos.z > p_height + 0.01*size3d.z)\r
        {\r
            p0.mass = initial_particle_density / 1u * 2u;\r
            p1.mass = 0u;\r
            if(pos.z < 0.92 * size3d.z && pos.z > 0.91 * size3d.z)\r
                p0.sand = bool(1);\r
        }\r
    }\r
\r
    packed = packParticles(p0, p1, pos);\r
    out_FragColor = packed;\r
}`,W=`uniform float     iTime;\r
uniform int     iFrame;\r
uniform vec2 iResolution;\r
uniform sampler2D iChannel1;\r
float Density(vec3 p)\r
{\r
    return trilinear(ch1, p).z;\r
}\r
\r
vec4 calcNormal(vec3 p, float dx) {\r
	const vec3 k = vec3(1,-1,0);\r
	return   (k.xyyx*Density(p + k.xyy*dx) +\r
			 k.yyxx*Density(p + k.yyx*dx) +\r
			 k.yxyx*Density(p + k.yxy*dx) +\r
			 k.xxxx*Density(p + k.xxx*dx))/vec4(4.*dx,4.*dx,4.*dx,4.);\r
}\r
\r
//compute shadows\r
void main()\r
{\r
    InitGrid(iResolution.xy);\r
    vec2 fragCoord = floor(gl_FragCoord.xy);\r
    vec3 pos = dim3from2(fragCoord);\r
    \r
    //ray march in the -light_dir direction\r
    const float step_size = 1.0;\r
    const int step_count = 100;\r
    float td = 0.0;\r
    vec3 rd = light_dir;\r
    float optical_density = 0.0;\r
    vec3 normal = normalize(calcNormal(pos, 0.5).xyz);\r
    pos += -normal*0.5;\r
    for(int i = 0; i < step_count; i++)\r
    {\r
        vec3 p = pos + rd * td;\r
        if(!all(lessThanEqual(p, size3d)) || !all(greaterThanEqual(p, vec3(0.0))))\r
        {\r
            break;\r
        }\r
        float d = Density(p);\r
        optical_density += d * step_size;\r
        td += step_size;\r
    }\r
\r
    out_FragColor = vec4(0.2*optical_density);\r
}`,q=`// Fork of "PCGSPH 3D" by michael0884. https://shadertoy.com/view/mstfzS\r
// 2023-10-16 03:59:48\r
\r
//Particle cluster grid smoothed particle hydrodynamics. Now in 3D.\r
//Compared to 2D this is muuuch trickier, the effective resolution tolerances are much higher.\r
//So before noone really made a liquid in 3d that looked even remotely "liquid"\r
//I think this is probably the highest (visual) resolution fluid sim on shadertoy so far.\r
//Right now I'm just tracing the particles, but I think maybe its possible to do an isosurface render somehow?\r
\r
#define FOV 2.5\r
\r
in vec3 vo;\r
in vec3 vd;\r
in vec2 v_st;\r
\r
uniform float iTime;\r
uniform int iFrame;\r
uniform vec2 iResolution;\r
uniform sampler2D iChannel0;\r
uniform sampler2D iChannel1;\r
uniform sampler2D iChannel2;\r
uniform samplerCube iChannel3;\r
uniform sampler2D lakeMap;\r
uniform sampler2D waterHeightMap;\r
uniform sampler2D rangeMap;\r
\r
uniform float heightScale;\r
uniform sampler2D heightMap;\r
\r
mat3 getCamera(vec2 angles) {\r
  mat3 theta_rot = mat3(1, 0, 0, 0, cos(angles.y), -sin(angles.y), 0, sin(angles.y), cos(angles.y));\r
\r
  mat3 phi_rot = mat3(cos(angles.x), sin(angles.x), 0., -sin(angles.x), cos(angles.x), 0., 0., 0., 1.);\r
\r
  return theta_rot * phi_rot;\r
}\r
\r
vec3 getRay(vec2 angles, vec2 pos) {\r
  mat3 camera = getCamera(angles);\r
  return normalize(transpose(camera) * vec3(FOV * pos.x, 1., FOV * pos.y));\r
}\r
\r
#define MAX_DIST 1e5\r
\r
struct Ray {\r
  vec3 ro;\r
  vec3 rd;\r
  float td;\r
  vec3 normal;\r
  vec3 color;\r
  float roughness;\r
};\r
\r
void iSphere(inout Ray ray, vec4 sphere, vec3 color, uint mass) {\r
    // vec3 sandColor = vec3(0.8, 0.7, 0.3); // 泥沙颜色\r
    // color = mix(color, sandColor, float(mass) / 2.); // 按泥沙比例混合\r
  ray.roughness = float(mass) / 2.;\r
  vec3 ro = ray.ro - sphere.xyz;\r
  float b = dot(ro, ray.rd);\r
  float c = dot(ro, ro) - sphere.w * sphere.w;\r
  float h = b * b - c;\r
  if(h > 0.) {\r
    h = sqrt(h);\r
    float d1 = -b - h;\r
    float d2 = -b + h;\r
    if(d1 >= 0.0 && d1 <= ray.td) {\r
      ray.normal = normalize(ro + ray.rd * d1);\r
      ray.color = color;\r
      ray.td = d1;\r
    } else if(d2 >= 0.0 && d2 <= ray.td) {\r
      ray.normal = normalize(ro + ray.rd * d2);\r
      ray.color = color;\r
      ray.td = d2;\r
    }\r
  }\r
}\r
\r
vec2 iBox(in vec3 ro, in vec3 rd, in vec3 boxSize) {\r
  vec3 m = sign(rd) / max(abs(rd), 1e-8);\r
  vec3 n = m * ro;\r
  vec3 k = abs(m) * boxSize;\r
\r
  vec3 t1 = -n - k;\r
  vec3 t2 = -n + k;\r
\r
  float tN = max(max(t1.x, t1.y), t1.z);\r
  float tF = min(min(t2.x, t2.y), t2.z);\r
\r
  if(tN > tF || tF <= 0.) {\r
    return vec2(MAX_DIST);\r
  } else {\r
    return vec2(tN, tF);\r
  }\r
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
#define radius 0.75\r
#define zoom 0.25\r
\r
void TraceCell(inout Ray ray, vec3 p) {\r
    //load the particles \r
  vec4 packed = LOAD3D(ch0, p);\r
  Particle p0, p1;\r
  unpackParticles(packed, p, p0, p1);\r
\r
  vec3 water_color = vec3(0.420, 0.302, 0.996);\r
  vec3 sand_color = vec3(0.359375, 0.2578125, 0.14453125);\r
\r
  if(p0.mass > 0u)\r
    iSphere(ray, vec4(p0.pos, 1.0), (p0.sand ? sand_color : water_color) * length(p0.vel), p0.mass);\r
  if(p1.mass > 0u)\r
    iSphere(ray, vec4(p1.pos, 1.0), (p1.sand ? sand_color : water_color) * length(p1.vel), p1.mass);\r
}\r
\r
void TraceCells(inout Ray ray, vec3 p) {\r
  vec3 p0 = floor(p);\r
  vec4 rho = LOAD3D(ch1, p);\r
  if(rho.z < 1e-5)\r
    return;\r
  range(i, -1, 1) range(j, -1, 1) range(k, -1, 1) {\r
        //load the particles \r
    vec3 p1 = p0 + vec3(i, j, k);\r
    TraceCell(ray, p1);\r
  }\r
}\r
\r
float Density(vec3 p) {\r
  return trilinear(ch1, p).z;\r
}\r
\r
float Shadow(vec3 p) {\r
  float optical_density = trilinear(ch2, p).x;\r
  return exp(-optical_density) + 0.05;\r
}\r
\r
vec4 calcNormal(vec3 p, float dx) {\r
  const vec3 k = vec3(1, -1, 0);\r
  return (k.xyyx * Density(p + k.xyy * dx) +\r
    k.yyxx * Density(p + k.yyx * dx) +\r
    k.yxyx * Density(p + k.yxy * dx) +\r
    k.xxxx * Density(p + k.xxx * dx)) / vec4(4. * dx, 4. * dx, 4. * dx, 4.);\r
}\r
\r
float TraceDensity(vec3 ro, vec3 rd) {\r
  const float step_size = 1.0;\r
  const int step_count = 100;\r
  float dens = 0.0;\r
  float td = 0.0;\r
  for(int i = 0; i < step_count; i++) {\r
    vec3 p = ro + rd * td;\r
    if(!all(lessThanEqual(p, size3d)) || !all(greaterThanEqual(p, vec3(0.0)))) {\r
      break;\r
    }\r
    float d = Density(p);\r
    dens += d * step_size;\r
    td += step_size;\r
  }\r
  return dens;\r
}\r
\r
vec3 rotateZ(vec3 point, float angle) {\r
  float c = cos(angle);\r
  float s = sin(angle);\r
  return vec3(point.x * c - point.y * s, point.x * s + point.y * c, point.z);\r
}\r
\r
vec3 rotateY(vec3 point, float angle) {\r
  float c = cos(angle);\r
  float s = sin(angle);\r
  return vec3(point.x * c + point.z * s, point.y, -point.x * s + point.z * c);\r
}\r
\r
vec3 rotateX(vec3 point, float angle) {\r
  float c = cos(angle);\r
  float s = sin(angle);\r
  return vec3(point.x, point.y * c - point.z * s, point.y * s + point.z * c);\r
}\r
\r
void main() {\r
  InitGrid(iResolution.xy);\r
\r
  vec3 vo_t = vo;\r
    // vec3 vo_t = vec3(vo.xy,vo.z - 0.3686868686868687* 2. / 2.);\r
  vec3 ro = (vo_t * 2. + 1.) * max(max(size3d.x, size3d.y), size3d.z) * vec3(0.5, 0.5, 0.5);\r
  vec3 rd = normalize(vd);\r
\r
  vec2 tdBox = iBox(ro - vec3(size3d) * 0.5, rd, 0.5 * vec3(size3d));\r
    // out_FragColor = vec4(size3d/256.,.9);\r
  out_FragColor = vec4(size3d / 256., .9);\r
  // out_FragColor = vec4(tdBox, 0., 1.);\r
  // vec4 c = texture(rangeMap, v_st);\r
  // out_FragColor = vec4(c.rgb, 1.);\r
  // return;\r
  if(tdBox.x < MAX_DIST) {\r
    float td = max(tdBox.x, 0.0);\r
    float step_size = 0.5;\r
    const int step_count = 400;\r
    Ray ray;\r
    ray.ro = ro;\r
    ray.rd = rd;\r
    ray.td = tdBox.y;\r
\r
    for(int i = 0; i < step_count; i++) {\r
      vec3 p = ro + rd * td;\r
      float height = GetTerrainHeight(p.xy, iResolution, heightMap, heightScale);\r
      if(height > p.z) {\r
        // out_FragColor.xyz = vec3(0., 0.5, 0.);\r
        // return;\r
        discard;\r
      }\r
      TraceCells(ray, p);\r
\r
      td += step_size;\r
      if(td > tdBox.y || ray.td < tdBox.y) {\r
        break;\r
      }\r
    }\r
\r
    if(ray.td < tdBox.y) {\r
            // vec3 p0 = ray.ro + ray.rd*ray.td;\r
            // vec3 normal = normalize(calcNormal(p0, 0.5).xyz);\r
            // normal = -normalize(mix(normal, ray.normal, 0.0));\r
            // vec3 albedo = vec3(0.220,0.349,1.000);\r
            // float LdotN = dot(normal, light_dir);\r
            // float shadow = Shadow(p0);\r
            // vec3 refl_d = reflect(ray.rd, normal);\r
            // vec3 refr_d = refract(ray.rd, normal, 1.0/1.33);\r
            // float liquid_density = TraceDensity(p0, refr_d);\r
            // vec3 liquid_color = exp(-0.1*liquid_density*vec3(0.953,0.353,0.247));\r
            // vec3 refr_color = texture(iChannel3,  refr_d.yzx).xyz * liquid_color;\r
            // vec3 refl = texture(iChannel3,  refl_d.yzx).xyz;\r
            // float K = 1. - pow(max(dot(normal,refl_d),0.), 2.);\r
            // K = mix(0.0, K, 0.5);\r
            // out_FragColor.xyz = (0.25*shadow + 1.5)*refr_color*(1.0 - K) + 0.*ray.color + 0.75*shadow*refl*K;\r
            // // out_FragColor.w = min( td/length(size3d), 1.);\r
            // out_FragColor.xyz = ray.color;\r
            // // out_FragColor.xyz = (0.25*shadow + 1.5)*refr_color*(1.0 - K) + 0.2*ray.color + 0.75*shadow*refl*K;\r
            // // out_FragColor.xyz = 2.5*shadow*albedo*LdotN*(1.0 - K) + 0.5*ray.color + shadow*refl*K;\r
\r
      vec3 p0 = ray.ro + ray.rd * ray.td;\r
      vec3 normal = normalize(calcNormal(p0, 0.5).xyz);\r
      normal = -normalize(mix(normal, ray.normal, 0.0));\r
      vec3 albedo = vec3(0.220, 0.349, 1.000);\r
      float LdotN = dot(normal, light_dir);\r
      float shadow = Shadow(p0);\r
      vec3 refl_d = reflect(ray.rd, normal);\r
      vec3 refr_d = refract(ray.rd, normal, 1.0 / 1.33);\r
      float liquid_density = TraceDensity(p0, refr_d);\r
      vec3 liquid_color = exp(-0.1 * liquid_density * 5. * vec3(0.3, 0.26, 0.23));\r
            // vec3 liquid_color = exp(0.1*liquid_density*vec3(0.359375, 0.2578125, 0.14453125)); \r
      vec3 refr_color = texture(iChannel3, refr_d.yzx).xyz * liquid_color;\r
      vec3 refl = texture(iChannel3, refl_d.yzx).xyz;\r
      float K = 1. - pow(max(dot(normal, refl_d), 0.), 2.);\r
      K = mix(0.0, K, 0.5);\r
            // out_FragColor.xyz = (0.25*shadow + 1.5)*refr_color*(1.0 - K) + 0.*ray.color + 0.75*shadow*refl*K;\r
            // out_FragColor.w = min( td/length(size3d), 1.);\r
      out_FragColor.xyz = (0.25 * shadow + 1.5) * vec3(0.359375, 0.2578125, 0.14453125) * liquid_color * (1.0 - K);\r
            // out_FragColor.xyz = ray.color;\r
    } else\r
      discard;\r
  } else\r
    discard;\r
}`,{defaultValue:B,Cartographic:S,sampleTerrain:Y}=Cesium,j=async(D,e)=>{const r=[];return e.forEach((t,i)=>{const a=new Promise((o,n)=>{if(t.height=D.scene.sampleHeight(t),!t.height)debugger;if(t.height==null)debugger;o(t),console.log("finshed:"+i)});r.push(a)}),Promise.all(r)};class Z{constructor(e){this._viewer=e.viewer,this._viewer.scene.msaaSamples=4,this._viewer.scene.highDynamicRange=!0,this._viewer.postProcessStages.fxaa.enabled=!0,this._viewer.scene.globe.depthTestAgainstTerrain=!0,this._viewer.scene.debugShowFramesPerSecond=!0,this.validArea=e.validArea,this._width=2e3,this._height=2e3,this._texScale=1,this.cellSize=e.cellSize?e.cellSize*Math.max(e.width,e.height)/(this._width/10):30,this.rect=new Cesium.Cartesian2(e.rect[0],e.rect[1]),this._resolution=new Cesium.Cartesian2(this._width*this._texScale,this._height*this._texScale),this._texOffset=new Cesium.Cartesian2(this.validArea.xmin,this.validArea.ymin),this._texR=new Cesium.Cartesian2(e.width,e.height),this._waterAdd=new Cesium.Cartesian4(0,0,0,0),this._deepWaterColor=B(e.deepWaterColor?Cesium.Color.fromCssColorString(e.deepWaterColor):void 0,new Cesium.Cartesian4(.359375,.2578125,.14453125,1)),this._lightWaterColor=B(e.lightWaterColor?Cesium.Color.fromCssColorString(e.lightWaterColor):void 0,new Cesium.Cartesian4(.7176,.5508,.0703,1)),this.renderHeatMap=!1,this.LakeGeoJson=e.debrisJSON,this.lakeName=e.lakeName,this.range=new Cesium.Cartesian2(e.range[0],e.range[1]),this.dataSet=[],this.dataSet2=[],this.dataSet3=[],this.renderSpeed=1,this.preRender=e.preRender,this.postRender=e.postRender,this.onDataUpdate=e.onDataUpdate}async initBox(e){this.center=e.center;const r=this.lakeName=="YaAn"?YaAnHeight:await this.initTerrain(e.center,e.level);await this.genDemTexture(r),this.initShader(),await this.initTexture(),this.initFrameBuffer(),this.initRender()}initTerrain(e,r){const t=[],i=this._width/10,a=this._height/10;for(let o=0;o<a;o++)for(let n=0;n<i;n++){const l=[(n-i/2+.5)*this.cellSize,(o-a/2+.5)*this.cellSize],d=R(e,l);t.push(S.fromCartesian(d))}return this.lakeName=="YaAn"?j(this._viewer,t):Y(this._viewer.terrainProvider,r,t)}genDemForModel(e){}loadImage(e){return new Promise((r,t)=>{const i=new Image;i.setAttribute("crossOrigin","anonymous"),i.src=e,i.onload=()=>{r(i)},i.onerror=()=>{t(new Error("图像加载失败"))}})}async genDemTexture(e){this.terrainData=e;const r=this._width/10,t=this._height/10,i=new Float32Array(r*t*4),a=new Float32Array(r*t*4);let o=0;const n=300,l=new ArrayBuffer(r*t*4),d=new ArrayBuffer(r*t*4),h=new ArrayBuffer(r*t*4),u=new ArrayBuffer(r*t*4),y=new DataView(l),v=new DataView(d),_=new DataView(h),g=new DataView(u);let C=0,s=999999;for(let p=0;p<t;p++)for(let m=0;m<r;m++){let c=p*r+m;C=Math.max(e[c].height,C),s=Math.min(e[c].height,s)}function f(p,m,c){return Math.min(Math.max(p,m),c)}for(let p=0;p<t;p++)for(let m=0;m<r;m++){let c=p*r+m,z=(t-1-p)*r+m;const M=f((e[c].height-s)/(C-s),0,1);i[c*4]=i[c*4+1]=i[c*4+2]=i[c*4+3]=M,y.setInt32(z*4,e[c].height,!1),g.setInt32(z*4,100,!1);const F=T([Cesium.Math.toDegrees(e[c].longitude),Cesium.Math.toDegrees(e[c].latitude)]);this.LakeGeoJson.features.forEach(k=>{A(F,k)&&(a[c*4]=a[c*4+1]=a[c*4+2]=a[c*4+3]=1,v.setInt32(z*4,80,!1),o<n&&(_.setInt32(z*4,10,!1),o++))})}this.demMap=x.createTexture({context:this._viewer.scene.context,width:r,height:t,pixelFormat:Cesium.PixelFormat.RGBA,pixelDatatype:Cesium.PixelDatatype.FLOAT,arrayBufferView:i}),this.lakeMap=x.createTexture({context:this._viewer.scene.context,flipY:!1,width:r,height:t,pixelFormat:Cesium.PixelFormat.RGBA,pixelDatatype:Cesium.PixelDatatype.FLOAT,arrayBufferView:a}),this.waterHeightMap=x.createTexture({context:this._viewer.scene.context,width:r,height:t,pixelFormat:Cesium.PixelFormat.RGBA,pixelDatatype:Cesium.PixelDatatype.FLOAT,arrayBufferView:a}),this.rangeMap=x.createTexture({context:this._viewer.scene.context,width:r,height:t,pixelFormat:Cesium.PixelFormat.RGBA,pixelDatatype:Cesium.PixelDatatype.FLOAT,arrayBufferView:a}),this.rangeTempMap=x.createTexture({context:this._viewer.scene.context,width:r,height:t,pixelFormat:Cesium.PixelFormat.RGBA,pixelDatatype:Cesium.PixelDatatype.FLOAT,arrayBufferView:a}),this.max=C,this.min=s,this.heightScale=(this.max-this.min)/(this._width/10*this.cellSize),this.texData=i,this.demBlob=new Blob([l],{type:"application/octet-stream"}),this.binghuBlob=new Blob([d],{type:"application/octet-stream"}),this.sourceBlob=new Blob([h],{type:"application/octet-stream"}),this.glacierBlob=new Blob([u],{type:"application/octet-stream"}),this.demBuffer=l,this.binghuBuffer=d,this.sourceBuffer=h,this.glacierBuffer=u}initShader(){this.Command=E,this.BufferRange=O,this.BufferA=G,this.BufferB=V,this.BufferC=N,this.BufferD=W,this.renderShaderSource=q}async initTexture(){this.texA=x.createTexture({context:this._viewer.scene.context,width:this._width*this._texScale,height:this._height*this._texScale,pixelFormat:Cesium.PixelFormat.RGBA,pixelDatatype:Cesium.PixelDatatype.FLOAT,arrayBufferView:new Float32Array(this._width*this._texScale*this._height*this._texScale*4)}),this.texB=x.createTexture({context:this._viewer.scene.context,width:this._width*this._texScale,height:this._height*this._texScale,pixelFormat:Cesium.PixelFormat.RGBA,pixelDatatype:Cesium.PixelDatatype.FLOAT,arrayBufferView:new Float32Array(this._width*this._texScale*this._height*this._texScale*4)}),this.texC=x.createTexture({context:this._viewer.scene.context,width:this._width*this._texScale,height:this._height*this._texScale,pixelFormat:Cesium.PixelFormat.RGBA,pixelDatatype:Cesium.PixelDatatype.FLOAT,arrayBufferView:new Float32Array(this._width*this._texScale*this._height*this._texScale*4)}),this.texD=x.createTexture({context:this._viewer.scene.context,width:this._width*this._texScale,height:this._height*this._texScale,pixelFormat:Cesium.PixelFormat.RGBA,pixelDatatype:Cesium.PixelDatatype.FLOAT,arrayBufferView:new Float32Array(this._width*this._texScale*this._height*this._texScale*4)});const e=[];for(let t=0;t<6;t++)e.push(Cesium.Resource.fetchImage({url:"Simulation/image/488bd40303a2e2b9a71987e48c66ef41f5e937174bf316d3ed0e86410784b919"+(t==0?"":"_"+t)+".jpg"}));const r=this;Promise.all(e).then(t=>{r.cubeMap=new Cesium.CubeMap({context:r._viewer.scene.context,source:{positiveX:t[0],negativeX:t[1],positiveY:t[2],negativeY:t[3],positiveZ:t[4],negativeZ:t[5]}})}),this.cubeMap=this._viewer.scene.context._defaultCubeMap}initFrameBuffer(){const e=this;this.quadGeometry=x.getFullscreenQuad(),this.Buffer_RangeT=new w({commandType:"Compute",uniformMap:{rect:()=>this.rect,rangeMap:()=>this.rangeMap,waterHeightMap:()=>this.waterHeightMap},fragmentShaderSource:new Cesium.ShaderSource({sources:[this.BufferRange]}),geometry:this.quadGeometry,outputTexture:this.rangeTempMap,preExecute:function(){e.Buffer_RangeT.commandToExecute.outputTexture=e.rangeTempMap}}),this.Buffer_Range=new w({commandType:"Compute",uniformMap:{rect:()=>this.rect,rangeMap:()=>this.rangeTempMap,waterHeightMap:()=>this.waterHeightMap},fragmentShaderSource:new Cesium.ShaderSource({sources:[this.BufferRange]}),geometry:this.quadGeometry,outputTexture:this.rangeMap,preExecute:function(){e.Buffer_Range.commandToExecute.outputTexture=e.rangeMap}}),this.Buffer_A=new w({commandType:"Compute",uniformMap:{iTime:()=>this.time,iFrame:()=>this.frame,iResolution:()=>this._resolution,iChannel0:()=>this.texC,waterAdd:()=>this._waterAdd,TerrainWaterMap:()=>this.texC,OutFlow:()=>this.texD,heightMap:()=>this.demMap,lakeMap:()=>this.lakeMap,waterHeightMap:()=>this.waterHeightMap},fragmentShaderSource:new Cesium.ShaderSource({sources:[this.Command,this.BufferA]}),geometry:this.quadGeometry,outputTexture:this.texA,preExecute:function(){e.Buffer_A.commandToExecute.outputTexture=e.texA}}),this.Buffer_B=new w({commandType:"Compute",uniformMap:{iTime:()=>this.time,iFrame:()=>this.frame,iResolution:()=>this._resolution,iChannel0:()=>this.texA,lakeMap:()=>this.lakeMap,waterHeightMap:()=>this.waterHeightMap},fragmentShaderSource:new Cesium.ShaderSource({sources:[this.Command,this.BufferB]}),geometry:this.quadGeometry,outputTexture:this.texB,preExecute:function(){e.Buffer_B.commandToExecute.outputTexture=e.texB}}),this.Buffer_C=new w({commandType:"Compute",uniformMap:{iTime:()=>this.time,iFrame:()=>this.frame,iResolution:()=>this._resolution,iChannel0:()=>this.texA,iChannel1:()=>this.texB,heightMap:()=>this.demMap,heightScale:()=>this.heightScale,lakeMap:()=>this.lakeMap,waterHeightMap:()=>this.waterHeightMap,rangeMap:()=>this.rangeMap,texR:()=>this._texR,texOffset:()=>this._texOffset},fragmentShaderSource:new Cesium.ShaderSource({sources:[this.Command,this.BufferC]}),geometry:this.quadGeometry,outputTexture:this.texC,preExecute:function(){e.Buffer_C.commandToExecute.outputTexture=e.texC}}),this.Buffer_D=new w({commandType:"Compute",uniformMap:{iTime:()=>this.time,iFrame:()=>this.frame,iResolution:()=>this._resolution,iChannel1:()=>this.texB,lakeMap:()=>this.lakeMap,waterHeightMap:()=>this.waterHeightMap},fragmentShaderSource:new Cesium.ShaderSource({sources:[this.Command,this.BufferD]}),geometry:this.quadGeometry,outputTexture:this.texD,preExecute:function(){e.Buffer_D.commandToExecute.outputTexture=e.texD}})}initRender(){const e=S.fromCartesian(this.center),r=[Cesium.Math.toDegrees(e.longitude),Cesium.Math.toDegrees(e.latitude),e.height],t=P(r,[0,0,0],[this._width/10*this.cellSize,this._height/10*this.cellSize,this._width/10*this.cellSize]),i=Cesium.BoxGeometry.fromDimensions({vertexFormat:Cesium.VertexFormat.POSITION_AND_ST,dimensions:new Cesium.Cartesian3(1,1,1)}),a=Cesium.BoxGeometry.createGeometry(i),o=Cesium.GeometryPipeline.createAttributeLocations(a);this.fluidCommand=new w({commandType:"Draw",uniformMap:{iTime:()=>this.time,iFrame:()=>this.frame,iResolution:()=>this._resolution,iChannel0:()=>this.texA,iChannel1:()=>this.texB,iChannel2:()=>this.texD,iChannel3:()=>this.cubeMap??this._viewer.scene.context._defaultCubeMap,heightMap:()=>this.demMap,heightScale:()=>this.heightScale,waterHeightMap:()=>this.waterHeightMap,lakeMap:()=>this.lakeMap,rangeMap:()=>this.rangeMap,waterColor:()=>this._deepWaterColor,lightWaterColor:()=>this._lightWaterColor,renderHeatMap:()=>this.renderHeatMap},geometry:a,modelMatrix:t,attributeLocations:o,vertexShaderSource:new Cesium.ShaderSource({sources:[`
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
                   `]}),fragmentShaderSource:new Cesium.ShaderSource({sources:[this.Command+this.renderShaderSource]}),rawRenderState:{depthTest:{enabled:!0},blending:Cesium.BlendingState.ALPHA_BLEND}}),this._viewer.scene.primitives.add(this.Buffer_Range),this._viewer.scene.primitives.add(this.Buffer_RangeT),this._viewer.scene.primitives.add(this.Buffer_A),this._viewer.scene.primitives.add(this.Buffer_B),this._viewer.scene.primitives.add(this.Buffer_C),this._viewer.scene.primitives.add(this.Buffer_D),this._viewer.scene.primitives.add(this.fluidCommand);const n=this;this.time=0,this.frame=0,this.dataSetIdx=0,this.preEvent=()=>{n.preRender&&n.preRender(n)},this.postEvent=()=>{performance.now(),n.time+=.002*n.renderSpeed,n.frame+=.01*n.renderSpeed,n.dataSet.length&&(n.setWaterHeight(n.dataSet[n.dataSetIdx]),n.dataSetIdx=Number.parseInt(n.frame*2%n.dataSet.length),n.dataSetIdx>=n.dataSet.length&&(n.dataSetIdx=n.dataSet.length-1),n.onDataUpdate&&n.onDataUpdate(n)),n.postRender&&n.postRender(n)},this._viewer.scene.preRender.addEventListener(this.preEvent),this._viewer.scene.postRender.addEventListener(this.postEvent)}addWater(e,r){const{theta:t,distance:i}=L(this.center,e),a=i*Math.cos(Cesium.Math.toRadians(t)),o=i*Math.sin(Cesium.Math.toRadians(t));if(Math.abs(a)>this._height*this.cellSize||Math.abs(o)>this._width*this.cellSize){this._waterAdd.w=0;return}const n=parseInt(o/this.cellSize)+this._width/2,l=parseInt(a/this.cellSize)+this._height/2;this._waterAdd.x=n,this._waterAdd.y=this._height-1-l,this._waterAdd.z=r,this._waterAdd.w=1}StopAddWater(){this._waterAdd.w=0}async pushFortronData(e){this.dataSet.push("data:image/png;base64,"+e)}async setRange(e){const r=await b(e),t=new Cesium.Texture({context:this._viewer.scene.frameState.context,source:r,sampler:new Cesium.Sampler({wrapS:Cesium.TextureWrap.REPEAT,wrapT:Cesium.TextureWrap.REPEAT,magnificationFilter:Cesium.TextureMagnificationFilter.LINEAR,minificationFilter:Cesium.TextureMinificationFilter.LINEAR_MIPMAP_LINEAR})});t.generateMipmap(),this.rangeMap=t}async setWaterHeight(e){const r=await b(e),t=new Cesium.Texture({context:this._viewer.scene.frameState.context,source:r,flipY:!0,sampler:new Cesium.Sampler({wrapS:Cesium.TextureWrap.REPEAT,wrapT:Cesium.TextureWrap.REPEAT,magnificationFilter:Cesium.TextureMagnificationFilter.LINEAR,minificationFilter:Cesium.TextureMinificationFilter.LINEAR_MIPMAP_LINEAR})});t.generateMipmap();const i=this.waterHeightMap;this.waterHeightMap=t,i.destroy()}setRenderOpts(e){e.deepWaterColor&&(this._deepWaterColor=Cesium.Color.fromCssColorString(e.deepWaterColor)),e.lightWaterColor&&(this._lightWaterColor=Cesium.Color.fromCssColorString(e.lightWaterColor)),this.renderHeatMap=e.renderHeatMap}async getInundation(e){const r=this;return new Promise((i,a)=>{X(r.dataSet[Math.floor(r.dataSetIdx/15)]).then(o=>{const n=[];for(let h=0;h<r._height;h++)for(let u=0;u<r._width;u++){h*r._width+u;let y=(r._height-1-h)*r._width+u;if(o[y*4]!=0&&o[y*4+1]!=0&&o[y*4+2]!=0){const v=[(u-r._width/2+.5)*r.cellSize,(h-r._height/2+.5)*r.cellSize],_=R(r.center,v),g=S.fromCartesian(_);n.push(T([Cesium.Math.toDegrees(g.longitude),Cesium.Math.toDegrees(g.latitude)]))}}const l={units:"miles",maxEdge:10},d=I(H(n),l);i(d)})})}async loadAscAsWaterHeight(e,r){const i=(await fetch(e).then(s=>s.text())).trim().split(/\r?\n/),a={};for(let s=0;s<6;s++){const f=i[s].trim().split(/\s+/);a[f[0].toLowerCase()]=Number(f[1])}const o=a.ncols,n=a.nrows,l=a.nodata_value,d=new Float32Array(o*n);let h=0;for(let s=6;s<i.length;s++){const f=i[s].trim().split(/\s+/).map(Number);for(const p of f)h<d.length&&(d[h++]=p===l?0:p)}const u=[];for(const s of d)s>0&&u.push(s);const y=r||Math.max(...u);this.range=new Cesium.Cartesian2(0,y);const v=this._width/10,_=this._height/10,g=new Float32Array(v*_*4);for(let s=0;s<_;s++)for(let f=0;f<v;f++){const p=Math.min(o-1,Math.floor(f/v*o)),m=Math.min(n-1,Math.floor(s/_*n)),c=n-1-m,z=d[c*o+p],M=Cesium.Math.clamp(z/y,0,1),F=(s*v+f)*4;g[F]=M,g[F+1]=M,g[F+2]=M,g[F+3]=1}const C=x.createTexture({context:this._viewer.scene.context,width:v,height:_,pixelFormat:Cesium.PixelFormat.RGBA,pixelDatatype:Cesium.PixelDatatype.FLOAT,arrayBufferView:g});this.waterHeightMap&&this.waterHeightMap.destroy(),this.waterHeightMap=C,console.log("[SPH] ASC",o,"x",n,"→",v,"x",_,"max:",y.toFixed(2))}remove(){this._viewer.scene.primitives.remove(this.fluidCommand),this._viewer.scene.primitives.remove(this.Buffer_D),this._viewer.scene.primitives.remove(this.Buffer_C),this._viewer.scene.primitives.remove(this.Buffer_B),this._viewer.scene.primitives.remove(this.Buffer_A),this._viewer.scene.primitives.remove(this.Buffer_RangeT),this._viewer.scene.primitives.remove(this.Buffer_Range)}}const X=async D=>new Promise((r,t)=>{const i=new Image;i.onload=function(){const a=document.createElement("canvas");a.width=i.width,a.height=i.height;const o=a.getContext("2d");o.drawImage(i,0,0);const l=o.getImageData(0,0,a.width,a.height).data;r(l)},i.src=D});export{Z as default};
