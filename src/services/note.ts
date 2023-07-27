import { ApolloClient, gql } from "@apollo/client/core";
import { apolloClient } from "@src/apolloClient";
import { Note, NoteInput } from "@appTypes/dataModels";
import { NormalizedCacheObject } from "@apollo/client/cache/inmemory/types";

export type NoteService = {
	create: (input: NoteInput) => Promise<Note>;
};

export const useNoteService = (client: ApolloClient<NormalizedCacheObject> = apolloClient): NoteService => {
	const create = async (input: NoteInput) => {
		const result = await client.mutate({
			mutation: gql`
				mutation AddNote(
					$notePosition: Int!
					$content: JSON
					$diaryId: Int
					$sourceUrl: String
					$filePath: String
				) {
					addNote(
						notePosition: $notePosition
						content: $content
						diaryId: $diaryId
						sourceUrl: $sourceUrl
						filePath: $filePath
					) {
						id
						content
						sourceUrl
						filePath
						diaryId
						createdAt
						updatedAt
					}
				}
			`,
			variables: { ...input },
		});
		// client.cache.evict({
		// 	id: "ROOT_QUERY",
		// 	fieldName: "notes",
		// 	args: {},
		// 	broadcast: false,
		// });
		// client.cache.gc();
		return result.data.addNote;
	};

	return {
		create,
	};
};
