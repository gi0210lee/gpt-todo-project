import { useState } from "react";
import { usePosts } from "../hooks/usePosts";
import type { PostsGetParams } from "../types/Post";
import { Link, useNavigate } from "react-router-dom";

const PostListPage = () => {
	// nav
	const navigate = useNavigate();

	// 검색 조건 임시상태
	const [searchInput, setSearchInput] = useState({
		title: "",
		content: "",
		authorName: "",
	});

	// 파라미터 상태
	const [params, setParams] = useState<PostsGetParams>({
		title: "",
		content: "",
		authorName: "",
		page: 0,
		size: 5,
	});

	// 데이터 조회
	const { data, isLoading } = usePosts(params);

	// 검색 실행
	const handleSearch = (e?: React.FormEvent) => {
		if (e) e.preventDefault();
		setParams({ ...params, ...searchInput, page: 0 }); // 검색 시 페이지 초기화
	};

	// 검색 초기화
	const handleReset = () => {
		const resetValues = { title: "", content: "", authorName: "" };
		setSearchInput(resetValues);
		setParams({
			...params,
			...resetValues,
			page: 0,
		});
	};

	if (isLoading)
		return (
			<div className="p-10 text-center text-gray-500">
				데이터를 불러오는 중...
			</div>
		);

	return (
		<div className="max-w-6xl mx-auto px-4 py-8">
			{/* 헤더 섹션 */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
				<div>
					<h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
						게시판
					</h1>
					<p className="text-gray-500 mt-1">
						다양한 의견을 자유롭게 나눠보세요.
					</p>
				</div>
				<button
					onClick={() => navigate("/posts/new")}
					className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
				>
					<span className="mr-2">+</span> 새 글 작성하기
				</button>
			</div>

			{/* 검색 필터 섹션 */}
			<div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-6">
				<form
					onSubmit={handleSearch}
					className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
				>
					<div className="space-y-1.5">
						<label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
							제목
						</label>
						<input
							type="text"
							value={searchInput.title}
							onChange={(e) =>
								setSearchInput({ ...searchInput, title: e.target.value })
							}
							placeholder="제목으로 검색..."
							className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
						/>
					</div>
					<div className="space-y-1.5">
						<label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
							내용
						</label>
						<input
							type="text"
							value={searchInput.content}
							onChange={(e) =>
								setSearchInput({ ...searchInput, content: e.target.value })
							}
							placeholder="내용으로 검색..."
							className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
						/>
					</div>
					<div className="space-y-1.5">
						<label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
							작성자
						</label>
						<input
							type="text"
							value={searchInput.authorName}
							onChange={(e) =>
								setSearchInput({ ...searchInput, authorName: e.target.value })
							}
							placeholder="작성자명..."
							className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
						/>
					</div>
					<div className="flex gap-2">
						<button
							type="submit"
							className="flex-1 bg-gray-900 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-black transition-colors"
						>
							검색하기
						</button>
						<button
							type="button"
							onClick={handleReset}
							className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
						>
							초기화
						</button>
					</div>
				</form>
			</div>

			{/* 게시글 목록 테이블 */}
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
				<table className="w-full border-collapse text-left">
					<thead>
						<tr className="bg-gray-50/50 border-b border-gray-100">
							<th className="px-6 py-4 font-semibold text-gray-700">제목</th>
							<th className="px-6 py-4 font-semibold text-gray-700 w-32 text-center">
								작성자
							</th>
							<th className="px-6 py-4 font-semibold text-gray-700 w-24 text-center">
								조회수
							</th>
							<th className="px-6 py-4 font-semibold text-gray-700 w-40 text-center">
								작성일
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-50">
						{data?.data.length === 0 ? (
							<tr>
								<td
									colSpan={4}
									className="px-6 py-12 text-center text-gray-400"
								>
									검색 결과가 없습니다.
								</td>
							</tr>
						) : (
							data?.data.map((post) => (
								<tr
									key={post.id}
									className="hover:bg-blue-50/30 transition-colors group"
								>
									<td className="px-6 py-4">
										<Link
											to={`/posts/${post.id}`}
											className="text-gray-900 font-medium group-hover:text-blue-600 transition-colors block"
										>
											{post.title}
										</Link>
									</td>
									<td className="px-6 py-4 text-center text-gray-600">
										{post.authorName}
									</td>
									<td className="px-6 py-4 text-center">
										<span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-bold">
											{post.viewCount}
										</span>
									</td>
									<td className="px-6 py-4 text-center text-sm text-gray-500">
										{new Date(post.createdAt || "").toLocaleDateString()}
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default PostListPage;
