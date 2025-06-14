import React, { useState, FormEvent } from 'react';
import { createAdmin } from "../api/api";
import { useAuth } from '../context/AuthContext';

const RegisterAdmin: React.FC = () => {
    const { token, canAccessUsers } = useAuth();
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        if (!canAccessUsers()) {
            setError('Nie masz uprawnień do tworzenia administratorów!');
            setIsLoading(false);
            return;
        }

        if (!email || !phone || !name || !surname || !password) {
            setError('Wszystkie pola muszą być wypełnione!');
            setIsLoading(false);
            return;
        }

        try {
            const adminData = {
                Email: email,
                Phone: phone,
                Name: name,
                Surname: surname,
                Password: password
            };

            await createAdmin(adminData, token || undefined);
            setSuccess('Administrator został zarejestrowany pomyślnie!');
            
            // Wyczyść formularz
            setEmail('');
            setPhone('');
            setName('');
            setSurname('');
            setPassword('');
            
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Błąd sieci. Spróbuj ponownie.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!canAccessUsers()) {
        return (
            <div className="container mx-auto px-4">
                <div className="page-header">
                    <h1 className="text-black">Rejestracja administratora</h1>
                </div>
                <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="text-red-800">
                        <h2 className="text-lg font-semibold mb-2">Brak uprawnień</h2>
                        <p>Tylko administratorzy mogą tworzyć nowych administratorów.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4">
            <div className="page-header">
                <h1 className="text-black">Rejestracja administratora</h1>
            </div>

            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Imię
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Wpisz imię"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="surname" className="block text-sm font-medium text-gray-700">
                            Nazwisko
                        </label>
                        <input
                            id="surname"
                            type="text"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            placeholder="Wpisz nazwisko"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Adres e-mail
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Wpisz adres e-mail"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Hasło
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Wpisz hasło"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Telefon
                        </label>
                        <input
                            id="phone"
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Wpisz numer telefonu"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="success-message">
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="action-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Rejestracja...' : 'Zarejestruj'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterAdmin;

