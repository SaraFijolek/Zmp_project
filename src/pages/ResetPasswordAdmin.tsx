// src/pages/ResetPasswordAdmin.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetAdminPassword } from "../api/api";
import { useAuth } from "../context/AuthContext";
import "../App.css";

const ResetPasswordAdmin: React.FC = () => {
    const { token, logout } = useAuth();
    const navigate = useNavigate();
    const [message, setMessage] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleReset = async () => {
        setError("");
        setMessage("");

        if (!token) {
            setError("Nie jesteś zalogowany. Proszę się zalogować, aby zresetować hasło.");
            return;
        }

        try {
            const data = await resetAdminPassword(token);
            // Zakładamy, że data ma kształt { message: string }
            setMessage(data.message || "Hasło zostało zresetowane pomyślnie.");
            // Po zresetowaniu hasła sensowne jest wylogowanie, bo stare hasło przestaje działać:
            logout();
            // I przekierowanie do formularza logowania:
            navigate("/admin/login");
        } catch (err: any) {
            setError(err.message || "Nie udało się zresetować hasła.");
            console.error("Błąd w handleReset ResetPasswordAdmin:", err);
        }
    };

    return (
        <div className="page-card mt-4 mb-4" style={{ maxWidth: 360, margin: "0 auto" }}>
            <h2 className="mb-4" style={{ textAlign: "center" }}>
                Resetowanie hasła administratora
            </h2>

            {error && (
                <div style={{ color: "red", marginBottom: "1rem", textAlign: "center" }}>
                    {error}
                </div>
            )}

            {message && (
                <div style={{ color: "green", marginBottom: "1rem", textAlign: "center" }}>
                    {message}
                </div>
            )}

            <button className="primary mt-4" onClick={handleReset} style={{ width: "100%" }}>
                Resetuj hasło
            </button>

            <div style={{ marginTop: "1rem", textAlign: "center" }}>
                <a href="/admin/login" style={{ color: "#3b82f6", textDecoration: "none" }}>
                    Wróć do logowania
                </a>
            </div>
        </div>
    );
};

export default ResetPasswordAdmin;
