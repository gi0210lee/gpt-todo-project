import { useContext, useState } from "react";
import TodoItem from "../components/TodoItem";
import TodoForm from "../components/TodoForm";
import TodoFilter, { type TodoFilterState } from "../components/TodoFilter";
import { useTodos } from "../hooks/useTodos";
import { useTodoMutation } from "../hooks/useTodoMutation";
import { AuthContext } from "../context/AuthContext";
import type { GetTodosParams } from "../types/Todo";

const TodoPage = () => {
	// 인증
	const auth = useContext(AuthContext);

	// 상태관리
	const [filters, setFilters] = useState<TodoFilterState>({
		keyword: "",
		priority: "MEDIUM",
		status: "ALL",
	});
	const [page, setPage] = useState(0);
	const size = 5;

	// const [params, setParams] = useState<GetTodosParams>({
	const [params] = useState<GetTodosParams>({
		keyword: filters.keyword || undefined,
		completed:
			filters.status === "ALL" ? undefined : filters.status === "COMPLETED",
		priority: filters.priority === "ALL" ? undefined : filters.priority,
		page,
		size,
	});

	// 데이터 조회
	const { data, isLoading, isError } = useTodos(params);

	// 데이터 변경
	const { createMutate, updateMutate, deleteMutate } = useTodoMutation();

	const handleFilterChange = (newFilter: TodoFilterState) => {
		setFilters(newFilter);
		setPage(0);
	};

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
	};

	if (isLoading) return <div></div>;
	if (isError) return <div>할 일 목록을 불러오는 데 실패했습니다.</div>;

	console.log("auth", auth);
	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-bold">Todo List</h1>
					{/* <p className="text-gray-600">반가워요 {data?.data[0]?.userId} 님</p> */}
					<button
						onClick={auth?.logout}
						className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition"
					>
						로그아웃
					</button>
				</div>

				<div className="flex gap-2 mb-4">
					<TodoFilter filters={filters} onFilterChange={handleFilterChange} />
				</div>

				<div className="flex gap-2 mb-4">
					<TodoForm
						onAdd={async (title, priority, dueDate) => {
							createMutate.mutate({ title, priority, dueDate });
						}}
					/>
				</div>

				{/* 목록 */}
				<ul className="space-y-2">
					{data?.data.map((todo) => (
						<TodoItem
							key={todo.id}
							todo={todo}
							onToggle={(t) =>
								updateMutate.mutate({
									id: t.id,
									data: {
										...t,
										completed: !t.completed,
									},
								})
							}
							onDelete={(id) => deleteMutate.mutate(id)}
						/>
					))}
				</ul>

				{/* 페이지 네비게이션 */}
				<div className="flex justify-center gap-4 mt-4">
					<button
						disabled={params.page === 0}
						onClick={() => handlePageChange(page - 1)}
						className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
					>
						Prev
					</button>
					<span className="self-center">
						{page + 1} / {data?.totalPages || 1}
					</span>
					<button
						disabled={page + 1 >= (data?.totalPages || 1)}
						onClick={() => handlePageChange(page + 1)}
						className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
					>
						Next
					</button>
				</div>
			</div>
		</div>
	);
};

export default TodoPage;
