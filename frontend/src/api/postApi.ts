import type {
	PostCreateRequest,
	PostsGetParams,
	Post,
	PostUpdateRequest,
} from "../types/Post";
import axios from "./axiosInstance";
import type { Page } from "../types/common";

export const postApi = {
	getPosts: async (params: PostsGetParams): Promise<Page<Post>> => {
		const response: Page<Post> = await axios.get(`/posts`, { params });
		return response;
	},

	getPost: async (id: string): Promise<Post> => {
		const response: Post = await axios.get(`/posts/${id}`);
		return response;
	},

	createPost: async (data: PostCreateRequest): Promise<Post> => {
		const response: Post = await axios.post(`/posts`, data);
		return response;
	},

	updatePost: async (id: string, data: PostUpdateRequest): Promise<Post> => {
		const response: Post = await axios.put(`/posts/${id}`, data);
		return response;
	},

	deletePost: async (id: string): Promise<Post> => {
		const response: Post = await axios.delete(`/posts/${id}`);
		return response;
	},
};
