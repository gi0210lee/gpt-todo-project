import type { Priority } from "../types/Todo";

export interface TodoFilterState {
	keyword: string;
	priority: Priority | "ALL";
	status: "ALL" | "COMPLETED" | "PENDING";
}

interface TodoFilterProps {
	filters: TodoFilterState;
	onFilterChange: (newfilters: TodoFilterState) => void;
}

const TodoFilter = ({ filters, onFilterChange }: TodoFilterProps) => {
	return (
		<div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
			{/* 검색어 입력 */}
			<div className="relative">
				<input
					type="text"
					value={filters.keyword}
					onChange={(e) =>
						onFilterChange({ ...filters, keyword: e.target.value })
					}
					placeholder="검색어 입력"
					className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
			</div>

			<div className="flex flex-wrap gap-4">
				{/* 상태 필터 */}
				<div className="flex items-center gap-4">
					<label className="text-sm font-semibold text-gray-600">상태:</label>
					<div className="flex border border-gray-300 rounded-lg overflow-hidden bg-white">
						{(["ALL", "COMPLETED", "PENDING"] as const).map((s) => (
							<button
								key={s}
								onClick={() => {
									return onFilterChange;
								}}
								className={`px-3 py-1.5 text-xs font-medium transition-colors ${s}`}
							>
								{s === "ALL" ? "전체" : s === "COMPLETED" ? "완료" : "미완료"}
							</button>
						))}
					</div>
				</div>

				{/* 우선순위 필터 */}
				<div className="flex items-center gap-2">
					<label className="text-sm font-semibold text-gray-600">
						우선순위:
					</label>
					<select
						value={filters.priority}
						onChange={(e) =>
							onFilterChange({
								...filters,
								priority: (e.target.value as Priority) || "ALL",
							})
						}
						className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
					>
						<option value="ALL">전체</option>
						<option value="LOW">낮음</option>
						<option value="MEDIUM">보통</option>
						<option value="HIGH">높음</option>
					</select>
				</div>
			</div>
		</div>
	);
};

export default TodoFilter;
