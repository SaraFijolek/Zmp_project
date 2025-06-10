// src/__tests__/LanguageSwitcher.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageSwitcher } from '/src/utlis/LanguageSwitcher';
import i18n from '../i18n';

describe('LanguageSwitcher', () => {
    it('pokazuje wszystkie dostępne języki i pozwala zmienić', async () => {
        render(<LanguageSwitcher />);
        // zakładamy, że domyślnie jest "pl"
        expect(screen.getByText(/pl/i)).toBeInTheDocument();

        // otwieramy dropdown
        await userEvent.click(screen.getByRole('button'));
        // lista języków
        expect(screen.getByText('en')).toBeInTheDocument();
        expect(screen.getByText('pl')).toBeInTheDocument();

        // wybieramy "en"
        await userEvent.click(screen.getByText('en'));
        // upewniamy się, że i18n.language się zmieniło
        expect(i18n.language).toBe('en');
    });
});
