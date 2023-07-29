/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./index.html",
		"./src/**/*.{vue,js,ts,jsx,tsx}",
		"./src/*.{vue,js,ts,jsx,tsx}",
		"./node_modules/tw-elements/dist/js/**/*.js",
	],
	theme: {
		extend: {},
	},
	darkMode: "class",
	plugins: [
		require("tw-elements/dist/plugin.cjs"),
		require("tailwindcss/plugin")(function ({ addBase, theme }) {
			addBase({
				h1: { fontSize: theme("fontSize.3xl") },
				h2: { fontSize: theme("fontSize.2xl") },
				h3: { fontSize: theme("fontSize.xl") },
			});
		}),
	],
};
