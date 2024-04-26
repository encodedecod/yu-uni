import path from 'path'
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
  base: '/ui/',
  plugins: [uni()],
  css: {
    preprocessorOptions: {
      scss: {
        // eslint-disable-next-line
        additionalData: "@import '@yupao/yp-family-uni-design/styles';",
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@yupao/yp-family-uni-design': path.resolve(__dirname, './src/packages'),
    },
  },
})
