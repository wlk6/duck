import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import VueSetupExtend from 'vite-plugin-vue-setup-extend';

export default defineConfig({
  base: '/', // 确保基础路径正确
  plugins: [
    vue(),
    vueDevTools(),
    VueSetupExtend(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist', // 输出目录
    assetsDir: 'assets', // 静态资源目录
    rollupOptions: {
      // 移除 vue 作为外部依赖
      // external: ['vue'], 
      output: {
        // 移除 vue 的全局定义
        // globals: {
        //   vue: 'Vue',
        // },
      },
    },
  },
});