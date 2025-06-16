import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin, loginUser } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import "../App.css";

const Login: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const { i18n, t } = useTranslation();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [google2fa, setGoogle2fa] = useState<string>("");
    const [show2fa, setShow2fa] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [loginType, setLoginType] = useState<"user" | "admin">("admin");

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const handleSubmit = async () => {
        setError("");
        if (!email.trim() || !password.trim()) {
            setError(t('auth.loginError'));
            return;
        }

        try {
            const data = loginType === "admin" 
                ? await loginAdmin(email.trim(), password.trim(), google2fa.trim())
                : await loginUser(email.trim(), password.trim(), google2fa.trim());

            if (!data.access_token) {
                setError(t('auth.loginError'));
                return;
            }

            login(data.access_token, loginType);
            navigate("/dashboard");
        } catch (err: any) {
            console.error("Błąd podczas logowania:", err);
            if (err.message.includes('2FA')) {
                setError(t('auth.twoFactorError'));
                setShow2fa(true);
            } else {
                setError(err.message || t('auth.loginError'));
            }
        }
    };

    return (
        <div className="login-bg min-h-screen">
            <div className="absolute top-4 right-4 flex space-x-2">
                <button
                    onClick={() => changeLanguage("pl")}
                    className={`px-3 py-1 rounded text-sm ${i18n.language === 'pl' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    PL
                </button>
                <button
                    onClick={() => changeLanguage("en")}
                    className={`px-3 py-1 rounded text-sm ${i18n.language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    EN
                </button>
            </div>
            <div className="mb-6 text-center pt-8">
                <h1 className="text-black text-2xl font-bold mb-2">
                    {t('auth.adminLogin')}
                </h1>
                <hr className="my-2" />
            </div>
            <div className="flex justify-center" style={{ marginTop: 100 }}>
                <div className="login-card bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                    {error && (
                        <div className="error-message mb-4 text-center text-red-600">
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
                                    {t('auth.userLogin')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLoginType("admin")}
                                    className={`flex-1 py-2 px-4 rounded ${loginType === "admin" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                                >
                                    {t('auth.adminLogin')}
                                </button>
                            </div>
                        </div>
                        <div className="w-full flex flex-col space-y-5 items-center">
                            <input
                                id="email"
                                type="email"
                                placeholder={t('common.email')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input w-full text-center"
                            />
                        </div>
                        <div className="w-full flex flex-col space-y-5 items-center">
                            <input
                                id="password"
                                type="password"
                                placeholder={t('common.password')}
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
                                    placeholder={t('auth.twoFactorEnter')}
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
                                {show2fa ? t('auth.twoFactorHide') : t('auth.twoFactorShow')}
                            </button>
                            <button
                                type="submit"
                                className="primary text-sm w-full"
                            >
                                {t('common.login')}
                            </button>
                        </div>
                        <div className="text-center mt-2 w-full">
                            <a
                                href="/reset-password"
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                {t('auth.forgotPassword')}
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
