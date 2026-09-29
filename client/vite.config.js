import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.mpeg', '**/*.mp3', '**/*.wav', '**/*.ogg'],
})

