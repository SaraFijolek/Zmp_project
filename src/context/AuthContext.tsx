import React, { createContext, useState, useContext, ReactNode } from "react";
import { Navigate } from "react-router-dom";

type AuthContextType = {
    token: string | null;
    role: "user" | "admin" | null;
    login: (token: string, role: "user" | "admin") => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
    token: 'token_test3',
    role: "admin",
    login: () => {},
    logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [role, setRole] = useState<"user" | "admin" | null>(
        (localStorage.getItem("role") as "user" | "admin") || null
    );

    const login = (tok: string, r: "user" | "admin") => {
        setToken(tok);
        setRole(r);
        localStorage.setItem("token", tok);
        localStorage.setItem("role", r);
    };

    const logout = () => {
        setToken(null);
        setRole(null);
        localStorage.clear();
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider value={{ token, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

interface ProtectedRouteProps {
    role: "user" | "admin";
    children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role: requiredRole, children }) => {
    const { token, role } = useAuth();

    if (!token || role !== requiredRole) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default AuthContext;
