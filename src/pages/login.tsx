import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../api/api";
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

    const handleSubmit = async () => {
        setError("");
        if (!email.trim() || !password.trim()) {
            setError("Podaj adres e-mail oraz hasło.");
            return;
        }

        try {
            // wywołujemy backend
            const data = await loginAdmin(email.trim(), password.trim(), google2fa.trim());

            if (!data.token) {
                setError("Niepoprawna odpowiedź serwera (brak tokenu).");
                return;
            }

            // Zapisujemy token i rolę
            login(data.token, "admin");

            // Przekierujmy administratora np. do strony z listą przedmiotów (lub do panelu admina)
            navigate("/admin/dashboard");
        } catch (err: any) {
            // err.message pochodzi z `throw new Error("Błąd logowania administratora")`
            setError(err.message || "Nieznany błąd podczas logowania.");
            console.error("Błąd w handleSubmit LoginAdmin:", err);
        }
    };

    return (
        <div className="page-card mt-4 mb-4" style={{ maxWidth: 360, margin: "0 auto" }}>
            <h2 className="mb-4" style={{ textAlign: "center" }}>
                Logowanie Administrator
            </h2>

            {error && (
                <div style={{ color: "red", marginBottom: "1rem", textAlign: "center" }}>
                    {error}
                </div>
            )}

            <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", marginBottom: "12px", padding: "8px" }}
            />

            <input
                type="password"
                placeholder="Hasło"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%", marginBottom: "12px", padding: "8px" }}
            />

            <button
                className="secondary mt-3"
                onClick={() => setShow2fa((prev) => !prev)}
                style={{ width: "100%" }}
            >
                {show2fa ? "Ukryj 2FA" : "Wprowadź kod 2FA"}
            </button>

            {show2fa && (
                <input
                    type="text"
                    placeholder="Google 2FA kod"
                    value={google2fa}
                    onChange={(e) => setGoogle2fa(e.target.value)}
                    style={{ width: "100%", marginTop: "12px", padding: "8px" }}
                />
            )}

            <button className="primary mt-4" onClick={handleSubmit} style={{ width: "100%" }}>
                Zaloguj
            </button>

            <div style={{ marginTop: "1rem", textAlign: "center" }}>
                <a href="ResetPasswordAdmin.tsx" style={{ color: "#3b82f6", textDecoration: "none" }}>
                    Zapomniałeś hasła?
                </a>
            </div>
        </div>
    );
};

export default Login;


