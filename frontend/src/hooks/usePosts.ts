import { useQuery } from "@tanstack/react-query";
import { postApi } from "../api/postApi";
import type { PostsGetParams } from "../types/Post";
import { QUERY_KEYS } from "../constants/queryKeys";

export const usePosts = (params: PostsGetParams) => {
	return useQuery({
		queryKey: [QUERY_KEYS.POSTS, params],
		queryFn: () => {
			return postApi.getPosts(params);
		},
		placeholderData: (previouseData) => previouseData,
	});
};

export const usePost = (id: string) => {
	return useQuery({
		queryKey: [QUERY_KEYS.POSTS, id],
		queryFn: () => {
			return postApi.getPost(id);
		},
		placeholderData: (previouseData) => previouseData,
	});
};
