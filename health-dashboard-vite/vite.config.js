import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Import the Tailwind CSS Vite plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Include the Tailwind CSS plugin here
  ],
  server: {
    proxy: {
      '/api': { // This tells Vite to intercept any request starting with '/api'
        target: 'http://localhost:5000', // Your Flask server's address
        changeOrigin: true, // Needed for virtual hosted sites
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove the '/api' prefix before forwarding to Flask
      },
    },
  },
});