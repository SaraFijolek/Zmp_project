import React, { useEffect, useState } from "react";
import { listStock, addStock, modifyStock } from "../api/api";
import { useAuth } from "../context/AuthContext";
import "../App.css";

interface StockItem {
    id: number;
    productId: number;
    amount: number;
    location: string;
}

const StockPage: React.FC = () => {
    const { token } = useAuth();
    const [stockItems, setStockItems] = useState<StockItem[]>([]);

    // Pobierz listę stanów magazynowych
    useEffect(() => {
        const fetchStock = async () => {
            try {
                const response = await listStock(token!);
                // 1) Jeśli backend zwraca obiekt z polem "array"
                if (response?.array && Array.isArray(response.array)) {
                    const mapped: StockItem[] = response.array.map((i: any) => ({
                        id: i.ID,
                        productId: i.ProductID,
                        amount: i.Amount,
                        location: i.Location,
                    }));
                    setStockItems(mapped);
                }
                // 2) Jeśli backend zwraca bezpośrednio tablicę [{ ID, ProductID, Amount, Location }, …]
                else if (Array.isArray(response)) {
                    const mapped: StockItem[] = response.map((i: any) => ({
                        id: i.ID,
                        productId: i.ProductID,
                        amount: i.Amount,
                        location: i.Location,
                    }));
                    setStockItems(mapped);
                }
                // 3) Inny kształt JSON-a
                else {
                    console.warn(
                        "Odpowiedź z listStock nie jest tablicą ani nie zawiera pola `array`:",
                        response
                    );
                }
            } catch (error) {
                console.error("Błąd podczas pobierania stanów magazynowych:", error);
            }
        };

        fetchStock();
    }, [token]);

    // Dodaj nowy wpis magazynowy
    const handleAdd = async () => {
        const productIdStr = prompt("ProductID nowego wpisu:");
        if (!productIdStr) return;
        const amountStr = prompt("Ilość:");
        if (!amountStr) return;
        const location = prompt("Lokalizacja:");
        if (!location) return;

        const productId = parseInt(productIdStr, 10);
        const amount = parseInt(amountStr, 10);
        if (isNaN(productId) || isNaN(amount)) {
            alert("ProductID i Ilość muszą być liczbami.");
            return;
        }

        try {
            await addStock(token!, productId, amount, location);
            // Po dodaniu – ponownie pobierz listę
            const updated = await listStock(token!);
            if (updated?.array && Array.isArray(updated.array)) {
                const mapped: StockItem[] = updated.array.map((i: any) => ({
                    id: i.ID,
                    productId: i.ProductID,
                    amount: i.Amount,
                    location: i.Location,
                }));
                setStockItems(mapped);
            } else if (Array.isArray(updated)) {
                const mapped: StockItem[] = updated.map((i: any) => ({
                    id: i.ID,
                    productId: i.ProductID,
                    amount: i.Amount,
                    location: i.Location,
                }));
                setStockItems(mapped);
            } else {
                console.warn("Nieoczekiwana struktura po dodaniu:", updated);
            }
        } catch (err) {
            console.error("Błąd podczas dodawania stanu:", err);
        }
    };

    // Modyfikuj istniejący wpis
    const handleModify = async (id: number) => {
        const newProductIdStr = prompt("Nowy ProductID (zostaw puste, aby nie zmieniać):");
        const newAmountStr = prompt("Nowa ilość (zostaw puste, aby nie zmieniać):");
        const newLocation = prompt("Nowa lokalizacja (zostaw puste, aby nie zmieniać):");

        const data: {
            productId?: number;
            amount?: number;
            location?: string;
        } = {};

        if (newProductIdStr) {
            const parsed = parseInt(newProductIdStr, 10);
            if (isNaN(parsed)) {
                alert("ProductID musi być liczbą.");
                return;
            }
            data.productId = parsed;
        }

        if (newAmountStr) {
            const parsed = parseInt(newAmountStr, 10);
            if (isNaN(parsed)) {
                alert("Ilość musi być liczbą.");
                return;
            }
            data.amount = parsed;
        }

        if (newLocation) {
            data.location = newLocation;
        }

        // Jeśli użytkownik nic nie wpisał, nic nie zmieniamy
        if (
            data.productId === undefined &&
            data.amount === undefined &&
            data.location === undefined
        ) {
            return;
        }

        try {
            await modifyStock(token!, id, data);
            // Zaktualizuj stan lokalnie
            setStockItems((prev) =>
                prev.map((item) =>
                    item.id === id
                        ? {
                            ...item,
                            productId: data.productId ?? item.productId,
                            amount: data.amount ?? item.amount,
                            location: data.location ?? item.location,
                        }
                        : item
                )
            );
        } catch (err) {
            console.error("Błąd podczas modyfikacji stanu:", err);
        }
    };

    return (
        <div className="page-card">
            <h2 className="mb-4">Zarządzanie stanem magazynowym</h2>
            <button className="primary mb-4" onClick={handleAdd}>
                Dodaj stan magazynowy
            </button>

            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>ProductID</th>
                    <th>Ilość</th>
                    <th>Lokalizacja</th>
                    <th>Akcje</th>
                </tr>
                </thead>
                <tbody>
                {stockItems.map((item) => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.productId}</td>
                        <td>{item.amount}</td>
                        <td>{item.location}</td>
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

export default StockPage;
