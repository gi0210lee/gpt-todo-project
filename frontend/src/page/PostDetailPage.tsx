import { useContext } from "react";
import { usePost } from "../hooks/usePosts";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { usePostMutation } from "../hooks/usePostMutation";

const PostDetailPage = () => {
	// 인증
	const auth = useContext(AuthContext);
	const user = auth?.user;

	const { id } = useParams();
	const navigate = useNavigate();
	const { data, isLoading, error } = usePost(id!);
	const { deleteMutation } = usePostMutation();

	const isAuthor = user?.username === data?.authorName;

	if (isLoading) return <div>로딩중...</div>;
	if (error) return <div>에러가 발생했습니다.</div>;

	return (
		<div className="max-w-5xl mx-auto px-4 py-10">
			{/* 상단 네비게이션 */}
			<button
				onClick={() => navigate("/posts")}
				className="flex items-center text-gray-500 hover:text-gray-700 mb-6 translate-colors"
			>
				<span className="mr-2">←</span>목록으로 돌아가기
			</button>

			{/* 메인 콘텐츠 */}
			<article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
				{/* 헤더 */}
				<header className="px-8 py-10 border-b border-gray-50 bg-gray-50/30">
					<h1 className="text-3xl font-extrabold text-gray-900 mb-4 leading-tight">
						{data?.title}
					</h1>
					<div className="flex items-center justify-between text-sm text-gray-500">
						<div className="flex items-center space-x-4">
							<span className="font-medium text-gray-700">
								작성자: {data?.authorName}
							</span>
							<span>-</span>
							<span>
								{new Date(data?.createdAt || "").toLocaleDateString()}
							</span>
							<span className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
								<span className="text-blue-500">👁️</span>
								<span className="font-semibold">{data?.viewCount}</span>
							</span>
						</div>
					</div>
				</header>
				{/* 본문 */}
				<div className="px-8 py-12">
					<div className="prose prose-blue max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap text-lg">
						{data?.content}
					</div>
				</div>
				{/* 하단 액션 버튼 */}
				{isAuthor && (
					<footer className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
						<button
							onClick={() => {
								navigate(`/posts/${id}/edit`);
							}}
							className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
						>
							수정
						</button>
						<button
							onClick={() => {
								if (confirm("삭제 하시겠습니까?")) deleteMutation.mutate(id!);
							}}
							className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
						>
							삭제
						</button>
					</footer>
				)}
			</article>
		</div>
	);
};

export default PostDetailPage;
