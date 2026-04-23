import type {
	LoginRequest,
	SignupRequest,
	TokenResponse,
	User,
} from "../types/auth";
import axios from "./axiosInstance";

export const authApi = {
	login: async (data: LoginRequest): Promise<TokenResponse> => {
		return await axios.post("/auth/login", data);
	},

	signup: async (data: SignupRequest): Promise<void> => {
		return await axios.post("/auth/signup", data);
	},

	getMe: async (): Promise<User> => {
		return await axios.get("/auth/me");
	},
};
