import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginAdmin } from "../api/api";
import "../App.css";

const Login: React.FC = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async () => {
        try {
            const resp = await loginAdmin(email, password);
            login(resp.token, "admin");
            window.location.href = "/items";
        } catch (err) {
            alert("Błąd logowania administratora");
            console.error(err);
        }
    };

    return (
        <div className="page-card mt-4 mb-4" style={{ maxWidth: 360 }}>
            <h2 className="mb-4" style={{ textAlign: "center" }}>
                Logowanie Administrator
            </h2>

            <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Hasło"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button className="primary" onClick={handleSubmit}>
                Zaloguj
            </button>

            <Link to="/forgot-password" className="mt-4" style={{ display: "block", textAlign: "center", color: "#3b82f6" }}>
                Zapomniałeś hasła?
            </Link>
        </div>
    );
};

export default Login;
