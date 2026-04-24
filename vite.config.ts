import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    'import.meta.env.VITE_GIT_SHA': JSON.stringify(
      process.env.CF_PAGES_COMMIT_SHA?.substring(0, 7) || 'dev'
    ),
  },
})
