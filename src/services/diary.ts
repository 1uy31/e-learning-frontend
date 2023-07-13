import { ApolloClient, gql } from "@apollo/client/core";
import { apolloClient } from "@src/apolloClient";
import { Diary, DiaryInput } from "@appTypes/dataModels";
import { NormalizedCacheObject } from "@apollo/client/cache/inmemory/types";

export type DiaryService = {
	getByCategorizedTopic: (categoryId?: number, parentDiaryId?: number) => Promise<Array<Diary>>;
	create: (input: DiaryInput) => Promise<Diary>;
};

export const useDiaryService = (client: ApolloClient<NormalizedCacheObject> = apolloClient): DiaryService => {
	const getByCategorizedTopic = async (categoryId?: number, parentDiaryId?: number) => {
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
		// TODO: type guard
		return result.data.diaries as Array<Diary>;
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
		return result.data.addDiary;
	};

	return {
		getByCategorizedTopic,
		create,
	};
};
