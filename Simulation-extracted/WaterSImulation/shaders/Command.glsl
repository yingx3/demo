// Render
const vec3 backgroundColor = vec3(0.2);
// Terrain
const float transitionTime = 5.0;
const float transitionPercent = 0.3;
const int octaves = 7;
// Water simulation
const float attenuation = 0.995;
const float strenght = 0.00525;
const float minTotalFlow = 0.0001;
const float initialWaterLevel = 0.0;
const int radius = 5;

mat2 rot(in float ang) {
    return mat2(cos(ang), -sin(ang), sin(ang), cos(ang));
}

// hash from Dave_Hoskins https://www.shadertoy.com/view/4djSRW
float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

float hash13(vec3 p3) {
    p3 = fract(p3 * .1031);
    p3 += dot(p3, p3.zyx + 31.32);
    return fract((p3.x + p3.y) * p3.z);
}

// Box intersection by IQ https://iquilezles.org/articles/boxfunctions

vec2 boxIntersection(in vec3 ro, in vec3 rd, in vec3 rad, out vec3 oN) {
    vec3 m = 1.0 / rd;
    vec3 n = m * ro;
    vec3 k = abs(m) * rad;
    vec3 t1 = -n - k;
    vec3 t2 = -n + k;

    float tN = max(max(t1.x, t1.y), t1.z);
    float tF = min(min(t2.x, t2.y), t2.z);

    if(tN > tF || tF < 0.0)
        return vec2(-1.0); // no intersection

    oN = -sign(rd) * step(t1.yzx, t1.xyz) * step(t1.zxy, t1.xyz);

    return vec2(tN, tF);
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

vec4 blur(sampler2D tex, ivec2 uv) {
    int offset = 1;
  // 左上
    vec4 color = texelFetch(tex, ivec2(uv.x - offset, uv.y - offset), 0) * 0.0947416;
  // 上
    color += texelFetch(tex, ivec2(uv.x, uv.y - offset), 0) * 0.118318;
  // 右上
    color += texelFetch(tex, ivec2(uv.x + offset, uv.y + offset), 0) * 0.0947416;
  // 左
    color += texelFetch(tex, ivec2(uv.x - offset, uv.y), 0) * 0.118318;
  // 中
    color += texelFetch(tex, ivec2(uv.x, uv.y), 0) * 0.147761;
  // 右
    color += texelFetch(tex, ivec2(uv.x + offset, uv.y), 0) * 0.118318;
  // 左下
    color += texelFetch(tex, ivec2(uv.x - offset, uv.y + offset), 0) * 0.0947416;
  // 下
    color += texelFetch(tex, ivec2(uv.x, uv.y + offset), 0) * 0.118318;
  // 右下
    color += texelFetch(tex, ivec2(uv.x + offset, uv.y - offset), 0) * 0.0947416;

    return color;
}

vec3 getColorByValue(float v) {
    vec3 colorRamp[5];
    colorRamp[0] = vec3(55., 149., 196.) / 255.;
    colorRamp[1] = vec3(161., 194., 153.) / 255.;
    colorRamp[2] = vec3(250., 250., 102.) / 255.;
    colorRamp[3] = vec3(250., 146., 55.) / 255.;
    colorRamp[4] = vec3(232., 24., 21.) / 255.;
    return colorRamp[int(clamp(v / .2, 0., 4.))];
}

// 在5个颜色之间进行插值的函数
vec3 getColorByValue2(float value) {

    vec3 colorRamp[5];
    colorRamp[0] = vec3(140., 120., 90.) / 255.;
    colorRamp[1] = vec3(160., 130., 80.) / 255.;
    colorRamp[2] = vec3(140., 100., 55.) / 255.;
    colorRamp[3] = vec3(110., 70., 35.) / 255.;
    colorRamp[4] = vec3(70., 40., 20.) / 255.;
    // 将值限制在[0, 1]范围内
    value = clamp(value, 0.0, 1.0);

    // 将值映射到[0, 4]的范围（5个颜色段有4个区间）
    float scaledValue = value * 4.0;

    // 获取当前所在的区间索引
    int index = int(floor(scaledValue));

    // 获取在当前区间内的插值因子
    float t = scaledValue - floor(scaledValue);

    // 根据索引进行颜色插值
    // 使用if-else而不是动态数组索引，提高兼容性
    vec3 color1, color2;

    if(index == 0) {
        color1 = colorRamp[0];
        color2 = colorRamp[1];
    } else if(index == 1) {
        color1 = colorRamp[1];
        color2 = colorRamp[2];
    } else if(index == 2) {
        color1 = colorRamp[2];
        color2 = colorRamp[3];
    } else { // index >= 3
        color1 = colorRamp[3];
        color2 = colorRamp[4];
    }

    // 线性插值
    return mix(color1, color2, t);
}

// Fog by IQ https://iquilezles.org/articles/fog

vec3 applyFog(in vec3 rgb, vec3 fogColor, in float distance) {
    float fogAmount = exp(-distance);
    return mix(fogColor, rgb, fogAmount);
}