const API_URL = "";
export async function getReport() {
    const response = await fetch("");
    return response.json();
}


export async function login(username: string, password: string) {
    const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ action: "login", username, password }),
        headers: { "Content-Type": "application/json" },
    });
    return response.json();
}
