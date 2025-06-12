
var scene = viewer.scene;
scene.globe.depthTestAgainstTerrain = true;
var resetCameraFunction = function () {
    scene.camera.setView({
        destination: new Cesium.Cartesian3(277096.634865404, 5647834.481964232, 2985563.7039122293),
        orientation: {
            heading: 4.731089976107251,
            pitch: -0.32003481981370063
        }
    });
};
resetCameraFunction();


//着色器实现
function FS_Snow() {
    return "uniform sampler2D colorTexture;\n\
    varying vec2 v_textureCoordinates;\n\
\n\
    float snow(vec2 uv,float scale)\n\
    {\n\
        float time = czm_frameNumber / 60.0;\n\
        float w=smoothstep(1.,0.,-uv.y*(scale/10.));if(w<.1)return 0.;\n\
        uv+=time/scale;uv.y+=time*2./scale;uv.x+=sin(uv.y+time*.5)/scale;\n\
        uv*=scale;vec2 s=floor(uv),f=fract(uv),p;float k=3.,d;\n\
        p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*5.))-f;d=length(p);k=min(d,k);\n\
        k=smoothstep(0.,k,sin(f.x+f.y)*0.01);\n\
        return k*w;\n\
    }\n\
\n\
    void main(void){\n\
        vec2 resolution = czm_viewport.zw;\n\
        vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n\
        vec3 finalColor=vec3(0);\n\
        float c = 0.0;\n\
        c+=snow(uv,30.)*.0;\n\
        c+=snow(uv,20.)*.0;\n\
        c+=snow(uv,15.)*.0;\n\
        c+=snow(uv,10.);\n\
        c+=snow(uv,8.);\n\
    c+=snow(uv,6.);\n\
        c+=snow(uv,5.);\n\
        finalColor=(vec3(c)); \n\
        gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(finalColor,1), 0.5); \n\
\n\
    }\n\
";
}

var SnowSwitch = 1;
var SnowStage;
var snowSimu = document.querySelector("#snow");
snowSimu.addEventListener('click',
    function () {
        if (SnowSwitch) {
            SnowStage ? SnowStage.destroy() : '';
            SnowStage = Cesium.PostProcessStageLibrary.createBrightnessStage();
            SnowStage.uniforms.brightness=2;//整个场景通过后期渲染变亮 1为保持不变 大于1变亮 0-1变暗 uniforms后面为对应glsl里面定义的uniform参数
            var fs_snow = FS_Snow();
            SnowStage = new Cesium.PostProcessStage({
                "name": "SNOW",
                //sampleMode:PostProcessStageSampleMode.LINEAR,
                fragmentShader: fs_snow
            });
            viewer.scene.postProcessStages.add(SnowStage);

            //viewer.scene.skyAtmosphere.hueShift = -0.8;
            //viewer.scene.skyAtmosphere.saturationShift = -0.7;
            //viewer.scene.skyAtmosphere.brightnessShift = -0.33;
            //viewer.scene.fog.density = 0.01;
            //viewer.scene.fog.minimumBrightness = 0.8;
 

            SnowSwitch = 0;
        } else {
            SnowSwitch = 1;
           // viewer.scene.primitives.remove(snowSystem);
            viewer.scene.postProcessStages.remove(SnowStage);

        }

    }
 )

function FS_Rain() {
    return "uniform sampler2D colorTexture;\n\
				varying vec2 v_textureCoordinates;\n\
			\n\
				float hash(float x){\n\
					return fract(sin(x*133.3)*13.13);\n\
			}\n\
			\n\
			void main(void){\n\
			\n\
				float time = czm_frameNumber / 60.0;\n\
			vec2 resolution = czm_viewport.zw;\n\
			\n\
			vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n\
			vec3 c=vec3(.6,.7,.8);\n\
			\n\
			float a=-.4;\n\
			float si=sin(a),co=cos(a);\n\
			uv*=mat2(co,-si,si,co);\n\
			uv*=length(uv+vec2(0,4.9))*.3+1.;\n\
			\n\
			float v=1.-sin(hash(floor(uv.x*100.))*2.);\n\
			float b=clamp(abs(sin(20.*time*v+uv.y*(5./(2.+v))))-.95,0.,1.)*20.;\n\
			c*=v*b; \n\
			\n\
			gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(c,1), 0.5);  \n\
			}\n\
";
}

var rainSwitch = 1;
var rainStage;
var rainSimu = document.querySelector("#rain");
rainSimu.addEventListener('click',
    function () {

        if (rainSwitch) {
            rainStage ? rainStage.destroy() : '';
            rainStage = Cesium.PostProcessStageLibrary.createBrightnessStage();
            rainStage.uniforms.brightness = 2;//整个场景通过后期渲染变亮 1为保持不变 大于1变亮 0-1变暗 uniforms后面为对应glsl里面定义的uniform参数
            var fs_rain = FS_Rain();
            rainStage = new Cesium.PostProcessStage({
                "name": "RAIN",
                //sampleMode:PostProcessStageSampleMode.LINEAR,
                fragmentShader: fs_rain
            });
            viewer.scene.postProcessStages.add(rainStage);

            //viewer.scene.skyAtmosphere.hueShift = -0.8;
            //viewer.scene.skyAtmosphere.saturationShift = -0.7;
            //viewer.scene.skyAtmosphere.brightnessShift = -0.33;
            //viewer.scene.fog.density = 0.01;
            //viewer.scene.fog.minimumBrightness = 0.8;


            rainSwitch = 0;

        } else {
            rainSwitch = 1;
            viewer.scene.postProcessStages.remove(rainStage);
        }


    })

//fog
function FS_Fog() {
    return "  uniform sampler2D colorTexture;\n" +
        "  uniform sampler2D depthTexture;\n" +
        "  varying vec2 v_textureCoordinates;\n" +
        "  void main(void)\n" +
        "  {\n" +
        "      vec4 origcolor=texture2D(colorTexture, v_textureCoordinates);\n" +
        "      vec4 fogcolor=vec4(0.8,0.8,0.8,0.1);\n" +
        "\n" +
        "      float depth = czm_readDepth(depthTexture, v_textureCoordinates);\n" +
        "      vec4 depthcolor=texture2D(depthTexture, v_textureCoordinates);\n" +
        "\n" +
        "      float f=(depthcolor.r-0.40)/0.2;\n" +
        "      if(f<0.0) f=0.0;\n" +
        "      else if(f>1.0) f=1.0;\n" +
        "      gl_FragColor = mix(origcolor,fogcolor,f);\n" +
        "   }";
}
var FogStage;
var FogSwitch = 1;
var fogSimu = document.querySelector("#fog");
fogSimu.addEventListener('click',
    function () {
        if (FogSwitch) {

            FogStage ? FogStage.destroy() : '';
            FogStage = Cesium.PostProcessStageLibrary.createBrightnessStage();
            //this.FogStage.uniforms.brightness=2;//整个场景通过后期渲染变亮 1为保持不变 大于1变亮 0-1变暗 uniforms后面为对应glsl里面定义的uniform参数
            var fs_fog = FS_Fog();
            FogStage = new Cesium.PostProcessStage({
                "name": "self",
                //sampleMode:PostProcessStageSampleMode.LINEAR,
                fragmentShader: fs_fog
            });
            viewer.scene.postProcessStages.add(FogStage);
            FogSwitch = 0;

        } else {
            FogSwitch = 1;
            viewer.scene.postProcessStages.remove(FogStage);

        }

    //FogStage.enabled=true;


    })

 