import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client/core";

const httpLink = createHttpLink({
	uri: "http://localhost:8000/",
});

const cache = new InMemoryCache();

export const apolloClient = new ApolloClient({
	link: httpLink,
	cache,
});
