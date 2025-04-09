import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { login } from "../api/api";

function Login() {
    const { login: authLogin } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        const data = await login(username, password);
        if (data.success) {
            authLogin(data.token);
            window.location.href = "/dashboard";
        } else {
            alert("Błędne dane logowania");
        }
    };

    return (
        <div>
            <h2>Logowanie</h2>
            <input placeholder="Nazwa użytkownika" onChange={e => setUsername(e.target.value)} />
            <input type="password" placeholder="Hasło" onChange={e => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Zaloguj</button>
        </div>
    );
}

export default Login;
