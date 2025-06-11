import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../App.css";

import { CommandInvoker } from "../utils/commands/CommandInvoker";
import { FetchStockCommand } from "../utils/commands/FetchStockCommand";
import { AddStockCommand } from "../utils/commands/AddStockCommand";
import { ModifyStockCommand } from "../utils/commands/ModifyStockCommand";

interface StockItem {
    id: number;
    productId: number;
    amount: number;
    location: string;
}

const StockPage: React.FC = () => {
    const { token } = useAuth();
    const [stockItems, setStockItems] = useState<StockItem[]>([]);
    const invoker = new CommandInvoker();

    const refreshStock = async () => {
        try {
            const response = await invoker.run(new FetchStockCommand(token!));
            let arr = Array.isArray(response)
                ? response
                : response.array && Array.isArray(response.array)
                    ? response.array
                    : [];
            setStockItems(
                arr.map((i: any) => ({
                    id: i.ID,
                    productId: i.ProductID,
                    amount: i.Amount,
                    location: i.Location,
                }))
            );
        } catch (err) {
            console.error("Błąd podczas pobierania stanów magazynowych:", err);
        }
    };

    useEffect(() => {
        refreshStock();
    }, [token]);

    const handleAdd = async () => {
        const pidStr = prompt("ProductID nowego wpisu:");
        const amountStr = prompt("Ilość:");
        const location = prompt("Lokalizacja:");
        if (!pidStr || !amountStr || !location) return;
        const pid = parseInt(pidStr, 10),
            am = parseInt(amountStr, 10);
        if (isNaN(pid) || isNaN(am)) {
            alert("ProductID i Ilość muszą być liczbami.");
            return;
        }

        try {
            await invoker.run(new AddStockCommand(token!, pid, am, location));
            await refreshStock();
        } catch (err) {
            console.error("Błąd podczas dodawania stanu:", err);
        }
    };

    const handleModify = async (id: number) => {
        const newPidStr = prompt("Nowy ProductID:");
        const newAmtStr = prompt("Nowa Ilość:");
        const newLoc = prompt("Nowa Lokalizacja:");
        const data: any = {};
        if (newPidStr) {
            const p = parseInt(newPidStr, 10);
            if (isNaN(p)) { alert("ProductID musi być liczbą."); return; }
            data.productId = p;
        }
        if (newAmtStr) {
            const a = parseInt(newAmtStr, 10);
            if (isNaN(a)) { alert("Ilość musi być liczbą."); return; }
            data.amount = a;
        }
        if (newLoc) data.location = newLoc;
        if (Object.keys(data).length === 0) return;

        try {
            await invoker.run(new ModifyStockCommand(token!, id, data));
            setStockItems(prev =>
                prev.map(item =>
                    item.id === id
                        ? { ...item, productId: data.productId ?? item.productId, amount: data.amount ?? item.amount, location: data.location ?? item.location }
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
                {stockItems.map(item => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.productId}</td>
                        <td>{item.amount}</td>
                        <td>{item.location}</td>
                        <td>
                            <button className="secondary" onClick={() => handleModify(item.id)}>
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
