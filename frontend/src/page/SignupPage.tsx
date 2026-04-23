import React, { useState } from "react";
import { authApi } from "../api/authApi";
import { useNavigate } from "react-router-dom";

const SingupPage = () => {
	const navigate = useNavigate();
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			alert("비밀번호가 일치하지 않습니다.");
			return;
		}

		try {
			await authApi.signup({ username, password });
			alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
			navigate("/login");
		} catch (error) {
			console.error("회원가입 실패:", error);
			alert(
				(error as Error).message ||
					"회원가입에 실패했습니다. 다시 시도해주세요.",
			);
		}
	};

	return (
		<div className="flex flex-col items-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
				<h2 className="mb-6 text-3xl font-bold text-center text-blue-600">
					회원가입
				</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700">
							아이디
						</label>
						<input
							type="text"
							name="username"
							placeholder="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">
							비밀번호
						</label>
						<input
							type="password"
							name="password"
							placeholder="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">
							비밀번호 확인
						</label>
						<input
							type="password"
							name="confirmPassword"
							placeholder="confirmPassword"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
							className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<button
						type="submit"
						className="w-full py-2 font-bold text-white rounded-md bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400"
					>
						회원가입
					</button>
				</form>

				<p className="mt-4 text-center text-gray-600">
					이미 계정이 있으신가요?{" "}
				</p>

				<button
					onClick={() => navigate("/login")}
					className="text-blue-500 hover:underline"
				>
					로그인
				</button>
			</div>
		</div>
	);
};

export default SingupPage;
