// Fork of "PCGSPH 3D" by michael0884. https://shadertoy.com/view/mstfzS
// 2023-10-16 03:59:48

//Particle cluster grid smoothed particle hydrodynamics. Now in 3D.
//Compared to 2D this is muuuch trickier, the effective resolution tolerances are much higher.
//So before noone really made a liquid in 3d that looked even remotely "liquid"
//I think this is probably the highest (visual) resolution fluid sim on shadertoy so far.
//Right now I'm just tracing the particles, but I think maybe its possible to do an isosurface render somehow?

#define FOV 2.5

in vec3 vo;
in vec3 vd;
in vec2 v_st;

uniform float iTime;
uniform int iFrame;
uniform vec2 iResolution;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;
uniform samplerCube iChannel3;
uniform sampler2D lakeMap;
uniform sampler2D waterHeightMap;
uniform sampler2D rangeMap;

uniform float heightScale;
uniform sampler2D heightMap;

mat3 getCamera(vec2 angles) {
  mat3 theta_rot = mat3(1, 0, 0, 0, cos(angles.y), -sin(angles.y), 0, sin(angles.y), cos(angles.y));

  mat3 phi_rot = mat3(cos(angles.x), sin(angles.x), 0., -sin(angles.x), cos(angles.x), 0., 0., 0., 1.);

  return theta_rot * phi_rot;
}

vec3 getRay(vec2 angles, vec2 pos) {
  mat3 camera = getCamera(angles);
  return normalize(transpose(camera) * vec3(FOV * pos.x, 1., FOV * pos.y));
}

#define MAX_DIST 1e5

struct Ray {
  vec3 ro;
  vec3 rd;
  float td;
  vec3 normal;
  vec3 color;
  float roughness;
};

void iSphere(inout Ray ray, vec4 sphere, vec3 color, uint mass) {
    // vec3 sandColor = vec3(0.8, 0.7, 0.3); // 泥沙颜色
    // color = mix(color, sandColor, float(mass) / 2.); // 按泥沙比例混合
  ray.roughness = float(mass) / 2.;
  vec3 ro = ray.ro - sphere.xyz;
  float b = dot(ro, ray.rd);
  float c = dot(ro, ro) - sphere.w * sphere.w;
  float h = b * b - c;
  if(h > 0.) {
    h = sqrt(h);
    float d1 = -b - h;
    float d2 = -b + h;
    if(d1 >= 0.0 && d1 <= ray.td) {
      ray.normal = normalize(ro + ray.rd * d1);
      ray.color = color;
      ray.td = d1;
    } else if(d2 >= 0.0 && d2 <= ray.td) {
      ray.normal = normalize(ro + ray.rd * d2);
      ray.color = color;
      ray.td = d2;
    }
  }
}

vec2 iBox(in vec3 ro, in vec3 rd, in vec3 boxSize) {
  vec3 m = sign(rd) / max(abs(rd), 1e-8);
  vec3 n = m * ro;
  vec3 k = abs(m) * boxSize;

  vec3 t1 = -n - k;
  vec3 t2 = -n + k;

  float tN = max(max(t1.x, t1.y), t1.z);
  float tF = min(min(t2.x, t2.y), t2.z);

  if(tN > tF || tF <= 0.) {
    return vec2(MAX_DIST);
  } else {
    return vec2(tN, tF);
  }
}

vec2 hitBox(vec3 orig, vec3 dir) {
  const vec3 box_min = vec3(-0.5);
  const vec3 box_max = vec3(0.5);
  vec3 inv_dir = 1.0 / dir;
  vec3 tmin_tmp = (box_min - orig) * inv_dir;
  vec3 tmax_tmp = (box_max - orig) * inv_dir;
  vec3 tmin = min(tmin_tmp, tmax_tmp);
  vec3 tmax = max(tmin_tmp, tmax_tmp);
  float t0 = max(tmin.x, max(tmin.y, tmin.z));
  float t1 = min(tmax.x, min(tmax.y, tmax.z));
  return vec2(t0, t1);
}

#define radius 0.75
#define zoom 0.25

void TraceCell(inout Ray ray, vec3 p) {
    //load the particles 
  vec4 packed = LOAD3D(ch0, p);
  Particle p0, p1;
  unpackParticles(packed, p, p0, p1);

  vec3 water_color = vec3(0.420, 0.302, 0.996);
  vec3 sand_color = vec3(0.359375, 0.2578125, 0.14453125);

  if(p0.mass > 0u)
    iSphere(ray, vec4(p0.pos, 1.0), (p0.sand ? sand_color : water_color) * length(p0.vel), p0.mass);
  if(p1.mass > 0u)
    iSphere(ray, vec4(p1.pos, 1.0), (p1.sand ? sand_color : water_color) * length(p1.vel), p1.mass);
}

void TraceCells(inout Ray ray, vec3 p) {
  vec3 p0 = floor(p);
  vec4 rho = LOAD3D(ch1, p);
  if(rho.z < 1e-5)
    return;
  range(i, -1, 1) range(j, -1, 1) range(k, -1, 1) {
        //load the particles 
    vec3 p1 = p0 + vec3(i, j, k);
    TraceCell(ray, p1);
  }
}

float Density(vec3 p) {
  return trilinear(ch1, p).z;
}

float Shadow(vec3 p) {
  float optical_density = trilinear(ch2, p).x;
  return exp(-optical_density) + 0.05;
}

vec4 calcNormal(vec3 p, float dx) {
  const vec3 k = vec3(1, -1, 0);
  return (k.xyyx * Density(p + k.xyy * dx) +
    k.yyxx * Density(p + k.yyx * dx) +
    k.yxyx * Density(p + k.yxy * dx) +
    k.xxxx * Density(p + k.xxx * dx)) / vec4(4. * dx, 4. * dx, 4. * dx, 4.);
}

float TraceDensity(vec3 ro, vec3 rd) {
  const float step_size = 1.0;
  const int step_count = 100;
  float dens = 0.0;
  float td = 0.0;
  for(int i = 0; i < step_count; i++) {
    vec3 p = ro + rd * td;
    if(!all(lessThanEqual(p, size3d)) || !all(greaterThanEqual(p, vec3(0.0)))) {
      break;
    }
    float d = Density(p);
    dens += d * step_size;
    td += step_size;
  }
  return dens;
}

vec3 rotateZ(vec3 point, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return vec3(point.x * c - point.y * s, point.x * s + point.y * c, point.z);
}

vec3 rotateY(vec3 point, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return vec3(point.x * c + point.z * s, point.y, -point.x * s + point.z * c);
}

vec3 rotateX(vec3 point, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return vec3(point.x, point.y * c - point.z * s, point.y * s + point.z * c);
}

void main() {
  InitGrid(iResolution.xy);

  vec3 vo_t = vo;
    // vec3 vo_t = vec3(vo.xy,vo.z - 0.3686868686868687* 2. / 2.);
  vec3 ro = (vo_t * 2. + 1.) * max(max(size3d.x, size3d.y), size3d.z) * vec3(0.5, 0.5, 0.5);
  vec3 rd = normalize(vd);

  vec2 tdBox = iBox(ro - vec3(size3d) * 0.5, rd, 0.5 * vec3(size3d));
    // out_FragColor = vec4(size3d/256.,.9);
  out_FragColor = vec4(size3d / 256., .9);
  // out_FragColor = vec4(tdBox, 0., 1.);
  // vec4 c = texture(rangeMap, v_st);
  // out_FragColor = vec4(c.rgb, 1.);
  // return;
  if(tdBox.x < MAX_DIST) {
    float td = max(tdBox.x, 0.0);
    float step_size = 0.5;
    const int step_count = 400;
    Ray ray;
    ray.ro = ro;
    ray.rd = rd;
    ray.td = tdBox.y;

    for(int i = 0; i < step_count; i++) {
      vec3 p = ro + rd * td;
      float height = GetTerrainHeight(p.xy, iResolution, heightMap, heightScale);
      if(height > p.z) {
        // out_FragColor.xyz = vec3(0., 0.5, 0.);
        // return;
        discard;
      }
      TraceCells(ray, p);

      td += step_size;
      if(td > tdBox.y || ray.td < tdBox.y) {
        break;
      }
    }

    if(ray.td < tdBox.y) {
            // vec3 p0 = ray.ro + ray.rd*ray.td;
            // vec3 normal = normalize(calcNormal(p0, 0.5).xyz);
            // normal = -normalize(mix(normal, ray.normal, 0.0));
            // vec3 albedo = vec3(0.220,0.349,1.000);
            // float LdotN = dot(normal, light_dir);
            // float shadow = Shadow(p0);
            // vec3 refl_d = reflect(ray.rd, normal);
            // vec3 refr_d = refract(ray.rd, normal, 1.0/1.33);
            // float liquid_density = TraceDensity(p0, refr_d);
            // vec3 liquid_color = exp(-0.1*liquid_density*vec3(0.953,0.353,0.247));
            // vec3 refr_color = texture(iChannel3,  refr_d.yzx).xyz * liquid_color;
            // vec3 refl = texture(iChannel3,  refl_d.yzx).xyz;
            // float K = 1. - pow(max(dot(normal,refl_d),0.), 2.);
            // K = mix(0.0, K, 0.5);
            // out_FragColor.xyz = (0.25*shadow + 1.5)*refr_color*(1.0 - K) + 0.*ray.color + 0.75*shadow*refl*K;
            // // out_FragColor.w = min( td/length(size3d), 1.);
            // out_FragColor.xyz = ray.color;
            // // out_FragColor.xyz = (0.25*shadow + 1.5)*refr_color*(1.0 - K) + 0.2*ray.color + 0.75*shadow*refl*K;
            // // out_FragColor.xyz = 2.5*shadow*albedo*LdotN*(1.0 - K) + 0.5*ray.color + shadow*refl*K;

      vec3 p0 = ray.ro + ray.rd * ray.td;
      vec3 normal = normalize(calcNormal(p0, 0.5).xyz);
      normal = -normalize(mix(normal, ray.normal, 0.0));
      vec3 albedo = vec3(0.220, 0.349, 1.000);
      float LdotN = dot(normal, light_dir);
      float shadow = Shadow(p0);
      vec3 refl_d = reflect(ray.rd, normal);
      vec3 refr_d = refract(ray.rd, normal, 1.0 / 1.33);
      float liquid_density = TraceDensity(p0, refr_d);
      vec3 liquid_color = exp(-0.1 * liquid_density * 5. * vec3(0.3, 0.26, 0.23));
            // vec3 liquid_color = exp(0.1*liquid_density*vec3(0.359375, 0.2578125, 0.14453125)); 
      vec3 refr_color = texture(iChannel3, refr_d.yzx).xyz * liquid_color;
      vec3 refl = texture(iChannel3, refl_d.yzx).xyz;
      float K = 1. - pow(max(dot(normal, refl_d), 0.), 2.);
      K = mix(0.0, K, 0.5);
            // out_FragColor.xyz = (0.25*shadow + 1.5)*refr_color*(1.0 - K) + 0.*ray.color + 0.75*shadow*refl*K;
            // out_FragColor.w = min( td/length(size3d), 1.);
      out_FragColor.xyz = (0.25 * shadow + 1.5) * vec3(0.359375, 0.2578125, 0.14453125) * liquid_color * (1.0 - K);
            // out_FragColor.xyz = ray.color;
    } else
      discard;
  } else
    discard;
}