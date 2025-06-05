
import React, { useEffect, useState } from "react";
import { listItems, createItem, modifyItem } from "../api/api";
import { useAuth } from "../context/AuthContext";
import "../App.css";

interface Item {
    id: number;
    name: string;
}

const ItemsPage: React.FC = () => {
    const { token } = useAuth();
    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await listItems(token!);
                console.log(" RAW listItems response:", response);

                // 1) Gdy backend zwraca obiekt z polem "array"
                if (response?.array && Array.isArray(response.array)) {
                    const mapped: Item[] = response.array.map((i: any) => ({
                        id: i.ID,
                        name: i.Name,
                    }));
                    setItems(mapped);
                }
                // 2) Gdy backend zwraca bezpośrednio tablicę [ { ID, Name }, … ]
                else if (Array.isArray(response)) {
                    const mapped: Item[] = response.map((i: any) => ({
                        id: i.ID,
                        name: i.Name,
                    }));
                    setItems(mapped);
                }
                // 3) Gdy nic z powyższego — wyświetl ostrzeżenie, bo być może kształt JSON-a jest inny
                else {
                    console.warn(
                        " Odpowiedź z listItems nie jest tablicą ani nie zawiera pola `array`:",
                        response
                    );
                }
            } catch (error) {
                console.error("Błąd podczas pobierania listy przedmiotów:", error);
            }
        };

        fetchItems();
    }, [token]);

    const handleAdd = async () => {
        const name = prompt("Nazwa nowego przedmiotu:");
        if (!name) return;

        try {
            await createItem(token!, name);

            // Po dodaniu — ponownie pobierz i również zamapuj wyniki
            const updated = await listItems(token!);
            console.log(" RAW response po dodaniu:", updated);

            if (updated?.array && Array.isArray(updated.array)) {
                const mapped: Item[] = updated.array.map((i: any) => ({
                    id: i.ID,
                    name: i.Name,
                }));
                setItems(mapped);
            } else if (Array.isArray(updated)) {
                const mapped: Item[] = updated.map((i: any) => ({
                    id: i.ID,
                    name: i.Name,
                }));
                setItems(mapped);
            } else {
                console.warn(
                    " Nieoczekiwana struktura po dodaniu przedmiotu:",
                    updated
                );
            }
        } catch (err) {
            console.error("Błąd podczas dodawania przedmiotu:", err);
        }
    };

    const handleModify = async (id: number) => {
        const newName = prompt("Nowa nazwa przedmiotu:");
        if (!newName) return;

        try {
            await modifyItem(token!, id, newName);
            // W tym przypadku wystarczy jedynie zaktualizować stan lokalnie:
            setItems((prev) =>
                prev.map((i) => (i.id === id ? { ...i, name: newName } : i))
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
