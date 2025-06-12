import * as Cesium from 'cesium'

//定义下雨场景 着色器
function FragmentShader_Rain() {
  return 'uniform sampler2D colorTexture;\n\
        varying vec2 v_textureCoordinates;\n\
      \n\
        float hash(float x){\n\
          return fract(sin(x*133.3)*13.13);\n\
      }\n\
      \n\
      void main(void){\n\
      \n\
        float time = czm_frameNumber / 200.0;\n\
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
      '
}

// 特效管理
export default class RainEffectManager {
  constructor(viewer) {
    this._viewer = viewer
  }

  AddRainEffect() {
    if (this._rainEffect) {
      return
    }
    let collection = this._viewer.scene.postProcessStages
    let fs_rain = FragmentShader_Rain()
    this._rainEffect = new Cesium.PostProcessStage({
      name: 'czm_rain',
      fragmentShader: fs_rain,
    })
    collection.add(this._rainEffect)
  }

  RemoveRainEffect() {
    if (this._rainEffect) {
      this._viewer.scene.postProcessStages.remove(this._rainEffect)
      this._rainEffect = null
    }
  }
}
