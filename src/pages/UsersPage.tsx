import React, { useEffect, useState } from "react";
import { listUsers, createUser, modifyUser } from "../api/api";
import { useAuth } from "../context/AuthContext";
import "../App.css";

interface User {
    id: number;
    name: string;
    surname: string;
    email: string;
    phone: string;
}

const UsersPage: React.FC = () => {
    const { token } = useAuth();
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await listUsers(token!);
                console.log("📥 RAW listUsers response:", response);

                // 1) Jeśli backend zwraca obiekt z polem "array"
                if (response?.array && Array.isArray(response.array)) {
                    const mapped: User[] = response.array.map((u: any) => ({
                        id: u.ID,
                        name: u.Name,
                        surname: u.Surname,
                        email: u.Email,
                        phone: u.Phone,
                    }));
                    setUsers(mapped);
                }
                // 2) Jeśli backend zwraca bezpośrednio tablicę [ { ID, Name, … }, … ]
                else if (Array.isArray(response)) {
                    const mapped: User[] = response.map((u: any) => ({
                        id: u.ID,
                        name: u.Name,
                        surname: u.Surname,
                        email: u.Email,
                        phone: u.Phone,
                    }));
                    setUsers(mapped);
                }
                // 3) W przeciwnym razie – prawdopodobnie inna struktura
                else {
                    console.warn("⚠️ Nieoczekiwana struktura odpowiedzi:", response);
                }
            } catch (error) {
                console.error("❌ Błąd pobierania użytkowników:", error);
            }
        };

        fetchUsers();
    }, [token]);

    const handleAdd = async () => {
        const email = prompt("Email:");
        const name = prompt("Imię:");
        const surname = prompt("Nazwisko:");
        const phone = prompt("Telefon:");
        if (!email || !name || !surname || !phone) return;

        try {
            // Tutaj wywołujemy createUser – funkcja ta sama zajmie się wstawieniem nagłówków:
            //   Token, Email, Phone, Name, Surname
            await createUser(token!, email, phone, name, surname);

            // Po poprawnym dodaniu odświeżamy listę
            const updated = await listUsers(token!);
            console.log("📤 RAW response po dodaniu użytkownika:", updated);

            if (updated?.array && Array.isArray(updated.array)) {
                const mapped: User[] = updated.array.map((u: any) => ({
                    id: u.ID,
                    name: u.Name,
                    surname: u.Surname,
                    email: u.Email,
                    phone: u.Phone,
                }));
                setUsers(mapped);
            } else if (Array.isArray(updated)) {
                const mapped: User[] = updated.map((u: any) => ({
                    id: u.ID,
                    name: u.Name,
                    surname: u.Surname,
                    email: u.Email,
                    phone: u.Phone,
                }));
                setUsers(mapped);
            } else {
                console.warn("❌ Nieoczekiwana struktura po dodaniu użytkownika:", updated);
            }
        } catch (error: any) {
            console.error("❌ Błąd dodawania użytkownika:", error);
        }
    };

    const handleModify = async (userId: number) => {
        const email = prompt("Nowy Email:");
        const name = prompt("Nowe Imię:");
        const surname = prompt("Nowe Nazwisko:");
        const phone = prompt("Nowy Telefon:");
        const accountActive = confirm("Czy konto ma być aktywne?");

        // Budujemy obiekt `data` dokładnie według tego, co funkcja modifyUser umie wstawić do nagłówków:
        const data: any = {};
        if (email) data.email = email;
        if (name) data.name = name;
        if (surname) data.surname = surname;
        if (phone) data.phone = phone;
        data.accountActive = accountActive;

        try {
            // Tutaj wywołujemy modifyUser – on doda do nagłówków: Token, UserId, i ewentualne Email/Phone/Name/Surname/AccountActive
            await modifyUser(token!, userId, data);

            // Odświeżamy listę na nowo
            const updated = await listUsers(token!);
            console.log("✏️ RAW response po modyfikacji użytkownika:", updated);

            if (updated?.array && Array.isArray(updated.array)) {
                const mapped: User[] = updated.array.map((u: any) => ({
                    id: u.ID,
                    name: u.Name,
                    surname: u.Surname,
                    email: u.Email,
                    phone: u.Phone,
                }));
                setUsers(mapped);
            } else if (Array.isArray(updated)) {
                const mapped: User[] = updated.map((u: any) => ({
                    id: u.ID,
                    name: u.Name,
                    surname: u.Surname,
                    email: u.Email,
                    phone: u.Phone,
                }));
                setUsers(mapped);
            } else {
                console.warn(
                    "❌ Nieoczekiwana struktura po modyfikacji użytkownika:",
                    updated
                );
            }
        } catch (error: any) {
            console.error("❌ Błąd modyfikacji użytkownika:", error);
        }
    };

    return (
        <div className="page-card mt-4 mb-4" style={{ maxWidth: 720 }}>
            <h2 className="mb-4">Zarządzanie użytkownikami</h2>

            <button className="primary mb-4" onClick={handleAdd}>
                Dodaj użytkownika
            </button>

            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Imię</th>
                    <th>Nazwisko</th>
                    <th>Telefon</th>
                    <th>Akcje</th>
                </tr>
                </thead>
                <tbody>
                {users.map((u) => (
                    <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.email}</td>
                        <td>{u.name}</td>
                        <td>{u.surname}</td>
                        <td>{u.phone}</td>
                        <td>
                            <button
                                className="secondary"
                                onClick={() => handleModify(u.id)}
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

export default UsersPage;

