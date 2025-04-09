import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/login";
import Report from "./pages/Report";
import { AuthContext } from "./context/AuthContext";
import "./App.css";

function App() {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext); // Sprawdzenie czy użytkownik jest zalogowany

    return (
        <Router>
            <LanguageSwitcher />
            <h1>{t("Witaj w aplikacji do zarządzania magazynem")}</h1>

            <Routes>
                {/* Jeśli użytkownik nie jest zalogowany, przekieruj na login */}
                <Route path="/" element={user ? <Dashboard /> : <Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/reports" element={<Report />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;

