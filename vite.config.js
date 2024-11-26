import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import cesium from 'vite-plugin-cesium'
// import copy from 'rollup-plugin-copy'
// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'cs',
  },
  base: '/cs',
  plugins: [
    vue(),
    cesium(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js', // 明确指定版本
    },
  },
  server: {
    proxy: {
      '/api': {
        // target: 'http://14916058.r11.cpolar.top', //需代理的后端接口848c446.r9.cpolar.cn
        target: 'http://192.168.110.11:8080', //需代理的后端接口
        // target: 'http://localhost:8080',
        secure: false, //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
      '/testapi': {
        target: 'http://localhost:8088', //需代理的后端接口
        secure: false, //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求
        changeOrigin: true,
        rewrite: path => path.replace(/^\/testapi/, ''),
      },
      '/ng': {
        target: 'http://localhost:8086', //需代理的后端接口
        secure: false, //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求
        changeOrigin: true,
        rewrite: path => path.replace(/^\/ng/, ''),
      },
    },
  },
  // resolve: {
  //   alias: {
  //     '@': '/src',
  //   },
  // },
})
