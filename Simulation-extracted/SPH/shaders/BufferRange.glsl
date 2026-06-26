uniform ivec2 rect;
uniform sampler2D rangeMap;
uniform sampler2D waterHeightMap;
void main() {
    // ivec2 p = ivec2(gl_FragCoord.xy);
    // ivec2 p2 = ivec2(gl_FragCoord.xy);
    // if(rect.x > rect.y)
    //     p2.y -= (rect.x - rect.y) / 2;
    // else
    //     p2.x -= (rect.y - rect.x) / 2;
    // float canFlow = 0.;
    // if(texelFetch(rangeMap, p, 0).r != 0.)
    //     canFlow = 1.;
    // if(texelFetch(waterHeightMap, p2, 0).r != 0.)
    //     canFlow = 1.;

    ivec2 p = ivec2(gl_FragCoord.xy);
    float canFlow = 0.;
    if(texelFetch(rangeMap, p, 0).r != 0.)
        canFlow = 1.;
    if(texelFetch(waterHeightMap, p, 0).r != 0.)
        canFlow = 1.;

    out_FragColor = vec4(vec3(canFlow), 1.);
}