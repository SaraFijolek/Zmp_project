const BASE_URL = "/api";
function buildHeaders(token?: string, extra?: Record<string, string>) {
    const headers: Record<string,string> = {
        'Content-Type': 'application/json',
        'Token': 'test_token3'
    };
    if (token) headers['Token'] = token;
    if (extra) Object.assign(headers, extra);
    return headers;
}

export async function loginUser(
    email: string,
    password: string,
    google2fa: string
) {

    const headers = buildHeaders(undefined, {
        Email: email,
        Password: password,
        Google2fa: google2fa,
    });
    const res = await fetch(`${BASE_URL}/user/login`, {
        method: 'POST',
        headers,
    });
    if (!res.ok) throw new Error('Błąd logowania użytkownika');
    return await res.json(); // { access_token, message }
}

export async function resetUserPassword(token: string) {

    const res = await fetch(`${BASE_URL}/user/reset`, {
        method: 'PUT',
        headers: buildHeaders(token),
    });
    if (!res.ok) throw new Error('Błąd resetowania hasła użytkownika');
    return await res.json(); // { message }
}

export async function listUsers(token: string) {

    const res = await fetch(`/api/user/index`, {
        method: 'GET',
        headers: buildHeaders(token),
    });
    if (!res.ok) throw new Error('Błąd pobierania listy użytkowników');
    return await res.json();
}

export async function createUser(
    token: string,
    email: string,
    phone: string,
    name: string,
    surname: string
) {

    const headers = buildHeaders(token, {
        Email: email,
        Phone: phone,
        Name: name,
        Surname: surname,
    });
    const res = await fetch(`/api/user/create`, {
        method: 'POST',
        headers,
    });
    if (!res.ok) throw new Error('Błąd tworzenia użytkownika');
    return await res.json();
}

export async function modifyUser(
    token: string,
    userId: number,
    data: {
        email?: string;
        phone?: string;
        name?: string;
        surname?: string;
        accountActive?: boolean;
    }
) {

    const extra: Record<string,string> = { UserId: userId.toString() };
    if (data.email) extra.Email = data.email;
    if (data.phone) extra.Phone = data.phone;
    if (data.name) extra.Name = data.name;
    if (data.surname) extra.Surname = data.surname;
    if (data.accountActive !== undefined) extra.AccountActive = data.accountActive.toString();
    const res = await fetch(`/api/user/modify`, {
        method: 'PUT',
        headers: buildHeaders(token, extra),
    });
    if (!res.ok) throw new Error('Błąd modyfikacji użytkownika');
    return await res.json();
}

// ADMIN (Web/Desktop app)
export async function loginAdmin(
    email: string,
    password: string,
    google2fa: string
) {

    const headers = buildHeaders(undefined, {
        Email: email,
        Password: password,
        Google2fa: google2fa,
    });
    const res = await fetch(`${BASE_URL}/admin/login`, {
        method: 'POST',
        headers,
    });
    if (!res.ok) throw new Error('Błąd logowania administratora');
    return await res.json(); // { access_token, message }
}

export async function resetAdminPassword(token: string) {

    const res = await fetch(`${BASE_URL}/admin/reset`, {
        method: 'PUT',
        headers: buildHeaders(token),
    });
    if (!res.ok) throw new Error('Błąd resetowania hasła admina');
    return await res.json();
}

export async function getAdminNotifications(token: string) {

    const res = await fetch(`${BASE_URL}/admin/notification`, {
        method: 'GET',
        headers: buildHeaders(token),
    });
    if (!res.ok) throw new Error('Błąd pobierania powiadomień');
    return await res.json();
}

export async function listItems(token: string) {

    const res = await fetch(`${BASE_URL}/item/index`, {
        method: 'GET',
        headers: buildHeaders(token),
    });
    if (!res.ok) throw new Error('Błąd pobierania listy przedmiotów');
    return await res.json();
}

export async function createItem(token: string, name: string) {

    const res = await fetch(`${BASE_URL}/item/create`, {
        method: 'POST',
        headers: buildHeaders(token, { Name: name }),
    });
    if (!res.ok) throw new Error('Błąd tworzenia przedmiotu');
    return await res.json();
}

export async function modifyItem(
    token: string,
    id: number,
    name?: string
) {

    const extra: Record<string,string> = { ID: id.toString() };
    if (name) extra.Name = name;
    const res = await fetch(`${BASE_URL}/item/modify`, {
        method: 'PUT',
        headers: buildHeaders(token, extra),
    });
    if (!res.ok) throw new Error('Błąd modyfikacji przedmiotu');
    return await res.json();
}

export async function listStock(token: string) {

    const res = await fetch(`${BASE_URL}/stock/index`, {
        method: 'GET',
        headers: buildHeaders(token),
    });
    if (!res.ok) throw new Error('Błąd pobierania stanu magazynu');
    return await res.json();
}

export async function addStock(
    token: string,
    productId: number,
    amount: number,
    location: string
) {

    const res = await fetch(`${BASE_URL}/stock/add`, {
        method: 'POST',
        headers: buildHeaders(token, {
            ProductID: productId.toString(),
            Amount: amount.toString(),
            Location: location,
        }),
    });
    if (!res.ok) throw new Error('Błąd dodawania stanu magazynowego');
    return await res.json();
}

export async function modifyStock(
    token: string,
    id: number,
    data: {
        productId?: number;
        amount?: number;
        location?: string;
    }
) {

    const extra: Record<string,string> = { ID: id.toString() };
    if (data.productId !== undefined) extra.ProductID = data.productId.toString();
    if (data.amount !== undefined) extra.Amount = data.amount.toString();
    if (data.location) extra.Location = data.location;
    const res = await fetch(`${BASE_URL}/stock/modify`, {
        method: 'PUT',
        headers: buildHeaders(token, extra),
    });
    if (!res.ok) throw new Error('Błąd modyfikacji stanu magazynowego');
    return await res.json();
}


