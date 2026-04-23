import { BrowserRouter, Route, Routes } from "react-router-dom";
import TodoPage from "./page/TodoPage";
import LoginPage from "./page/LoginPage";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import Header from "./components/Header";
import PostListPage from "./page/PostListPage";
import PostCreatePage from "./page/PostCreatePage";
import PostDetailPage from "./page/PostDetailPage";
import PostEditPage from "./page/PostEditPage";
import SingupPage from "./page/SignupPage";

function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Header />
				<div className="container mx-auto mt-6">
					<Routes>
						<Route
							path="/"
							element={
								<PrivateRoute>
									<TodoPage />
								</PrivateRoute>
							}
						/>
						<Route
							path="/posts"
							element={
								<PrivateRoute>
									<PostListPage />
								</PrivateRoute>
							}
						/>
						<Route
							path="/posts/new"
							element={
								<PrivateRoute>
									<PostCreatePage />
								</PrivateRoute>
							}
						/>
						<Route
							path="/posts/:id"
							element={
								<PrivateRoute>
									<PostDetailPage />
								</PrivateRoute>
							}
						/>
						<Route
							path="/posts/:id/edit"
							element={
								<PrivateRoute>
									<PostEditPage />
								</PrivateRoute>
							}
						/>
						<Route path="/login" element={<LoginPage />} />
						<Route path="/signup" element={<SingupPage />} />
					</Routes>
				</div>
			</BrowserRouter>
		</AuthProvider>
	);
}

export default App;
