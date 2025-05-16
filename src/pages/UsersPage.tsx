
import React, { useEffect, useState } from "react";
import { listUsers, createUser } from "../api/api";
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
            const data = await listUsers(token!);
            setUsers(data);
        };
        fetchUsers();
    }, [token]);

    const handleAdd = async () => {
        const email = prompt("Email:");
        const name = prompt("Imię:");
        const surname = prompt("Nazwisko:");
        const phone = prompt("Telefon:");
        if (email && name && surname && phone) {
            await createUser(token!, email, phone, name, surname);
            setUsers(await listUsers(token!));
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
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersPage;
