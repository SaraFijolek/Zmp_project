import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin, loginUser } from "../api/api";
import { useAuth } from "../context/AuthContext";
import "../App.css";

const Login: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [google2fa, setGoogle2fa] = useState<string>("");
    const [show2fa, setShow2fa] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [loginType, setLoginType] = useState<"user" | "admin">("admin");

    const handleSubmit = async () => {
        setError("");
        if (!email.trim() || !password.trim()) {
            setError("Podaj adres e-mail oraz hasło.");
            return;
        }

        try {
            
            const data = loginType === "admin" 
                ? await loginAdmin(email.trim(), password.trim(), google2fa.trim())
                : await loginUser(email.trim(), password.trim(), google2fa.trim());

            if (!data.access_token) {
                setError("Niepoprawna odpowiedź serwera (brak tokenu).");
                return;
            }

         
            login(data.access_token, loginType);

            
            navigate("/dashboard");
        } catch (err: any) {
            setError(err.message || "Nieznany błąd podczas logowania.");
            console.error("Błąd podczas logowania:", err);
        }
    };



    return (
        <div className="login-bg min-h-screen">
            <div className="mb-6 text-center pt-8">
                <h1 className="text-black text-2xl font-bold mb-2">
                    Logowanie {loginType === "admin" ? "Administratora" : "Użytkownika"}
                </h1>
                <hr className="my-2" />
            </div>
            <div className="flex justify-center" style={{ marginTop: 100 }}>
                <div className="login-card bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                    {error && (
                        <div className="error-message mb-4 text-center">
                            {error}
                        </div>
                    )}
                    <form className="flex flex-col items-center space-y-8" style={{maxWidth: 320, margin: '0 auto'}} onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
                        <div className="w-full flex flex-col space-y-5 items-center">
                            <div className="flex w-full space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setLoginType("user")}
                                    className={`flex-1 py-2 px-4 rounded ${loginType === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                                >
                                    Użytkownik
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLoginType("admin")}
                                    className={`flex-1 py-2 px-4 rounded ${loginType === "admin" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                                >
                                    Administrator
                                </button>
                            </div>
                        </div>
                        <div className="w-full flex flex-col space-y-5 items-center">
                            <input
                                id="email"
                                type="email"
                                placeholder="Wprowadź adres e-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input w-full text-center"
                            />
                        </div>
                        <div className="w-full flex flex-col space-y-5 items-center">
                            <input
                                id="password"
                                type="password"
                                placeholder="Wprowadź hasło"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input w-full text-center"
                            />
                        </div>
                        {show2fa && (
                            <div className="w-full space-y-5 items-center">
                                <input
                                    id="2fa"
                                    type="text"
                                    placeholder="Wprowadź kod 2FA"
                                    value={google2fa}
                                    onChange={(e) => setGoogle2fa(e.target.value)}
                                    className="input w-full text-center"
                                />
                            </div>
                        )}
                        <div className="login-btns-col w-full">
                            <button
                                type="button"
                                onClick={() => setShow2fa((prev) => !prev)}
                                className="secondary text-sm w-full"
                            >
                                {show2fa ? "Ukryj 2FA" : "Wprowadź kod 2FA"}
                            </button>
                            <button
                                type="submit"
                                className="primary text-sm w-full"
                            >
                                Zaloguj
                            </button>
                        </div>
                        <div className="text-center mt-2 w-full">
                            <a
                                href="/reset-password"
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                Zapomniałeś hasła?
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
