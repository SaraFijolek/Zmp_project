import React, { useEffect, useState } from "react";
import { listUsers, createUser, modifyUser } from "../api/api";
import { useAuth } from "../context/AuthContext";
import PermissionMessage from "../components/PermissionMessage";
import "../App.css";
import Modal from '../components/Modal';

interface User {
    id: number;
    name: string;
    surname: string;
    email: string;
    phone: string;
}

const UsersPage: React.FC = () => {
    const { token, canAccessUsers } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [permissionError, setPermissionError] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showModifyModal, setShowModifyModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        phone: '',
        surname: '',
        password: '',
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchUsers = async () => {
        if (!token) {
            setError('Brak tokenu autoryzacyjnego');
            return;
        }

        // Sprawdź uprawnienia do przeglądania użytkowników (tylko admin)
        if (!canAccessUsers()) {
            setPermissionError("Potrzebujesz roli administratora aby przeglądać użytkowników");
            return;
        }

        setIsLoading(true);
        setError(null);
        setPermissionError(null);

        try {
            const response = await listUsers(token);

            if (response?.array && Array.isArray(response.array)) {
                const mapped: User[] = response.array.map((u: any) => ({
                    id: u.id,
                    name: u.Name,
                    surname: u.Surname,
                    email: u.Email,
                    phone: u.Phone,
                }));
                setUsers(mapped);
            } else if (Array.isArray(response)) {
                const mapped: User[] = response.map((u: any) => ({
                    id: u.id,
                    name: u.Name,
                    surname: u.Surname,
                    email: u.Email,
                    phone: u.Phone,
                }));
                setUsers(mapped);
            } else {
                console.warn(" Nieoczekiwana struktura odpowiedzi:", response);
                setError('Nieoczekiwana struktura odpowiedzi z serwera');
            }
        } catch (error: any) {
            console.error(" Błąd pobierania użytkowników:", error);
            if (error.message?.includes('401') || error.message?.includes('Bad token')) {
                setPermissionError("Potrzebujesz roli administratora aby przeglądać użytkowników");
            } else {
                setError(error.message || 'Wystąpił błąd podczas pobierania użytkowników');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [token]);

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Sprawdź uprawnienia do tworzenia użytkowników (tylko admin)
        if (!canAccessUsers()) {
            setPermissionError("Potrzebujesz roli administratora aby tworzyć użytkowników");
            return;
        }

        try {
            await createUser({
                Email: newUser.email,
                Phone: newUser.phone,
                Name: newUser.name,
                Surname: newUser.surname
            }, token!);
            setNewUser({
                name: '',
                email: '',
                phone: '',
                surname: '',
                password: '',
            });
            await fetchUsers();
            setShowAddModal(false);
        } catch (error: any) {
            console.error("❌ Błąd dodawania użytkownika:", error);
            if (error.message?.includes('401') || error.message?.includes('Bad token')) {
                setPermissionError("Potrzebujesz roli administratora aby tworzyć użytkowników");
            } else {
                setError(error.message || 'Błąd podczas dodawania użytkownika');
            }
        }
    };

    const handleModifyUser = (user: User) => {
        // Sprawdź uprawnienia do modyfikacji użytkowników (tylko admin)
        if (!canAccessUsers()) {
            setPermissionError("Potrzebujesz roli administratora aby modyfikować użytkowników");
            return;
        }

        setSelectedUser(user);
        setShowModifyModal(true);
    };

    const handleModifyUserSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;
        
        // Sprawdź uprawnienia do modyfikacji użytkowników (tylko admin)
        if (!canAccessUsers()) {
            setPermissionError("Potrzebujesz roli administratora aby modyfikować użytkowników");
            return;
        }

        try {
            await modifyUser(selectedUser.id, {
                Email: selectedUser.email,
                Phone: selectedUser.phone,
                Name: selectedUser.name,
                Surname: selectedUser.surname,
                AccountActive: true,
            }, token!);
            setSelectedUser(null);
            setShowModifyModal(false);
            await fetchUsers();
        } catch (error: any) {
            console.error("❌ Błąd modyfikacji użytkownika:", error);
            if (error.message?.includes('401') || error.message?.includes('Bad token')) {
                setPermissionError("Potrzebujesz roli administratora aby modyfikować użytkowników");
            } else {
                setError(error.message || 'Błąd podczas modyfikacji użytkownika');
            }
        }
    };

    const closeAndResetModal = () => {
        setIsModalOpen(false);
        setNewUser({
            name: '',
            email: '',
            phone: '',
            surname: '',
            password: '',
        });
    };

    const handleOpenAddModal = () => {
        if (!canAccessUsers()) {
            setPermissionError("Potrzebujesz roli administratora aby tworzyć użytkowników");
            return;
        }
        setIsModalOpen(true);
    };

    return (
        <div className="container mx-auto px-4">
            <div className="page-header">
                <h1>Zarządzanie Użytkownikami</h1>
            </div>

            {permissionError && (
                <div className="mb-4">
                    <PermissionMessage message={permissionError} type="warning" />
                </div>
            )}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : !permissionError ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <button
                            onClick={handleOpenAddModal}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                            disabled={isLoading}
                        >
                            Dodaj Użytkownika
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nazwa</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akcje</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button
                                                onClick={() => handleModifyUser(user)}
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                                disabled={isLoading}
                                            >
                                                Modyfikuj
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : null}

            <Modal isOpen={isModalOpen} onClose={closeAndResetModal}>
                <h2 className="text-xl font-semibold mb-4">Dodaj użytkownika</h2>
                <form onSubmit={handleAddUser} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Imię
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-1">
                            Nazwisko
                        </label>
                        <input
                            type="text"
                            id="surname"
                            value={newUser.surname}
                            onChange={(e) => setNewUser({ ...newUser, surname: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Telefon
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            value={newUser.phone}
                            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                        >
                            Dodaj
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal modyfikacji użytkownika */}
            <Modal isOpen={showModifyModal} onClose={() => setShowModifyModal(false)}>
                <h2 className="text-xl font-semibold mb-4">Modyfikuj użytkownika</h2>
                {selectedUser && (
                    <form onSubmit={handleModifyUserSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                                Imię
                            </label>
                            <input
                                type="text"
                                id="edit-name"
                                value={selectedUser.name}
                                onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="edit-surname" className="block text-sm font-medium text-gray-700 mb-1">
                                Nazwisko
                            </label>
                            <input
                                type="text"
                                id="edit-surname"
                                value={selectedUser.surname}
                                onChange={(e) => setSelectedUser({ ...selectedUser, surname: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="edit-email"
                                value={selectedUser.email}
                                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700 mb-1">
                                Telefon
                            </label>
                            <input
                                type="tel"
                                id="edit-phone"
                                value={selectedUser.phone}
                                onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                            >
                                Zapisz
                            </button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default UsersPage;

