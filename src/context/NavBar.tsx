// src/components/NavBar.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { resetAdminPassword } from "../api/api";
import "../App.css";

const NavBar: React.FC = () => {
    const { token, logout } = useAuth();

    const handleReset = async () => {
        try {
            await resetAdminPassword(token!);
            alert("Hasło administratora zostało zresetowane.");
        } catch (err) {
            console.error(err);
            alert("Błąd resetowania hasła");
        }
    };

    return (
        <nav>
            <div className="nav-links">
                <NavLink
                    to="/items"
                    className={({ isActive }) => (isActive ? "active" : "")}
                >
                    Przedmioty
                </NavLink>
                <NavLink
                    to="/users"
                    className={({ isActive }) => (isActive ? "active" : "")}
                >
                    Użytkownicy
                </NavLink>
            </div>
            <div>
                <button className="secondary" onClick={handleReset}>
                    Resetuj hasło
                </button>
                <button className="secondary" onClick={logout}>
                    Wyloguj
                </button>
            </div>
        </nav>
    );
};

export default NavBar;
