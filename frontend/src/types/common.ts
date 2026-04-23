export interface ApiResponse<T> {
	success: boolean;
	data: T;
	error: ErrorResponse;
}

export interface ErrorResponse {
	status: number;
	code: string;
	message: string;
}

export interface Page<T> {
	data: T[];
	page: number;
	size: number;
	totalElements: number;
	totalPages: number;
}
