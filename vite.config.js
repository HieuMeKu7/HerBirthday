
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
 
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['eb2faff4-81f5-46b6-8c32-8abaded10d70-00-2t92htbfwfv9f.sisko.replit.dev']
  }
}); 
