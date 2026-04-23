export interface LoginRequest {
	username: string;
	password: string;
}

export interface SignupRequest {
	username: string;
	password: string;
}

export interface TokenResponse {
	accessToken: string;
	refreshToken: string;
}

export interface User {
	// userId: string;
	username: string;
	// roles: string[];
}
