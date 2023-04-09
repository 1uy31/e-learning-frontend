import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue({
			template: {
				compilerOptions: {
					// Treat all tags with a dash as custom elements.
					isCustomElement: (tag) => tag.includes("-"),
				},
			},
		}),
	],
	resolve: {
		alias: {
			"@src": path.join(__dirname, "src"),
			"@assets": path.join(__dirname, "src", "assets"),
			"@components": path.join(__dirname, "src", "components"),
			"@services": path.join(__dirname, "src", "services"),
			"@stores": path.join(__dirname, "src", "stores"),
			"@appTypes": path.join(__dirname, "src", "types"),
		},
	},
});
