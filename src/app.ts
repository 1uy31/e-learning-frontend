import { createApp, provide, h } from "vue";
import { DefaultApolloClient } from "@vue/apollo-composable";
import { apolloClient } from "@src/apolloClient";
import App from "@src/App.vue";
import { createPinia } from "pinia";

const pinia = createPinia();

const app = createApp({
	setup() {
		provide(DefaultApolloClient, apolloClient);
	},

	render: () => h(App),
});

app.use(pinia);
app.mount("#app");
