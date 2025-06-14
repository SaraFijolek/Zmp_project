import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { Navigate } from "react-router-dom";

type AuthContextType = {
    token: string | null;
    role: "user" | "admin" | null;
    login: (token: string, role: "user" | "admin") => void;
    logout: () => void;
    hasPermission: (requiredRole: "user" | "admin") => boolean;
    checkPermission: (requiredRole: "user" | "admin") => { allowed: boolean; message?: string };
    canAccessUsers: () => boolean;
    canAccessItems: () => boolean;
    canAccessStock: () => boolean;
    canCreateItems: () => boolean;
    canModifyStock: () => boolean;
};

const AuthContext = createContext<AuthContextType>({
    token: null,
    role: null,
    login: () => {},
    logout: () => {},
    hasPermission: () => false,
    checkPermission: () => ({ allowed: false }),
    canAccessUsers: () => false,
    canAccessItems: () => false,
    canAccessStock: () => false,
    canCreateItems: () => false,
    canModifyStock: () => false,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [role, setRole] = useState<"user" | "admin" | null>(null);

    
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedRole = localStorage.getItem("role") as "user" | "admin";
        
        if (storedToken && storedRole) {
            setToken(storedToken);
            setRole(storedRole);
            console.log(' Załadowano token z localStorage');
        } else {
            console.log(' Brak tokenu w localStorage - wymagane logowanie');
        }
    }, []);

    const login = (tok: string, r: "user" | "admin") => {
        setToken(tok);
        setRole(r);
        localStorage.setItem("token", tok);
        localStorage.setItem("role", r);
        console.log(' Zalogowano pomyślnie - token zapisany');
    };

    const logout = () => {
        setToken(null);
        setRole(null);
        localStorage.clear();
        console.log('🚪 Wylogowano - token usunięty');
        window.location.href = "/login";
    };

    const hasPermission = (requiredRole: "user" | "admin"): boolean => {
        if (!token || !role) return false;
        
        
        if (role === "admin") return true;
        
       
        return requiredRole === "user";
    };

    const checkPermission = (requiredRole: "user" | "admin"): { allowed: boolean; message?: string } => {
        if (!token || !role) {
            return { 
                allowed: false, 
                message: "Musisz być zalogowany aby wykonać tę akcję" 
            };
        }

        if (hasPermission(requiredRole)) {
            return { allowed: true };
        }

        return { 
            allowed: false, 
            message: "Potrzebujesz roli administratora aby to zrobić" 
        };
    };

  
    const canAccessUsers = (): boolean => {
        
        return role === "admin";
    };

    const canAccessItems = (): boolean => {
      
        return role === "user" || role === "admin";
    };

    const canAccessStock = (): boolean => {
        
        return role === "user" || role === "admin";
    };

    const canCreateItems = (): boolean => {
       
        return role === "admin";
    };

    const canModifyStock = (): boolean => {
        // PUT /api/stock/modify - Token użytkownika lub administratora
        return role === "user" || role === "admin";
    };

    return (
        <AuthContext.Provider value={{ 
            token, 
            role, 
            login, 
            logout, 
            hasPermission, 
            checkPermission,
            canAccessUsers,
            canAccessItems,
            canAccessStock,
            canCreateItems,
            canModifyStock
        }}>
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
