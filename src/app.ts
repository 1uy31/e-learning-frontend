import "@nordhealth/css";
import "@nordhealth/color";
import "@nordhealth/fonts";
import "@nordhealth/icons";
import "@nordhealth/tokens";
import "@nordhealth/ag-theme-nord";
import "@nordhealth/components";
import { createApp, provide, h } from "vue";
import { DefaultApolloClient } from "@vue/apollo-composable";
import { apolloClient } from "@src/apolloClient";
import "@src/style.css";
import App from "@src/App.vue";

createApp({
	setup() {
		provide(DefaultApolloClient, apolloClient);
	},

	render: () => h(App),
}).mount("#app");
