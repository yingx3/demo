import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import cesium from 'vite-plugin-cesium'
import { createProxyMiddleware } from 'http-proxy-middleware'
// import copy from 'rollup-plugin-copy'
// https://vitejs.dev/config/
export default defineConfig({
  define: {
    global: 'window', // 直接替换所有代码中的 global 为 window
  },
  build: {
    outDir: 'CS',
  },
  base: '/CS',
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
        target: 'http://13dc9cd5.r27.cpolar.top', //需代理的后端接口848c446.r9.cpolar.cn
        // target: 'http://192.168.110.11:8080', //需代理的后端接口
        // target: 'http://localhost:8080',
        secure: false, //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
      '/native': {
        // target: 'http://3a5b822.r40.cpolar.top', //需代理的后端接口848c446.r9.cpolar.cn
        // target: 'http://192.168.110.11:8080', //需代理的后端接口
        target: 'http://localhost:8080',
        secure: false, //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求
        changeOrigin: true,
        rewrite: path => path.replace(/^\/native/, ''),
      },
      '/testapi': {
        target: 'http://localhost:8088', //需代理的后端接口\
        // target: 'http://42f9ead9.r40.cpolar.top', //需代理的后端接口
        secure: false, //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求
        changeOrigin: true,
        rewrite: path => path.replace(/^\/testapi/, ''),
      },
      '/ng': {
        target: 'http://localhost:8086', //需代理的后端接口
        // target: 'http://10fceffa.r40.cpolar.top', //需代理的后端接口

        secure: false, //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求
        changeOrigin: true,
        rewrite: path => path.replace(/^\/ng/, ''),
      },
      
      // '/ws': {
      //   target: 'http://localhost:8088',
      //   secure: false,
      //   changeOrigin: true,
      //   ws: true, // 显式启用 WebSocket 代理
      //   pathRewrite: {
      //     '^/ws': '', // 重写路径为空（后端需监听根路径）
      //   },
      // },
      '/node': {
        target: 'http://localhost:3000', //需代理的后端接口
        secure: false, //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求
        changeOrigin: true,
        rewrite: path => path.replace(/^\/node/, ''),
      },
    },
  },
  // resolve: {
  //   alias: {
  //     '@': '/src',
  //   },
  // },
})
