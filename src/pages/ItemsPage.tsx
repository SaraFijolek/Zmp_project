// src/pages/ItemsPage.tsx
import React, { useEffect, useState } from "react";
import { listItems, createItem, modifyItem } from "../api/api";
import { useAuth } from "../context/AuthContext";
import "../App.css";

interface Item { id: number; name: string; }

const ItemsPage: React.FC = () => {
    const { token } = useAuth();
    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        const fetchItems = async () => {
            const data = await listItems(token!);
            setItems(data);
        };
        fetchItems();
    }, [token]);

    const handleAdd = async () => {
        const name = prompt("Nazwa nowego przedmiotu:");
        if (name) {
            await createItem(token!, name);
            setItems(await listItems(token!));
        }
    };

    const handleModify = async (id: number) => {
        const newName = prompt("Nowa nazwa przedmiotu:");
        if (newName) {
            await modifyItem(token!, id, newName);
            setItems((prev) =>
                prev.map((i) => (i.id === id ? { ...i, name: newName } : i))
            );
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
                <tr>
                    <th>ID</th>
                    <th>Nazwa</th>
                    <th>Akcje</th>
                </tr>
                </thead>
                <tbody>
                {items.map((item) => (
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
