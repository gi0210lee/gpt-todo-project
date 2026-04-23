import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { usePost } from "../hooks/usePosts";
import { usePostMutation } from "../hooks/usePostMutation";
import { AuthContext } from "../context/AuthContext";

const PostEditPage = () => {
	const navigate = useNavigate();

	const auth = React.useContext(AuthContext);
	const user = auth?.user;

	const [title, setTitle] = React.useState("");
	const [content, setContent] = React.useState("");

	const { id } = useParams();

	const { data, isLoading } = usePost(id!);
	const { updateMutation } = usePostMutation();

	useEffect(() => {
		if (data && user && user.username !== data.authorName) {
			alert("작성자만 수정할 수 있습니다.");
			navigate("/posts");
		}

		if (data) {
			setTitle(data.title);
			setContent(data.content);
		}
	}, [data, user, navigate]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		updateMutation.mutate({ id: id!, data: { title, content } });
	};

	if (isLoading) return <div>로딩중...</div>;

	return (
		<div className="max-w-2xl mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">게시글 수정</h1>
			<form className="space-y-4" onSubmit={handleSubmit}>
				<div>
					<label className="block text-sm font-medium text-gray-700">
						제목
					</label>
					<input
						type="text"
						value={title}
						onChange={(e) => {
							setTitle(e.target.value);
						}}
						className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
						required
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700">
						내용
					</label>
					<textarea
						value={content}
						onChange={(e) => setContent(e.target.value)}
						className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-40"
						required
					/>
				</div>
				<div className="flex justify-end gap-2">
					<button
						type="submit"
						className="bg-blue-500 text-white hover:bg-blue-700 py-2 px-4 rounded-md"
					>
						수정완료
					</button>
					<button
						type="button"
						onClick={() => {
							navigate(-1);
						}}
						className="bg-gray-300 text-gray-700 hover:bg-gray-400 py-2 px-4 rounded-md"
					>
						취소
					</button>
				</div>
			</form>
		</div>
	);
};

export default PostEditPage;
