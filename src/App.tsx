import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./context/NavBar";
import Login from "./pages/Login";
import ItemsPage from "./pages/ItemsPage";
import UsersPage from "./pages/UsersPage";
import { AuthProvider, ProtectedRoute } from "./context/AuthContext";
import "./App.css";
import "./api/api.ts"


function App() {
    return (
        <AuthProvider>
            <Router>
                <NavBar />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/items"
                        element={
                            <ProtectedRoute role="admin">
                                <ItemsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/users"
                        element={
                            <ProtectedRoute role="admin">
                                <UsersPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/items" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;



