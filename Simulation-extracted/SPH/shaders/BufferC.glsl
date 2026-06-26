uniform float iTime;
uniform int iFrame;
uniform vec2 iResolution;
uniform vec2 texR;
uniform vec2 texOffset;
uniform float heightScale;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D lakeMap;
uniform sampler2D heightMap;
uniform sampler2D waterHeightMap;
uniform sampler2D rangeMap;
void main() {
    InitGrid(iResolution.xy);
    vec2 fragCoord = floor(gl_FragCoord.xy);
    vec3 pos = dim3from2(fragCoord);

    Particle p0, p1;

    //load the particles
    vec4 packed = LOAD3D(ch0, pos);
    unpackParticles(packed, pos, p0, p1);

    //load density
    vec2 densities = LOAD3D(ch1, pos).xy;
    p0.density = densities.x;
    p1.density = densities.y;

    if(p0.mass + p1.mass > 0u) {
        range(i, -2, 2) range(j, -2, 2) range(k, -2, 2) {
            if(i == 0 && j == 0 && k == 0)
                continue;
            vec3 pos1 = pos + vec3(i, j, k);
            Particle p0_, p1_;
            unpackParticles(LOAD3D(ch0, pos1), pos1, p0_, p1_);

            vec2 densities_ = LOAD3D(ch1, pos1).xy;
            p0_.density = densities_.x;
            p1_.density = densities_.y;

            //apply the force
            ApplyForce(p0, p0_);
            ApplyForce(p0, p1_);
            ApplyForce(p1, p0_);
            ApplyForce(p1, p1_);
        }

        ApplyForce(p0, p1);
        ApplyForce(p1, p0);

        IntegrateParticle(p0, pos, iResolution.xy, iMouse, iTime, heightMap, heightScale, lakeMap, rangeMap, texR, texOffset);
        IntegrateParticle(p1, pos, iResolution.xy, iMouse, iTime, heightMap, heightScale, lakeMap, rangeMap, texR, texOffset);
    }

    // if(iFrame < 10)
    // {
    //     if(pos.x < 0.2*size3d.x && pos.x > 0.0*size3d.x && 
    //        pos.y < 0.2*size3d.y && pos.y > 0.0*size3d.y &&
    //        pos.z < 0.99*size3d.z && pos.z > 0.85*size3d.z)
    //     {
    //         p0.mass = initial_particle_density;
    //         p1.mass = 0u;
    //     }

    //     p0.pos = pos;
    //     p0.vel = vec3(0.0);
    //     p1.pos = pos;
    //     p1.vel = vec3(0.0);
    // }

    if(iFrame > 1 && iFrame < 20) {
        // if(pos.x < 0.4*size3d.x && pos.x > 0.0*size3d.x && 
        //    pos.y < 0.45*size3d.y && pos.y > 0.15*size3d.y &&
        //    pos.z < 0.99*size3d.z && pos.z > 0.75*size3d.z && iFrame <= 2)

        float p_height = GetTerrainHeight(pos.xy, iResolution, heightMap, heightScale);
        if(readinitWater(pos.xy, iResolution, lakeMap) != 0. && pos.z < p_height + 0.02 * size3d.z && pos.z > p_height + 0.01 * size3d.z)
        // ivec2 p = ivec2(pos.xy / size3d.xy * texR);
        // if(texelFetch(waterHeightMap, p + ivec2(texOffset) + ivec2(20,-10), 0).r!=0.)
        // if(readCanFLow(pos.xy, iResolution, lakeMap, waterHeightMap, texR, texOffset)!=0.  && pos.z < p_height+0.02*size3d.z && pos.z > p_height + 0.01*size3d.z)
        {
            p0.mass = initial_particle_density / 1u * 2u;
            p1.mass = 0u;
            if(pos.z < 0.92 * size3d.z && pos.z > 0.91 * size3d.z)
                p0.sand = bool(1);
        }
    }

    packed = packParticles(p0, p1, pos);
    out_FragColor = packed;
}