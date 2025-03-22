import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function Dashboard() {
    const { logout } = useContext(AuthContext);
    const { t } = useTranslation();
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch("http://localhost/api.php?action=getInventory") // Podmień na właściwy URL API
            .then(res => res.json())
            .then(data => setItems(data));
    }, []);

    return (
        <div>
            <h2>{t("Panel Administratora")}</h2>
            <button onClick={logout}>{t("Wyloguj")}</button>

            <h3>{t("Stan magazynowy")}</h3>
            <ul>
                {items.map((item, index) => (
                    <li key={index}>{item.name} - {item.quantity}</li>
                ))}
            </ul>

            <h3>{t("Raporty")}</h3>
            <Link to="/Report">
                <button>📊 {t("Generuj raport")}</button>
            </Link>
        </div>
    );
}

export default Dashboard;

