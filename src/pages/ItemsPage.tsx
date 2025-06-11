import React, { useEffect, useState } from "react";
import { listItems, createItem, modifyItem } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { StrategyFactory, Item as ItemModel } from "../utils/ItemResponseStrategy";
import "../App.css";

const ItemsPage: React.FC = () => {
    const { token } = useAuth();
    const [items, setItems] = useState<ItemModel[]>([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await listItems(token!);
                const strategy = StrategyFactory.getStrategy(response);
                const mapped = strategy.map(response);
                setItems(mapped);
            } catch (error) {
                console.error("Błąd podczas pobierania listy przedmiotów:", error);
            }
        };
        fetchItems();
    }, [token]);

    const refresh = async () => {
        const response = await listItems(token!);
        const mapped = StrategyFactory.getStrategy(response).map(response);
        setItems(mapped);
    };

    const handleAdd = async () => {
        const name = prompt("Nazwa nowego przedmiotu:");
        if (!name) return;
        try {
            await createItem(token!, name);
            await refresh();
        } catch (err) {
            console.error("Błąd podczas dodawania przedmiotu:", err);
        }
    };

    const handleModify = async (id: number) => {
        const newName = prompt("Nowa nazwa przedmiotu:");
        if (!newName) return;
        try {
            await modifyItem(token!, id, newName);
            setItems(prev =>
                prev.map(i => (i.id === id ? { ...i, name: newName } : i))
            );
        } catch (err) {
            console.error("Błąd podczas modyfikacji przedmiotu:", err);
        }
    };

    return (
        <div className="page-card">
            <h2 className="mb-4">Zarządzanie przedmiotami</h2>
            <button className="primary mb-4" onClick={handleAdd}>
                Dodaj przedmiot
            </button>
            <table>
                <thead>
                <tr><th>ID</th><th>Nazwa</th><th>Akcje</th></tr>
                </thead>
                <tbody>
                {items.map(item => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>
                            <button
                                className="secondary"
                                onClick={() => handleModify(item.id)}
                            >
                                Modyfikuj
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ItemsPage;


