import axios, { type AxiosResponse } from "axios";
import type { ApiResponse } from "../types/common";

const instance = axios.create({
	baseURL: "/api", // http://localhost:8080/api 대신 /api 사용
	headers: {
		"Content-Type": "application/json",
	},
});

// jwt 추가
instance.interceptors.request.use((config) => {
	const token = localStorage.getItem("accessToken");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

instance.interceptors.response.use(
	(response: AxiosResponse<ApiResponse<any>>): any => {
		const apiResponse = response.data;

		if (!apiResponse.success) {
			return Promise.reject(apiResponse.error);
		}

		return apiResponse.data;
	},
	async (error) => {
		const originalRequest = error.config;
		const errorData = error.response?.data;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const refreshToken = localStorage.getItem("refreshToken");
				const res = await instance.post("/auth/refresh", { refreshToken });

				const newAccessToken = res.data.data.accessToken;

				localStorage.setItem("accessToken", newAccessToken);

				originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

				return instance(originalRequest);
			} catch (error) {
				localStorage.removeItem("accessToken");
				localStorage.removeItem("refreshToken");

				alert(`로그인 세션이 만료되었습니다 다시 로그인 해주세요`);
				window.location.href = "/login";

				return Promise.reject(error);
			}
		}

		if (error.response?.status === 401) {
			const errorMessage = errorData?.error || "알 수 없는 오류가 발생했습니다";
			const errorCode = errorData?.code || "UNKNOWN_ERROR";
			alert(`[${errorCode}] ${errorMessage}`);
			window.location.href = "/login";
		}

		return Promise.reject(error);
	},
);

export default instance;
