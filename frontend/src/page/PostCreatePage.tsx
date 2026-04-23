import usePostMutation from "../hooks/usePostMutation";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const PostCreatePage = () => {
	const navigate = useNavigate();

	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	const { createMutation } = usePostMutation();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim() || !content.trim()) {
			alert("제목과 내용을 입력해주세요");
			return;
		}
		createMutation.mutate({ title, content });
	};

	const handleCancel = () => {
		navigate("/posts");
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<h2 className="text-2xl font-bold mb-6">게시글 작성</h2>
			<div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
				<h3 className="text-xl font-bold mb-4">새 게시글 작성</h3>
				<form className="space-y-4" onSubmit={handleSubmit}>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							제목
						</label>
						<input
							type="text"
							className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							내용
						</label>
						<textarea
							className="w-full border border-gray-300 p-2 rounded h-32 focus:ring-2 focus:ring-blue-500 outline-none"
							value={content}
							onChange={(e) => setContent(e.target.value)}
						/>
					</div>
					<div>
						<button
							className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
							type="button"
							onClick={handleCancel}
						>
							취소
						</button>
						<button
							className="px-4 py-2 text-white bg-blue-600  rounded hover:bg-blue-700 disabled:bg-blue-300"
							type="submit"
						>
							등록
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default PostCreatePage;
