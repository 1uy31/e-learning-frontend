import { ApolloClient, gql } from "@apollo/client/core";
import { apolloClient } from "@src/apolloClient";
import { Category } from "@appTypes/dataModels";
import { NormalizedCacheObject } from "@apollo/client/cache/inmemory/types";

export type CategoryService = {
	getAll: (name?: string) => Promise<{ categories: Array<Category> }>;
	create: (name: string) => Promise<Category>;
};

export const createCategoryService = (client: ApolloClient<NormalizedCacheObject> = apolloClient): CategoryService => {
	const getAll = async (name?: string) => {
		const result = await client.query({
			query: gql`
				query Categories($name: String) {
					categories(name: $name) {
						total
						categories {
							id
							name
						}
					}
				}
			`,
			variables: { name },
		});
		return {
			// TODO: type guard
			categories: result.data.categories.categories as Array<Category>,
		};
	};

	const create = async (name: string) => {
		const result = await client.mutate({
			mutation: gql`
				mutation AddCategory($name: String!) {
					addCategory(name: $name) {
						id
						name
					}
				}
			`,
			variables: { name },
		});
		return result.data.addCategory;
	};

	return {
		getAll,
		create,
	};
};
