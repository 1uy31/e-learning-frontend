import { ApolloClient, gql } from "@apollo/client/core";
import { apolloClient } from "@src/apolloClient";
import { Diary, DiaryInput } from "@appTypes/dataModels";
import { NormalizedCacheObject } from "@apollo/client/cache/inmemory/types";

export type DiaryService = {
	getMatchedObjects: (categoryId?: number, parentDiaryId?: number) => Promise<Array<Diary>>;
	create: (input: DiaryInput) => Promise<Diary>;
};

export const useDiaryService = (client: ApolloClient<NormalizedCacheObject> = apolloClient): DiaryService => {
	const getMatchedObjects = async (categoryId?: number, parentDiaryId?: number) => {
		const result = await client.query({
			query: gql`
				query Diaries($categoryId: Int, $parentDiaryId: Int) {
					diaries(categoryId: $categoryId, parentDiaryId: $parentDiaryId) {
						id
						topic
						sourceUrl
						rate
						reviewCount
						categoryId
						parentDiaryId
						createdAt
						updatedAt
					}
				}
			`,
			variables: { categoryId, parentDiaryId },
		});
		return result.data.diaries;
	};

	const create = async (input: DiaryInput) => {
		const result = await client.mutate({
			mutation: gql`
				mutation AddDiary(
					$topic: String!
					$sourceUrl: String
					$rate: Int
					$categoryId: Int
					$parentDiaryId: Int
				) {
					addDiary(
						topic: $topic
						sourceUrl: $sourceUrl
						rate: $rate
						categoryId: $categoryId
						parentDiaryId: $parentDiaryId
					) {
						id
						topic
						sourceUrl
						rate
						reviewCount
						categoryId
						parentDiaryId
						createdAt
						updatedAt
					}
				}
			`,
			variables: { ...input },
		});
		client.cache.evict({
			id: "ROOT_QUERY",
			fieldName: "diaries",
			args: { categoryId: input.categoryId },
			broadcast: false,
		});
		client.cache.gc();
		return result.data.addDiary;
	};

	return {
		getMatchedObjects,
		create,
	};
};
