import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from './AuthContext.tsx';
import axios from 'axios';

const Setup2FA: React.FC = () => {
    const { token } = useContext(AuthContext);
    const [qrDataUrl, setQrDataUrl] = useState<string>('');
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        // pobierz QR po autoryzacji
        axios.post('/api/2fa/setup', {}, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(resp => setQrDataUrl(resp.data.qrDataUrl));
    }, [token]);

    const handleVerify = async () => {
        try {
            await axios.post('/api/2fa/verify-setup', { token: code }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('2FA włączone pomyślnie!');
        } catch {
            setMessage('Nieprawidłowy kod, spróbuj ponownie.');
        }
    };

    return (
        <div>
            <h2>Konfiguracja uwierzytelniania dwuetapowego</h2>
            {qrDataUrl && <img src={qrDataUrl} alt="QR do Google Authenticator" />}
            <p>Zeskanuj QR w Google Authenticator, a następnie wpisz poniżej kod.</p>
            <input
                type="text"
                placeholder="6-cyfrowy kod"
                value={code}
                onChange={e => setCode(e.target.value)}
            />
            <button onClick={handleVerify}>Potwierdź</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Setup2FA;
