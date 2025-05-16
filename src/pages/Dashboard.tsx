import React from 'react';
import { useAuth } from '../context/AuthContext';


export const Dashboard: React.FC = () => {
    const { role, logout } = useAuth();

    return (
        <div style={{ padding: 20 }}>
            <h2>Dashboard</h2>
            <p>Jesteś zalogowany jako: <strong>{role}</strong></p>
            <button onClick={logout} style={{ marginTop: 10 }}>
                Wyloguj
            </button>
        </div>
    );
};
