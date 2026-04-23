import type { Todo, Priority } from "../types/Todo";

interface TodoItemProps {
	todo: Todo;
	onToggle: (todo: Todo) => void;
	onDelete: (id: number) => void;
}

const priorityColors: Record<Priority, string> = {
	HIGH: "text-red-500 bg-red-50",
	MEDIUM: "text-yellow-500 bg-yellow-50",
	LOW: "text-green-500 bg-green-50",
};

const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
	console.log("todo", todo);
	return (
		<li className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
			<div className="flex items-center gap-3 flex-1 overflow-hidden">
				{/* 완료여부 */}
				<input
					type="checkbox"
					checked={todo.completed}
					onChange={() => onToggle(todo)}
					className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
				/>
				{/* 우선순위 */}
				<span
					className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[todo.priority]}`}
				>
					{todo.priority}
				</span>

				{/* 제목, 완료시 취소 */}
				<span
					className={
						todo.completed ? "line-through text-gray-400" : "text-gray-800"
					}
				>
					{todo.title}
				</span>
				<div className="flex items-center gap-2 mt-1">
					{todo.dueDate && (
						<span className="text-xs text-gray-500">
							마감: {new Date(todo.dueDate).toLocaleDateString()}
						</span>
					)}
				</div>
			</div>
			<button
				type="button"
				onClick={() => onDelete(todo.id)}
				className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
				aria-label="Delete Todo"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fillRule="evenodd"
						d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
						clipRule="evenodd"
					/>
				</svg>
			</button>
		</li>
	);
};

export default TodoItem;
