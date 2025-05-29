const Login: React.FC = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [google2fa, setGoogle2fa] = useState("");
    const [show2fa, setShow2fa] = useState(false);

    const handleSubmit = async () => {
        try {
            // jeśli 2FA nie jest widoczne, przekaż pusty ciąg
            const resp = await loginAdmin(email, password, google2fa || "");
            login(resp.token, "admin");
            window.location.href = "/items";
        } catch (err) {
            alert("Błąd logowania administratora");
            console.error(err);
        }
    };

    return (
        <div className="page-card mt-4 mb-4" style={{ maxWidth: 360 }}>
            <h2 className="mb-4" style={{ textAlign: "center" }}>
                Logowanie Administrator
            </h2>

            <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Hasło"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ marginTop: 12 }}
            />

            <button
                className="secondary mt-3"
                onClick={() => setShow2fa(prev => !prev)}
                style={{ width: "100%" }}
            >
                {show2fa ? "Ukryj 2FA" : "Wprowadź kod 2FA"}
            </button>

            {show2fa && (
                <input
                    type="text"
                    placeholder="Google2FA kod"
                    value={google2fa}
                    onChange={(e) => setGoogle2fa(e.target.value)}
                    style={{ marginTop: 12 }}
                />
            )}

            <button className="primary mt-4" onClick={handleSubmit}>
                Zaloguj
            </button>

            <Link
                to="/forgot-password"
                className="mt-4"
                style={{ display: "block", textAlign: "center", color: "#3b82f6" }}
            >
                Zapomniałeś hasła?
            </Link>
        </div>
    );
};

export default Login;


