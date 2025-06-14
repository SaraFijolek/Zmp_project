import React, { useEffect, useState } from "react";
import { listStock, addStock, modifyStock } from "../api/api";
import { useAuth } from "../context/AuthContext";
import PermissionMessage from "../components/PermissionMessage";
import Modal from '../components/Modal';
import "../App.css";

interface StockItem {
    id: number;
    productId: number;
    amount: number;
    location: string;
}

const StockPage: React.FC = () => {
    const { token, canAccessStock, canModifyStock } = useAuth();
    const [stock, setStock] = useState<StockItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [permissionError, setPermissionError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [newStock, setNewStock] = useState({ productId: '', amount: '', location: '' });
    const [editingStock, setEditingStock] = useState<StockItem | null>(null);
    const [editStock, setEditStock] = useState({ productId: '', amount: '', location: '' });

    const fetchStock = async () => {
        if (!token) {
            setError('Brak tokenu autoryzacyjnego');
            return;
        }

        // Sprawdź uprawnienia do przeglądania magazynu (user lub admin)
        if (!canAccessStock()) {
            setPermissionError("Musisz być zalogowany aby przeglądać magazyn");
            return;
        }

        setIsLoading(true);
        setError(null);
        setPermissionError(null);

        try {
            const response = await listStock(token);
            
            if (Array.isArray(response)) {
                const mappedStock = response.map(item => {
                    return {
                        id: item.id || item.ID,
                        productId: item.productId || item.ProductID,
                        amount: item.amount || item.Amount,
                        location: item.location || item.Location
                    };
                });
                setStock(mappedStock);
            } else {
                setError('Nieoczekiwana struktura odpowiedzi z serwera');
            }
        } catch (error: any) {
            console.error("Błąd podczas pobierania stanu magazynu:", error);
            if (error.message?.includes('401') || error.message?.includes('Bad token')) {
                setPermissionError("Musisz być zalogowany aby przeglądać magazyn");
            } else {
                setError(error.message || 'Wystąpił błąd podczas pobierania stanu magazynu');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStock();
    }, [token]);

    const openModal = () => {
        // Sprawdź uprawnienia do dodawania stanu magazynowego (user lub admin)
        if (!canModifyStock()) {
            setPermissionError("Musisz być zalogowany aby dodawać do magazynu");
            return;
        }
        setIsModalOpen(true);
    };

    const closeAndResetModal = () => {
        setIsModalOpen(false);
        setNewStock({ productId: '', amount: '', location: '' });
    };

    const openEditModal = (item: StockItem) => {
        // Sprawdź uprawnienia do modyfikacji stanu magazynowego (user lub admin)
        if (!canModifyStock()) {
            setPermissionError("Musisz być zalogowany aby modyfikować magazyn");
            return;
        }

        console.log('🔧 Opening edit modal for item:', item);
        setEditingStock(item);
        setEditStock({
            productId: item.productId.toString(),
            amount: item.amount.toString(),
            location: item.location
        });
        setIsEditModalOpen(true);
    };

    const closeAndResetEditModal = () => {
        setIsEditModalOpen(false);
        setEditingStock(null);
        setEditStock({ productId: '', amount: '', location: '' });
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Sprawdź uprawnienia do dodawania stanu magazynowego (user lub admin)
        if (!canModifyStock()) {
            setPermissionError("Musisz być zalogowany aby dodawać do magazynu");
            return;
        }

        if (!newStock.productId || !newStock.amount || !newStock.location) return;
        
        try {
            await addStock({
                ProductID: parseInt(newStock.productId),
                Amount: parseInt(newStock.amount),
                Location: newStock.location
            }, token!);
            setNewStock({ productId: '', amount: '', location: '' });
            await fetchStock();
            closeAndResetModal();
        } catch (err: any) {
            console.error("Błąd podczas dodawania stanu magazynowego:", err);
            if (err.message?.includes('401') || err.message?.includes('Bad token')) {
                setPermissionError("Musisz być zalogowany aby dodawać do magazynu");
            } else {
                setError(err.message || 'Wystąpił błąd podczas dodawania stanu magazynowego');
            }
        }
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingStock) return;
        
        // Sprawdź uprawnienia do modyfikacji stanu magazynowego (user lub admin)
        if (!canModifyStock()) {
            setPermissionError("Musisz być zalogowany aby modyfikować magazyn");
            return;
        }
        
        const updateData: any = {};
        
        // Sprawdź czy ProductID się zmienił i czy jest poprawny
        if (editStock.productId && editStock.productId.trim() !== editingStock.productId.toString()) {
            const newProductId = parseInt(editStock.productId.trim());
            if (!isNaN(newProductId) && newProductId > 0) {
                updateData.ProductID = newProductId;
            }
        }
        
        // Sprawdź czy Amount się zmienił i czy jest poprawny
        if (editStock.amount && editStock.amount.trim() !== editingStock.amount.toString()) {
            const newAmount = parseInt(editStock.amount.trim());
            if (!isNaN(newAmount) && newAmount >= 0) {
                updateData.Amount = newAmount;
            }
        }
        
        // Sprawdź czy Location się zmieniła
        if (editStock.location && editStock.location.trim() !== editingStock.location) {
            updateData.Location = editStock.location.trim();
        }

        console.log('📝 Editing stock:', editingStock.id, 'with data:', updateData);

        if (Object.keys(updateData).length === 0) {
            console.log('ℹ️ No changes detected, closing modal');
            closeAndResetEditModal();
            return;
        }

        try {
            await modifyStock(editingStock.id, updateData, token!);
            await fetchStock();
            closeAndResetEditModal();
        } catch (err: any) {
            console.error("Błąd podczas modyfikacji stanu magazynowego:", err);
            if (err.message?.includes('401') || err.message?.includes('Bad token')) {
                setPermissionError("Musisz być zalogowany aby modyfikować magazyn");
            } else {
                setError(err.message || 'Wystąpił błąd podczas modyfikacji stanu magazynowego');
            }
        }
    };

    return (
        <div className="container mx-auto px-4">
            <div className="page-header">
                <h1 className="text-black">Zarządzanie stanem magazynu</h1>
            </div>

            {permissionError && (
                <div className="mb-4">
                    <PermissionMessage message={permissionError} type="warning" />
                </div>
            )}

            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <button 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={openModal}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Ładowanie...' : 'Dodaj stan magazynowy'}
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Produktu</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ilość</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokalizacja</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akcje</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {stock.map(item => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.productId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.amount}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.location}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <button
                                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                                onClick={() => openEditModal(item)}
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
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={closeAndResetModal}>
                <h2 className="text-xl font-semibold mb-4">Dodaj stan magazynowy</h2>
                <form onSubmit={handleAdd} className="space-y-4">
                    <div>
                        <label htmlFor="productId" className="block text-sm font-medium text-gray-700">ID Produktu</label>
                        <input
                            id="productId"
                            type="number"
                            value={newStock.productId}
                            onChange={e => setNewStock({ ...newStock, productId: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Ilość</label>
                        <input
                            id="amount"
                            type="number"
                            value={newStock.amount}
                            onChange={e => setNewStock({ ...newStock, amount: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Lokalizacja</label>
                        <input
                            id="location"
                            type="text"
                            value={newStock.location}
                            onChange={e => setNewStock({ ...newStock, location: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md w-full"
                        disabled={isLoading}
                    >
                        Dodaj
                    </button>
                </form>
            </Modal>

            <Modal isOpen={isEditModalOpen} onClose={closeAndResetEditModal}>
                <h2 className="text-xl font-semibold mb-4">Modyfikuj stan magazynowy</h2>
                <form onSubmit={handleEdit} className="space-y-4">
                    <div>
                        <label htmlFor="editProductId" className="block text-sm font-medium text-gray-700">ID Produktu</label>
                        <input
                            id="editProductId"
                            type="number"
                            value={editStock.productId}
                            onChange={e => setEditStock({ ...editStock, productId: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="editAmount" className="block text-sm font-medium text-gray-700">Ilość</label>
                        <input
                            id="editAmount"
                            type="number"
                            value={editStock.amount}
                            onChange={e => setEditStock({ ...editStock, amount: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="editLocation" className="block text-sm font-medium text-gray-700">Lokalizacja</label>
                        <input
                            id="editLocation"
                            type="text"
                            value={editStock.location}
                            onChange={e => setEditStock({ ...editStock, location: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="flex space-x-2">
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md"
                            disabled={isLoading}
                        >
                            Zapisz zmiany
                        </button>
                        <button
                            type="button"
                            onClick={closeAndResetEditModal}
                            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md"
                            disabled={isLoading}
                        >
                            Anuluj
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default StockPage;
