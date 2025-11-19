import { httpClient } from "./httpClient";
import type { LoginRequest, LoginResponse } from "./authTypes";

// 로그인 API 호출 함수
// 요청 데이터를 LoginRequest 타입으로 받고, 응답 데이터를 LoginResponse 타입으로 반환
export async function login(request: LoginRequest): Promise<LoginResponse> {
    const response = await httpClient.post<LoginResponse>("api/v1/auth/login", request);
    return response.data;
}