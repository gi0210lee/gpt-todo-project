import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Todo } from "../types/Todo";
import { todoApi } from "../api/todoApi";
import { QUERY_KEYS } from "../constants/queryKeys";

export const useTodoMutation = () => {
	const queryClient = useQueryClient();

	const invalidateTodos = () => {
		queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TODOS] });
	};

	const createMutate = useMutation({
		mutationFn: (data: { title: string; priority: string; dueDate?: string }) =>
			todoApi.createTodo(data.title, data.priority as any, data.dueDate),
		onSuccess: invalidateTodos,
		onError: (error) => {
			alert("할 일 생성에 실패했습니다.");
			console.error("Create Todo Error:", error);
		},
	});

	const updateMutate = useMutation({
		mutationFn: ({ id, data }: { id: number; data: Partial<Todo> }) =>
			todoApi.updateTodo({ id, ...data } as Todo),
		onSuccess: invalidateTodos,
		onError: (error) => {
			alert("할 일 업데이트에 실패했습니다.");
			console.error("Update Todo Error:", error);
		},
	});

	const deleteMutate = useMutation({
		mutationFn: (id: number) => todoApi.deleteTodo(id),
		onSuccess: invalidateTodos,
		onError: (error) => {
			alert("할 일 삭제에 실패했습니다.");
			console.error("Delete Todo Error:", error);
		},
	});

	return { createMutate, updateMutate, deleteMutate };
};
