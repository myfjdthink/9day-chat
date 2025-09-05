import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    // 启用 gzip 压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // 代码分割优化
    rollupOptions: {
      output: {
        manualChunks: {
          // 将 Vue 相关库分离到单独的 chunk
          vue: ['vue', 'vue-router'],
          // 将 UI 组件库分离
          ui: ['lucide-vue-next'],
          // 将工具库分离
          utils: ['axios'],
        },
      },
    },
    // 设置 chunk 大小警告限制
    chunkSizeWarningLimit: 1000,
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: ['vue', 'vue-router', 'axios', 'lucide-vue-next'],
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      // 主API服务代理
      '/api': {
        target: 'https://api.9day.tech',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      // 用户管理系统代理
      '/user-api': {
        target: 'https://user.9day.tech',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/user-api/, '/api/v1')
      },
      // N8N 服务代理
      '/n8n': {
        target: 'https://n8n.9day.tech',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/n8n/, '/webhook')
      }
    }
  },
})