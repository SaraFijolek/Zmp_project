import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { login } from "../api/api";

const Login: React.FC = () => {
    const { login: authLogin } = useContext(AuthContext);

    // stan dla obu kroków
    const [step, setStep] = useState<"credentials" | "2fa">("credentials");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [tempToken, setTempToken] = useState<string | null>(null);
    const [code2fa, setCode2fa] = useState("");

    // krok 1: sprawdzenie user+pass
    const handleCredentials = async () => {
        try {
            const resp = await login(username, password, /* opcjonalnie trzeci parametr */ true);

            if (resp.twoFactorRequired) {
                // jeśli włączone 2FA → przejdź do kroku drugiego
                setTempToken(resp.tempToken!);
                setStep("2fa");
            } else if (resp.success) {
                // jeśli brak 2FA → loguj od razu
                authLogin(resp.token!);
                window.location.href = "/dashboard";
            } else {
                alert("Błędne dane logowania");
            }
        } catch (err) {
            console.error(err);
            alert("Błąd sieci lub serwera");
        }
    };

    // krok 2: weryfikacja kodu 2FA
    const handle2fa = async () => {
        if (!tempToken) return;

        try {
            // korzystamy z tego samego api albo dedykowanej metody, np. login2fa()
            const resp = await login(tempToken, code2fa, /* flaga 2fa? */ false);

            if (resp.success) {
                authLogin(resp.token!);
                window.location.href = "/dashboard";
            } else {
                alert("Błędny kod 2FA");
            }
        } catch (err) {
            console.error(err);
            alert("Błąd weryfikacji 2FA");
        }
    };

    return (
        <div style={{ maxWidth: 320, margin: "40px auto", textAlign: "center" }}>
            <h2>Logowanie</h2>

            {step === "credentials" ? (
                <>
                    <input
                        type="text"
                        placeholder="Nazwa użytkownika"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ width: "100%", padding: 8, marginBottom: 12 }}
                    />
                    <input
                        type="password"
                        placeholder="Hasło"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: "100%", padding: 8, marginBottom: 12 }}
                    />
                    <button onClick={handleCredentials} style={{ padding: "8px 16px" }}>
                        Dalej
                    </button>
                </>
            ) : (
                <>
                    <p>Wprowadź kod z Google Authenticator:</p>
                    <input
                        type="text"
                        placeholder="6-cyfrowy kod"
                        value={code2fa}
                        onChange={(e) => setCode2fa(e.target.value)}
                        style={{ width: "100%", padding: 8, marginBottom: 12, textAlign: "center" }}
                    />
                    <button onClick={handle2fa} style={{ padding: "8px 16px" }}>
                        Zaloguj
                    </button>
                </>
            )}
        </div>
    );
};

export default Login;
