import React, { useEffect, useState } from "react";
import { listItems, createItem, modifyItem } from "../api/api";
import { useAuth } from "../context/AuthContext";
import PermissionMessage from "../components/PermissionMessage";
import "../App.css";

interface Item {
    ID: number;
    Name: string;
}

const ItemsPage: React.FC = () => {
    const { token, canAccessItems, canCreateItems } = useAuth();
    const [items, setItems] = useState<Item[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [permissionError, setPermissionError] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [editItemName, setEditItemName] = useState('');

    const fetchItems = async () => {
        if (!token) {
            setError('Brak tokenu autoryzacyjnego');
            return;
        }

        setIsLoading(true);
        setError(null);
        setPermissionError(null);

        try {
            const response = await listItems(token);
            setItems(response);
        } catch (error: any) {
            console.error("❌ Błąd pobierania przedmiotów:", error);
            if (error.message?.includes('401') || error.message?.includes('Bad token')) {
                setPermissionError("Musisz być zalogowany aby przeglądać przedmioty");
            } else {
                setError(error.message || 'Wystąpił błąd podczas pobierania przedmiotów');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [token]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Sprawdź uprawnienia do tworzenia przedmiotów (tylko admin)
        if (!canCreateItems()) {
            setPermissionError("Potrzebujesz roli administratora aby tworzyć przedmioty");
            return;
        }

        if (!newItemName.trim()) {
            setError('Nazwa przedmiotu nie może być pusta');
            return;
        }

        try {
            await createItem(newItemName.trim(), token!);
            setNewItemName('');
            setIsAddModalOpen(false);
            await fetchItems();
        } catch (error: any) {
            console.error("❌ Błąd tworzenia przedmiotu:", error);
            if (error.message?.includes('401') || error.message?.includes('Bad token')) {
                setPermissionError("Potrzebujesz roli administratora aby tworzyć przedmioty");
            } else {
                setError(error.message || 'Błąd podczas tworzenia przedmiotu');
            }
        }
    };

    const openEditModal = (item: Item) => {
        // Sprawdź uprawnienia do modyfikacji przedmiotów (tylko admin)
        if (!canCreateItems()) {
            setPermissionError("Potrzebujesz roli administratora aby modyfikować przedmioty");
            return;
        }

        setEditingItem(item);
        setEditItemName(item.Name);
        setIsEditModalOpen(true);
    };

    const closeAndResetEditModal = () => {
        setIsEditModalOpen(false);
        setEditingItem(null);
        setEditItemName('');
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!editingItem) return;

        // Sprawdź uprawnienia do modyfikacji przedmiotów (tylko admin)
        if (!canCreateItems()) {
            setPermissionError("Potrzebujesz roli administratora aby modyfikować przedmioty");
            return;
        }

        if (!editItemName.trim()) {
            setError('Nazwa przedmiotu nie może być pusta');
            return;
        }

        try {
            await modifyItem(editingItem.ID, editItemName.trim(), token!);
            closeAndResetEditModal();
            await fetchItems();
        } catch (error: any) {
            console.error("❌ Błąd modyfikacji przedmiotu:", error);
            if (error.message?.includes('401') || error.message?.includes('Bad token')) {
                setPermissionError("Potrzebujesz roli administratora aby modyfikować przedmioty");
            } else {
                setError(error.message || 'Błąd podczas modyfikacji przedmiotu');
            }
        }
    };

    const handleOpenAddModal = () => {
        // Sprawdź uprawnienia przed otwarciem modala (tylko admin)
        if (!canCreateItems()) {
            setPermissionError("Potrzebujesz roli administratora aby tworzyć przedmioty");
            return;
        }
        setIsAddModalOpen(true);
    };

    const closeAndResetAddModal = () => {
        setIsAddModalOpen(false);
        setNewItemName('');
    };

    return (
        <div className="container mx-auto px-4">
            <div className="page-header">
                <h1>Zarządzanie Przedmiotami</h1>
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
                        {canCreateItems() && (
                            <button
                                onClick={handleOpenAddModal}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                                disabled={isLoading}
                            >
                                Dodaj Przedmiot
                            </button>
                        )}
                        {!canCreateItems() && (
                            <div className="text-sm text-gray-500">
                                ℹ️ Tylko administratorzy mogą dodawać przedmioty
                            </div>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nazwa</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akcje</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {items.map((item) => (
                                    <tr key={item.ID} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.ID}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.Name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {canCreateItems() ? (
                                                <button
                                                    onClick={() => openEditModal(item)}
                                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                                    disabled={isLoading}
                                                >
                                                    Modyfikuj
                                                </button>
                                            ) : (
                                                <span className="text-gray-400 text-sm">
                                                    Tylko admin
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : null}

            {/* Modal dodawania przedmiotu */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex flex-col h-full">
                            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                                <h2 className="text-xl font-semibold">Dodaj przedmiot</h2>
                                <button
                                    onClick={closeAndResetAddModal}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex-grow">
                                <form onSubmit={handleCreate} className="space-y-4">
                                    <div>
                                        <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">
                                            Nazwa przedmiotu
                                        </label>
                                        <input
                                            type="text"
                                            id="itemName"
                                            value={newItemName}
                                            onChange={(e) => setNewItemName(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Wprowadź nazwę przedmiotu"
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-2 pt-4 flex-shrink-0">
                                        <button
                                            type="submit"
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                                        >
                                            Dodaj
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal edycji przedmiotu */}
            {isEditModalOpen && editingItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex flex-col h-full">
                            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                                <h2 className="text-xl font-semibold">Edytuj przedmiot</h2>
                                <button
                                    onClick={closeAndResetEditModal}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex-grow">
                                <form onSubmit={handleEdit} className="space-y-4">
                                    <div>
                                        <label htmlFor="editItemName" className="block text-sm font-medium text-gray-700 mb-1">
                                            Nazwa przedmiotu
                                        </label>
                                        <input
                                            type="text"
                                            id="editItemName"
                                            value={editItemName}
                                            onChange={(e) => setEditItemName(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Wprowadź nazwę przedmiotu"
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-2 pt-4 flex-shrink-0">
                                        <button
                                            type="submit"
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                                        >
                                            Zapisz
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemsPage;

