// src/__tests__/Login.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login';
import { AuthProvider } from '../context/AuthContext';

describe('Login page', () => {
    it('waliduje, że pola są wymagane i wyświetla błąd', async () => {
        render(
            <AuthProvider>
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            </AuthProvider>
        );
        // przycisk submit
        const btn = screen.getByRole('button', { name: /zaloguj/i });
        await userEvent.click(btn);

        // sprawdź, że komunikaty błędów się pojawiły
        expect(await screen.findByText(/email jest wymagany/i)).toBeVisible();
        expect(await screen.findByText(/hasło jest wymagane/i)).toBeVisible();
    });

    it('udaje wywołanie API i przekierowuje', async () => {
        // tu mógłbyś użyć msw do mockowania fetch/api.login
    });
});
