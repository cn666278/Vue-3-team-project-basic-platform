import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import * as path from "path";
import resolveExternalsPlugin from 'vite-plugin-resolve-externals';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        Components({
            resolvers: [NaiveUiResolver()],
        }),
        createSvgIconsPlugin({
            iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
            symbolId: 'icon-[dir]-[name]'
        }),
    ],
    /**文件路径 */
    base: "./",
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    // css: {
    //     preprocessorOptions: {
    //         // 全局样式变量
    //         scss: {
    //             additionalData: `@import '@/styles/variables.scss';`,
    //         }
    //     }
    // }
    server: {
        host: "0.0.0.0",
        port: 9580,
        open: true,
        hmr: true,
    },
    build: {
        chunkSizeWarningLimit: 1500,
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            }
        },
        rollupOptions: {
            output: {
                chunkFileNames: 'static/js/[name]-[hash].js',
                entryFileNames: 'static/js/[name]-[hash].js',
                assetFileNames: 'static/[name]-[hash].[ext]',
            }
        }
    }
});
