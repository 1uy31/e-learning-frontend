export type Category = {
	id: number;
	name: string;
	noParentDiaryCount: number;
};

export type DiaryInput = {
	topic: string;
	sourceUrl?: string;
	rate?: number;
	categoryId?: number;
	parentDiaryId?: number;
};

export type Diary = DiaryInput & {
	id: number;
	reviewCount?: number;
	createdAt: string;
	updatedAt: string | null;
};
