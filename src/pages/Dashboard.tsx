import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserPermissions } from '../api/api';

interface UserPermissions {
    canAccessUsers: boolean;
    canAccessItems: boolean;
    canAccessStock: boolean;
    canCreateItems: boolean;
    canModifyItems: boolean;
    canCreateUsers: boolean;
    canModifyUsers: boolean;
    canCreateAdmins: boolean;
    userRole: string;
    availableEndpoints: string[];
}

const Dashboard: React.FC = () => {
    const { logout, token } = useAuth();
    const [permissions, setPermissions] = useState<UserPermissions | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchPermissions = async () => {
            if (!token) return;
            
            try {
                setLoading(true);
                setError('');
                const userPermissions = await getUserPermissions(token);
                setPermissions(userPermissions);
            } catch (err: any) {
                setError(err.message || 'Błąd pobierania uprawnień');
                console.error('Błąd pobierania uprawnień:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPermissions();
    }, [token]);

    const getPermissionInfo = () => {
        if (!permissions) return null;
        
        const permissionsList = [
            {
                label: "Zarządzanie użytkownikami",
                hasPermission: permissions.canAccessUsers,
                adminOnly: true
            },
            {
                label: "Przeglądanie przedmiotów", 
                hasPermission: permissions.canAccessItems,
                adminOnly: false
            },
            {
                label: "Tworzenie/modyfikacja przedmiotów",
                hasPermission: permissions.canCreateItems,
                adminOnly: true
            },
            {
                label: "Dostęp do magazynu",
                hasPermission: permissions.canAccessStock,
                adminOnly: false
            },
            {
                label: "Tworzenie administratorów",
                hasPermission: permissions.canCreateAdmins,
                adminOnly: true
            }
        ];

        return {
            title: permissions.userRole === 'admin' ? 'Administrator' : 'Użytkownik',
            description: `Rola: ${permissions.userRole}`,
            permissions: permissionsList.map(p => 
                `${p.hasPermission ? '✅' : '❌'} ${p.label}${p.adminOnly ? ' (tylko admin)' : ''}`
            ),
            availableEndpoints: permissions.availableEndpoints
        };
    };

    const permissionInfo = getPermissionInfo();

    if (loading) {
        return (
            <div className="container mx-auto px-4">
                <div className="page-header">
                    <h1 className="text-black">Panel Sterowania</h1>
                </div>
                <div className="flex justify-center items-center py-8">
                    <div className="text-gray-600">Ładowanie uprawnień...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4">
                <div className="page-header">
                    <h1 className="text-black">Panel Sterowania</h1>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-red-800">
                        <h2 className="text-lg font-semibold mb-2">Błąd ładowania uprawnień</h2>
                        <p>{error}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                            Odśwież stronę
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4">
            <div className="page-header">
                <h1 className="text-black">Panel Sterowania</h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="dashboard-card">
                    <h2 className="text-black">Informacje o użytkowniku</h2>
                    <p>Jesteś zalogowany jako: <strong>{permissionInfo?.title}</strong></p>
                    <p className="text-sm text-gray-600 mt-2">{permissionInfo?.description}</p>
                </div>
                
                {permissionInfo && (
                    <div className="dashboard-card">
                        <h2 className="text-black">Twoje uprawnienia</h2>
                        <ul className="text-sm space-y-1 mt-2">
                            {permissionInfo.permissions.map((permission, index) => (
                                <li key={index}>
                                    <span>{permission}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                
                <div className="dashboard-card">
                    <h2 className="text-black">Akcje</h2>
                    <div className="mt-2">
                        <button 
                            onClick={() => window.location.reload()}
                            className="action-button bg-blue-600 hover:bg-blue-700"
                        >
                            Odśwież uprawnienia
                        </button>
                        <button 
                            onClick={logout}
                            className="action-button bg-red-600 hover:bg-red-700"
                        >
                            Wyloguj
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
