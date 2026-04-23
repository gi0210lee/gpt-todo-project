export type Priority = "LOW" | "MEDIUM" | "HIGH";

export interface Todo {
	id: number;
	title: string;
	completed: boolean;
	priority: Priority;
	dueDate?: string;
	createdAt: string;
}

export interface CreateTodoRequest {
	title: string;
	content: string;
	priority: Priority;
	dueDate?: string;
}

export interface UpdateTodoRequest {
	title: string;
	content: string;
	completed: boolean;
	priority: Priority;
	dueDate?: string;
}

export interface GetTodosParams {
	page: number;
	size: number;
	keyword?: string;
	completed?: boolean;
	priority?: Priority;
}
