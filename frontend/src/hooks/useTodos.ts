import { useQuery } from "@tanstack/react-query";
import { todoApi } from "../api/todoApi";
import type { GetTodosParams } from "../types/Todo";
import { QUERY_KEYS } from "../constants/queryKeys";

export const useTodos = (params: GetTodosParams) => {
	return useQuery({
		queryKey: [QUERY_KEYS.TODOS, params],
		queryFn: () => {
			return todoApi.getTodos(params);
		},
		placeholderData: (previouseData) => previouseData,
	});
};
