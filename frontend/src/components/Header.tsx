import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Header() {
	const auth = useContext(AuthContext);

	if (!auth?.isAuthenticated) {
		return null; // 또는 로딩 스피너 등
	}

	const handleLogout = () => {
		auth.logout();
		// navigate("/login");
	};

	return (
		<nav className="bg-slate-800 text-white p-4 shadow-lg">
			<div className="container mx-auto flex justify-between items-center">
				<div className="flex space-x-6 items-center">
					<Link to="/" className="text-xl font-bold text-blue-400">
						My App
					</Link>
					<div className="space-x-4">
						<Link to="/" className="hover:text-blue-300">
							할 일 목록
						</Link>
						<Link to="/posts" className="hover:text-blue-300">
							게시판
						</Link>
					</div>
				</div>
				<button
					onClick={handleLogout}
					className="bg-slate-700 hover:bg-red-500 px-3 py-1 rounded transition-colors text-sm"
				>
					로그아웃
				</button>
			</div>
		</nav>
	);
}

export default Header;
