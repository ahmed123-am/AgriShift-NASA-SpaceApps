import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/AgriShift-NASA-SpaceApps/', // 👈 مسار المستودع ضروري لربط ملفات الـ JS والـ CSS
})