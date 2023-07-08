export type Category = {
	id: number;
	name: string;
	diaryCount: number;
};

export type DiaryInput = {
	topic: string;
	sourceUrl?: string;
	rate?: number;
	categoryId?: number;
};

export type Diary = DiaryInput & {
	id: number;
	reviewCount?: number;
	// createdAt: Date;
	// updatedAt: Date;
};
