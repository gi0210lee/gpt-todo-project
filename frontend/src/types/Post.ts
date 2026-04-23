export interface Post {
	id: number;
	title: string;
	content: string;
	authorName: string;
	viewCount: number;
	createdAt: string;
	active: boolean;
}

export interface PostsGetParams {
	title?: string;
	content?: string;
	authorName?: string;
	page?: number;
	size?: number;
}

export interface PostCreateRequest {
	title: string;
	content: string;
}

export interface PostUpdateRequest {
	title: string;
	content: string;
}
