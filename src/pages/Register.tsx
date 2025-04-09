import React, { useState, FormEvent } from 'react';

const RegisterAdmin: React.FC = () => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');


        if (!username || !email || !password) {
            setError('Wszystkie pola muszą być wypełnione!');
            return;
        }

        try {

            const response = await fetch('', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    role: 'admin',
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || 'Wystąpił błąd w rejestracji.');
                return;
            }

            const data = await response.json();
            if (data.success) {
                setSuccess('Administrator został zarejestrowany pomyślnie!');
                setUsername('');
                setEmail('');
                setPassword('');
            } else {
                setError('Nie udało się zarejestrować administratora.');
            }
        } catch (err) {
            console.error(err);
            setError('Błąd sieci. Spróbuj ponownie.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '20px auto' }}>
            <h2>Rejestracja administratora</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="username">Nazwa użytkownika:</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Wpisz nazwę użytkownika"
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="email">Adres e-mail:</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Wpisz adres e-mail"
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="password">Hasło:</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Wpisz hasło"
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                {error && (
                    <div style={{ color: 'red', marginBottom: '10px' }}>
                        {error}
                    </div>
                )}
                {success && (
                    <div style={{ color: 'green', marginBottom: '10px' }}>
                        {success}
                    </div>
                )}

                <button type="submit" style={{ padding: '10px 20px' }}>
                    Zarejestruj
                </button>
            </form>
        </div>
    );
};

export default RegisterAdmin;
