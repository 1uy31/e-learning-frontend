import { ApolloClient, gql } from "@apollo/client/core";
import { apolloClient } from "@src/apolloClient";
import { Note, NoteInput } from "@appTypes/dataModels";
import { NormalizedCacheObject } from "@apollo/client/cache/inmemory/types";

export type NoteService = {
	getMatchedObjects: (diaryId?: number, diaryIds?: Array<number>) => Promise<{ notes: Array<Note>; total: number }>;
	create: (input: NoteInput) => Promise<Note>;
};

export const useNoteService = (client: ApolloClient<NormalizedCacheObject> = apolloClient): NoteService => {
	const getMatchedObjects = async (diaryId?: number, diaryIds?: Array<number>) => {
		const result = await client.query({
			query: gql`
				query Notes($diaryId: Int, $limit: Int, $offset: Int) {
					notes(diaryId: $diaryId, limit: $limit, offset: $offset) {
						total
						notes {
							id
							notePosition
							content
							sourceUrl
							filePath
							diaryId
							createdAt
							updatedAt
						}
					}
				}
			`,
			variables: { diaryId, diaryIds, limit: 100, offset: 0 }, // TODO: Temporary until pagination implemented.
		});
		return {
			notes: result.data.notes.notes,
			total: result.data.notes.total,
		};
	};

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
						notePosition
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
		const argsList = [{ diaryId: input.diaryId }];
		argsList.forEach((args) =>
			client.cache.evict({
				id: "ROOT_QUERY",
				fieldName: "notes",
				args: args,
				broadcast: false,
			})
		);
		client.cache.gc();
		return result.data.addNote;
	};

	return {
		getMatchedObjects,
		create,
	};
};
