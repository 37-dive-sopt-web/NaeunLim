import { useNavigate } from "react-router";
import { useState } from "react";
import axios from "axios";
import type { ChangeEvent, FormEvent } from "react";
import  type { ErrorResponse } from "../../../shared/lib/authTypes";
import { login } from "../../../shared/lib/authApi";
import { storage } from "../../../shared/lib/storage";
import type { LoginRequest } from "../../../shared/lib/authTypes";

import * as styles from "./LoginForm.css";

const initialForm: LoginRequest = {
    username: "",
    password:"",
};

export const LoginForm = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState<LoginRequest>(initialForm);
    const [errorMessage, setErrorMessage] = useState<String | null>(null);

    const handleChange = 
        (field: keyof LoginRequest) => 
        (e: ChangeEvent<HTMLInputElement>) => {
            setForm((prev) => ({
                ...prev,
                [field]: e.target.value,
            }));

            if(errorMessage) setErrorMessage(null);
    };
    
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(!form.username || !form.password) return;
        setErrorMessage(null);

        try {
            // 서버에 POST 요청을 보내 로그인 시도
            const response = await login(form);
            // 성공 시 userId를 로컬 스토리지에 저장
            storage.setUserId(response.userId);
            navigate("/mypage");
        } catch (error: unknown) {
            let message = "로그인에 실패했습니다.";

            if(axios.isAxiosError<ErrorResponse>(error)) {
                const data = error.response?.data;
                if(data && data.message) {
                    message = data.message;
                }
            }
        
            setErrorMessage(message);
        };
    };

        // 로그인 버튼 활성화 여부
    // username, password 둘 다 입력되어야 활성화
    const isDisabled = !form.username || !form.password;

    const handleGoToSignUp = () => {
        navigate("/signup");
    };

    return (
        <form className={styles.formContainer} onSubmit={handleSubmit}>
            <h1 className={styles.title}>로그인</h1>

            <div className={styles.inputField}>
                <label className={styles.label} htmlFor="username">아이디</label>
                <input
                    id="username"
                    type="text"
                    className={styles.input}
                    value={form.username}
                    onChange={handleChange("username")}
                    placeholder="아이디를 입력해 주세요"
                />
            </div>

            <div className={styles.inputField}>
                <label className={styles.label} htmlFor="password">비밀번호</label>
                <input
                    id="password"
                    type="text"
                    className={styles.input}
                    value={form.password}
                    onChange={handleChange("password")}
                    placeholder="비밀번호를 입력해 주세요"
                />
            </div>

            {errorMessage ? (
                <p className={styles.errorText}>{errorMessage}</p>
            ) : (
                <p> 아직 계정이 없다면 회원가입을 진행해 주세요.</p>
            )}

            <div className={styles.buttonContainer}>
                <button 
                    type="submit" 
                    className={styles.loginButton}
                    disabled={isDisabled}
                    >
                        로그인
                    </button>
            </div>

            <div className={styles.buttonContainer}>
                <button 
                    type="button"
                    className={styles.signUpButton} 
                    onClick={handleGoToSignUp}
                    >
                        회원가입
                    </button>
            </div>
        </form>
    );
};
