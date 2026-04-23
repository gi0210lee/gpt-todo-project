import axios from "./axiosInstance";
import type { GetTodosParams, Priority, Todo } from "../types/Todo";
import type { Page } from "../types/common";

export const todoApi = {
	getTodos: async (params: GetTodosParams): Promise<Page<Todo>> => {
		const response: Page<Todo> = await axios.get(`/todos`, { params });

		console.log("API Response:", response);
		return response;
	},

	createTodo: async (
		title: string,
		priority: Priority,
		dueDate?: string,
	): Promise<Todo> => {
		const response: Todo = await axios.post("/todos", {
			title,
			priority,
			dueDate: dueDate ? `${dueDate}T00:00:00` : null,
		});
		return response;
	},

	updateTodo: async (todo: Todo): Promise<Todo> => {
		return await axios.put(`/todos/${todo.id}`, {
			title: todo.title,
			completed: todo.completed,
			priority: todo.priority,
			// dueDate: todo.dueDate ? `${todo.dueDate}T00:00:00` : null,
			dueDate:
				todo.dueDate && !todo.dueDate.includes("T")
					? `${todo.dueDate}T00:00:00`
					: todo.dueDate || null,
		});
	},

	deleteTodo: async (id: number): Promise<void> => {
		return await axios.delete(`/todos/${id}`);
	},
};
