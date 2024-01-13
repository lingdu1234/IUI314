import type { BuildOptions } from "vite";

export const setupBuildOptions = (): BuildOptions => {
	return {
		// target: 'esnext',
		sourcemap: false,
		minify: "terser",
		outDir: "./dist",
		cssCodeSplit: true,
		rollupOptions: {
			//   input: {
			//     index: fileURLToPath(new URL('../index.html', import.meta.url)),
			//   },
			output: {
				// 入口文件名
				entryFileNames: "assets/[name].js",
				// 块文件名
				chunkFileNames: "assets/[name]-[hash].js",
				// 资源文件名 css 图片等等
				assetFileNames: "assets/[name]-[hash].[ext]",
				// manualChunks(id) {
				//   if (id.includes('node_modules')) {
				//     return id
				//       .toString()
				//       .split('node_modules/')[1]
				//       .split('/')[0]
				//       .toString()
				//   }
				// },
			},
		},
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
			},
			sourceMap: false,
			format: {
				comments: false,
				// quote_style: 1,
				// 会导致程序无法启动
			},
		},
	};
};
