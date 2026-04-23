import { createContext, useState, useEffect, type ReactNode } from "react";
import type { User } from "../types/auth";
import { authApi } from "../api/authApi";

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (accessToken: string, refreshToken: string) => void;
	logout: () => void;
}

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<User | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const fetchUser = async () => {
		try {
			const userData = await authApi.getMe();
			setUser(userData);
			setIsAuthenticated(true);
		} catch (error) {
			logout();
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const token = localStorage.getItem("accessToken");
		if (token) {
			fetchUser();
		} else {
			setIsLoading(false);
		}
	}, []);

	const login = async (accessToken: string, refreshToken: string) => {
		localStorage.setItem("accessToken", accessToken);
		localStorage.setItem("refreshToken", refreshToken);
		await fetchUser();
	};

	const logout = async () => {
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		setUser(null);
		setIsAuthenticated(false);
		window.location.href = "/login"; // 로그아웃 시 이동
	};

	return (
		<AuthContext.Provider
			value={{ user, isAuthenticated, isLoading, login, logout }}
		>
			{!isLoading && children}
		</AuthContext.Provider>
	);
};
