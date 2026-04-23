import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PostCreateRequest, PostUpdateRequest } from "../types/Post";
import { postApi } from "../api/postApi";
import { QUERY_KEYS } from "../constants/queryKeys";
import { useNavigate } from "react-router";

export const usePostMutation = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const createMutation = useMutation({
		mutationFn: (data: PostCreateRequest) => postApi.createPost(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] });
			navigate(`/posts`); // 생성 후 게시글 목록 페이지로 이동
		},
		onError: (error) => {
			alert((error as Error).message);
		},
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: PostUpdateRequest }) =>
			postApi.updatePost(id, data),
		onSuccess: (updatedPost) => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] });
			navigate(`/posts/${updatedPost.id}`); // 업데이트 후 상세 페이지로 이동
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) => postApi.deletePost(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] });
			navigate("/posts"); // 삭제 후 게시글 목록 페이지로 이동
		},
	});
	return { createMutation, updateMutation, deleteMutation };
};

export default usePostMutation;
