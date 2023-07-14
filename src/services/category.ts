import { ApolloClient, gql } from "@apollo/client/core";
import { apolloClient } from "@src/apolloClient";
import { Category } from "@appTypes/dataModels";
import { NormalizedCacheObject } from "@apollo/client/cache/inmemory/types";

export type CategoryService = {
	getAll: (name?: string) => Promise<{ categories: Array<Category> }>;
	create: (name: string) => Promise<Category>;
};

export const useCategoryService = (client: ApolloClient<NormalizedCacheObject> = apolloClient): CategoryService => {
	const getAll = async (name?: string) => {
		const result = await client.query({
			query: gql`
				query Categories($name: String, $limit: Int) {
					categories(name: $name, limit: $limit) {
						total
						categories {
							id
							name
							noParentDiaryCount
						}
					}
				}
			`,
			variables: { name, limit: 100 }, // TODO: Temporary until pagination implemented.
		});
		return {
			categories: result.data.categories.categories,
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
