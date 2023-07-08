import { ApolloClient, gql } from "@apollo/client/core";
import { apolloClient } from "@src/apolloClient";
import { Diary, DiaryInput } from "@appTypes/dataModels";
import { NormalizedCacheObject } from "@apollo/client/cache/inmemory/types";

export type DiaryService = {
	create: (input: DiaryInput) => Promise<Diary>;
};

export const createDiaryService = (client: ApolloClient<NormalizedCacheObject> = apolloClient): DiaryService => {
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
		create,
	};
};
