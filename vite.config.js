import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
    return {
        server: {
            port: 3000,
            host: '0.0.0.0'
        },
        build: {
            outDir: 'build',
            chunkSizeWarningLimit: 1000,
            // Enable asset compression
            minify: 'terser',
            terserOptions: {
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                }
            },
            rollupOptions: {
                output: {
                    // Separate assets by type for better caching
                    assetFileNames: (assetInfo) => {
                        if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)) {
                            return `assets/media/[name]-[hash][extname]`;
                        }
                        if (/\.(png|jpe?g|gif|svg|webp|avif)(\?.*)?$/i.test(assetInfo.name)) {
                            return `assets/images/[name]-[hash][extname]`;
                        }
                        if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
                            return `assets/fonts/[name]-[hash][extname]`;
                        }
                        return `assets/[name]-[hash][extname]`;
                    },
                    manualChunks: {
                        // React core
                        'react-vendor': ['react', 'react-dom'],
                        
                        // Redux and state management
                        'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
                        
                        // Routing
                        'router-vendor': ['react-router-dom'],
                        
                        // UI libraries
                        'ui-vendor': [
                            'bootstrap', 
                            'reactstrap', 
                            'react-tabs',
                            'react-collapse',
                            'react-toastify'
                        ],
                        
                        // Charts and visualization
                        'charts-vendor': ['react-google-charts'],
                        
                        // PDF and documents (will be lazy loaded)
                        'pdf-vendor': ['@react-pdf/renderer'],
                        
                        // Utilities
                        'utils-vendor': [
                            'axios',
                            'moment',
                            'uuid',
                            'socket.io-client'
                        ],
                        
                        // Content and markdown
                        'content-vendor': [
                            'react-markdown',
                            'rehype-highlight',
                            'draft-js'
                        ],
                        
                        // Analytics and ads
                        'analytics-vendor': [
                            'react-ga4',
                            'react-adsense',
                            'web-vitals'
                        ]
                    }
                }
            }
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