module.exports = {
	parser: "vue-eslint-parser",
	plugins: ["@typescript-eslint"],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:vue/vue3-recommended",
		"plugin:prettier/recommended", // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
		"plugin:tailwindcss/recommended",
	],
	parserOptions: {
		parser: "@typescript-eslint/parser",
	},
	rules: {
		// Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
		// e.g. "@typescript-eslint/explicit-function-return-type": "off",
		"vue/no-deprecated-slot-attribute": "off",
		"no-unused-vars": "off",
		"@typescript-eslint/no-unused-vars": [
			"warn",
			{
				argsIgnorePattern: "^_",
				varsIgnorePattern: "^_",
				caughtErrorsIgnorePattern: "^_",
			},
		],
		"prettier/prettier": [
			"error",
			{
				singleQuote: false,
				semi: true,
				avoidEscape: true,
				allowTemplateLiterals: true,
			},
		],
	},
	overrides: [
		{
			files: ["*.ts", "*.js"],
			parser: "@typescript-eslint/parser",
		},
		{
			files: ["*.vue"],
			parser: "vue-eslint-parser",
		},
	],
};
