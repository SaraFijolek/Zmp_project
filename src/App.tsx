import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './context/Sidebar';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/UsersPage';
import ItemsPage from './pages/ItemsPage';
import StockPage from './pages/StockPage';
import Login from './pages/Login';
import RegisterAdmin from './pages/Register';
import './App.css';

const AppContent: React.FC = () => {
    const { token } = useAuth();

    if (!token) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <Login />
            </div>
        );
    }

    return (
        <div className="app-container">
            <Sidebar />
            <main className="main-content">
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/items" element={<ItemsPage />} />
                    <Route path="/stock" element={<StockPage />} />
                    <Route path="/register" element={<RegisterAdmin />} />
                    <Route path="/login" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </main>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
};

export default App;
