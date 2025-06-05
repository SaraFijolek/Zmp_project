
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Sidebar from "./context/Sidebar";
import ItemsPage from "./pages/ItemsPage";
import UsersPage from "./pages/UsersPage";
import Dashboard from "./pages/Dashboard";
import "./App.css";
import Login from "./pages/Login.tsx";
import StockPage from "./pages/StockPage.tsx";


function App() {
    return (
        <Router>
            <div className="app-container">
                <Sidebar />

                <div className="main-content">
                    <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/items" element={<ItemsPage />} />
                        <Route path="/users" element={<UsersPage />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/stock" element={<StockPage />} />
                        <Route path="*" element={<Dashboard/>} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
