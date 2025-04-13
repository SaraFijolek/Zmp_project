const API_URL = "https://127.0.0.1/api";


export async function getReport() {
    const response = await fetch(`${API_URL}/stock/index`);
    if (!response.ok) {
        throw new Error("Błąd podczas pobierania raportu");
    }
    return await response.json();
}


export async function login(username: string, password: string, isAdmin = false) {
    const endpoint = isAdmin ? "/admin/login" : "/user/login";
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: {
            "Content-Type": "application/json"
        },
    });

    return await response.json();
}
export async function registerAdmin(username: string, email: string, password: string) {
    const response = await fetch(`${API_URL}/user/create`, {
        method: "POST",
        body: JSON.stringify({
            username,
            email,
            password,
            role: "admin"
        }),
        headers: {
            "Content-Type": "application/json"
        },
    });

    return await response.json();
}

