uniform float     iTime;
uniform int     iFrame;
uniform vec2 iResolution;
uniform sampler2D iChannel0;
void main()
{
    InitGrid(iResolution.xy);
    vec2 fragCoord = floor(gl_FragCoord.xy);
    vec3 pos = dim3from2(fragCoord);
    
    Particle p0, p1;
    p0.mass = 0u;
    p0.pos = vec3(0);
    p0.vel = vec3(0);

    p1.mass = 0u;
    p1.pos = vec3(0);
    p1.vel = vec3(0);

    //advect neighbors and accumulate + clusterize density if they fall into this cell
    range(i, -2, 2) range(j, -2, 2) range(k, -2, 2)
    {
        //load the particles 
        vec3 pos1 = pos + vec3(i, j, k);
        if(!all(lessThanEqual(pos1, size3d)) || !all(greaterThanEqual(pos1, vec3(0.0))))
        {
            continue;
        }
        Particle p0_, p1_;
        unpackParticles(LOAD3D(ch0, pos1), pos1, p0_, p1_);
        
        if(p0_.mass > 0u)
        {
            p0_.pos += p0_.vel*dt;
            Clusterize(p0, p1, p0_, pos);
        }
   
        if(p1_.mass > 0u)
        {
            p1_.pos += p1_.vel*dt;
            Clusterize(p0, p1, p1_, pos);
        }
    }
    
    if(p1.mass == 0u && p0.mass > 0u)
    {
        SplitParticle(p0, p1);
    }

    if(p0.mass == 0u && p1.mass > 0u)
    {
        SplitParticle(p1, p0);
    }
    
    vec4 packed = packParticles(p0, p1, pos);
    out_FragColor = packed;
}