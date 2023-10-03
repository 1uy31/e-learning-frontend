import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client/core";

const httpLink = createHttpLink({
	uri: "http://localhost:8000/",
});

const cache = new InMemoryCache({
	typePolicies: {
		Query: {
			fields: {
				notes: {
					keyArgs: ["diaryId"],
					// TODO: to be improved for pagination
					//  https://www.apollographql.com/docs/react/pagination/core-api/#defining-a-field-policy
					merge(existing = [], incoming) {
						return {
							notes: [...existing, ...incoming.notes],
							total: incoming.total,
						};
					},
				},
			},
		},
	},
});

export const apolloClient = new ApolloClient({
	link: httpLink,
	cache,
});
