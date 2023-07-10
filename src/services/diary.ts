import { ApolloClient, gql } from "@apollo/client/core";
import { apolloClient } from "@src/apolloClient";
import { Diary, DiaryInput } from "@appTypes/dataModels";
import { NormalizedCacheObject } from "@apollo/client/cache/inmemory/types";

export type DiaryService = {
	getByCategorizedTopic: (categoryId: number) => Promise<Array<Diary>>;
	create: (input: DiaryInput) => Promise<Diary>;
};

export const useDiaryService = (client: ApolloClient<NormalizedCacheObject> = apolloClient): DiaryService => {
	const getByCategorizedTopic = async (categoryId?: number) => {
		const result = await client.query({
			query: gql`
				query Diaries($categoryId: Int) {
					diaries(categoryId: $categoryId) {
						id
						topic
						sourceUrl
						rate
						reviewCount
						categoryId
						createdAt
						updatedAt
					}
				}
			`,
			variables: { categoryId },
		});
		// TODO: type guard
		return result.data.diaries as Array<Diary>;
	};

	const create = async (input: DiaryInput) => {
		const result = await client.mutate({
			mutation: gql`
				mutation AddDiary($topic: String!, $sourceUrl: String, $rate: Int, $categoryId: Int) {
					addDiary(topic: $topic, sourceUrl: $sourceUrl, rate: $rate, categoryId: $categoryId) {
						id
						topic
						sourceUrl
						rate
						reviewCount
						categoryId
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
