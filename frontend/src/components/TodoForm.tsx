import React from "react";
import type { Priority } from "../types/Todo";

interface TodoFormProps {
	onAdd: (title: string, priority: Priority, dueDate?: string) => Promise<void>;
}

// const TodoForm = () => {
const TodoForm = ({ onAdd }: TodoFormProps) => {
	const [title, setTitle] = React.useState<string>("");
	const [priority, setPriority] = React.useState<Priority>("MEDIUM");
	const [dueDate, setDueDate] = React.useState<string>("");
	const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

	const handleSumit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim() || isSubmitting) return;

		setIsSubmitting(true);
		try {
			await onAdd(title, priority, dueDate || undefined);
			setTitle("");
			setPriority("MEDIUM");
			setDueDate("");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form
			onSubmit={handleSumit}
			className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100"
		>
			<div className="flex flex-col gap-3">
				<input
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="할 일 입력"
					className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					required
				/>
				<div className="flex flex-wrap gap-3 items-center">
					{/* 우선순위 */}
					<div className="flex items-center gap-2">
						<label className="text-sm font-medium text-gray-700">
							우선순위:
						</label>
						<select
							value={priority}
							onChange={(e) => setPriority(e.target.value as Priority)}
							className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="LOW">낮음</option>
							<option value="MEDIUM">보통</option>
							<option value="HIGH">높음</option>
						</select>
					</div>

					{/* 마감기한 */}
					<div className="flex items-center gap-2">
						<label className="text-sm font-medium text-gray-700">
							마감기한:
						</label>
						<input
							type="date"
							value={dueDate}
							onChange={(e) => setDueDate(e.target.value)}
							className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					{/* 추가버튼 */}
					<button
						type="submit"
						disabled={isSubmitting}
						className="ml-auto bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-300"
					>
						{isSubmitting ? "추가중" : "할일추가"}
					</button>
				</div>
			</div>
		</form>
	);
};

export default TodoForm;
