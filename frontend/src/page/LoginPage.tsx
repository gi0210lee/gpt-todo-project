import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { authApi } from "../api/authApi";

const LoginPage = () => {
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const authContext = useContext(AuthContext);
	const navigate = useNavigate();

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const response = await authApi.login({ username, password });

			if (authContext && response.accessToken) {
				authContext.login(response.accessToken, response.refreshToken);
				navigate("/posts");
			}
		} catch (error) {
			console.log(error);
			alert("로그인에 실패했습니다.");
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center">
			<div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
				<form onSubmit={handleLogin}>
					<h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

					<div className="mb-4">
						<label className="block text-sm font-medium mb-1">Username</label>
						<input
							type="text"
							placeholder="id"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div className="mb-6">
						<label className="block text-sm font-medium mb-1">Password</label>
						<input
							type="password"
							placeholder="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<button
						type="submit"
						className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 translate duration-200"
					>
						Login
					</button>
				</form>
				<p className="mt-4 text-center text-gray-600">계정이 없으신가요? </p>

				<button
					onClick={() => navigate("/signup")}
					className="text-blue-500 hover:underline"
				>
					회원가입
				</button>
			</div>
		</div>
	);
};

export default LoginPage;
