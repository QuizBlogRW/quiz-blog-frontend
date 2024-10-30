import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
    return {
        build: {
            outDir: 'build',
            chunkSizeWarningLimit: 1600,
        },
        plugins: [react()],
        resolve: {
            alias: [{ find: "@", replacement: "/src" }],
        },
        define: {
            global: {},
        }
    };
});