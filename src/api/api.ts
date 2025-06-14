

const BASE_URL = 'http://localhost:8080';


function getToken(): string | null {
    return localStorage.getItem('token');
}


function saveToken(token: string): void {
    localStorage.setItem('token', token);
}


function removeToken(): void {
    localStorage.removeItem('token');
}

function buildHeaders(token?: string): Record<string, string> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };
    if (token) {
        headers['Token'] = token;
    }
    return headers;
}

export async function loginUser(email: string, password: string, google2fa: string) {
    const requestData: any = {
        Email: email,
        Password: password
    };
    
    if (google2fa && google2fa.trim()) {
        requestData.Google2fa = google2fa.trim();
    }
    
    const response = await fetch(`${BASE_URL}/api/user/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Błąd logowania użytkownika');
    }
    
    const data = await response.json();
    if (data.access_token) {
        saveToken(data.access_token);
    }
    return data;
}

export async function resetUserPassword(token?: string) {
    const authToken = token || getToken();
    if (!authToken) throw new Error('Brak tokenu autoryzacji');
    
    const response = await fetch(`${BASE_URL}/api/user/reset`, {
        method: 'PUT',
        headers: buildHeaders(authToken)
    });
    
    if (!response.ok) throw new Error('Błąd resetowania hasła użytkownika');
    return await response.json();
}

export async function listUsers(token?: string) {
    const authToken = token || getToken();
    if (!authToken) {
        throw new Error('Token jest wymagany do pobrania listy użytkowników');
    }
    
    const response = await fetch(`${BASE_URL}/api/user/index`, {
        method: 'GET',
        headers: buildHeaders(authToken)
    });
    
    if (!response.ok) {
        if (response.status === 401) {
            console.error(' Token jest nieprawidłowy lub wygasł');
            removeToken();
            throw new Error('Token jest nieprawidłowy lub wygasł. Spróbuj się zalogować ponownie.');
        }
        
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Błąd pobierania listy użytkowników (${response.status})`);
    }
    
    const data = await response.json();
    return data.array || data;
}

export async function createUser(userData: {
    Email: string;
    Phone: string;
    Name: string;
    Surname: string;
}, token?: string) {
    const authToken = token || getToken();
    if (!authToken) throw new Error('Brak tokenu autoryzacji');
    
    const response = await fetch(`${BASE_URL}/api/user/create`, {
        method: 'POST',
        headers: buildHeaders(authToken),
        body: JSON.stringify(userData)
    });
    
    if (!response.ok) throw new Error('Błąd tworzenia użytkownika');
    return await response.json();
}

export async function modifyUser(userId: number, data: {
    Email?: string;
    Phone?: string;
    Name?: string;
    Surname?: string;
    AccountActive?: boolean;
}, token?: string) {
    const authToken = token || getToken();
    if (!authToken) throw new Error('Brak tokenu autoryzacji');
    
    const requestData = {
        UserId: userId,
        ...data
    };
    
    const response = await fetch(`${BASE_URL}/api/user/modify`, {
        method: 'PUT',
        headers: buildHeaders(authToken),
        body: JSON.stringify(requestData)
    });
    
    if (!response.ok) throw new Error('Błąd modyfikacji użytkownika');
    return await response.json();
}

export async function loginAdmin(email: string, password: string, google2fa: string) {
    const requestData: any = {
        Email: email,
        Password: password
    };
    
    if (google2fa && google2fa.trim()) {
        requestData.Google2fa = google2fa.trim();
    }
    
    const response = await fetch(`${BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Błąd logowania administratora');
    }
    
    const data = await response.json();
    if (data.access_token) {
        saveToken(data.access_token);
    }
    return data;
}

export async function createAdmin(adminData: {
    Email: string;
    Phone: string;
    Name: string;
    Surname: string;
}, token?: string) {
    const authToken = token || getToken();
    if (!authToken) throw new Error('Brak tokenu autoryzacji');
    
    const response = await fetch(`${BASE_URL}/api/admin/create`, {
        method: 'POST',
        headers: buildHeaders(authToken),
        body: JSON.stringify(adminData)
    });
    
    if (!response.ok) throw new Error('Błąd tworzenia administratora');
    return await response.json();
}

export async function resetAdminPassword(token?: string) {
    const authToken = token || getToken();
    if (!authToken) throw new Error('Brak tokenu autoryzacji');
    
    const response = await fetch(`${BASE_URL}/api/admin/reset`, {
        method: 'PUT',
        headers: buildHeaders(authToken)
    });
    
    if (!response.ok) throw new Error('Błąd resetowania hasła admina');
    return await response.json();
}

export async function getAdminNotifications(token?: string) {
    const authToken = token || getToken();
    if (!authToken) throw new Error('Brak tokenu autoryzacji');
    
    const response = await fetch(`${BASE_URL}/api/admin/notification`, {
        method: 'GET',
        headers: buildHeaders(authToken)
    });
    
    if (!response.ok) throw new Error('Błąd pobierania powiadomień');
    return await response.json();
}


export async function getUserPermissions(token?: string) {
    const authToken = token || getToken();
    if (!authToken) throw new Error('Brak tokenu autoryzacji');
    
    const permissions = {
        canAccessUsers: false,
        canAccessItems: false,
        canAccessStock: false,
        canCreateItems: false,
        canModifyItems: false,
        canCreateUsers: false,
        canModifyUsers: false,
        canCreateAdmins: false,
        userRole: 'unknown',
        availableEndpoints: [] as string[]
    };
    
    
    const endpointsToTest = [
        { name: 'users', url: `${BASE_URL}/api/user/index`, permission: 'canAccessUsers' },
        { name: 'items', url: `${BASE_URL}/api/item/index`, permission: 'canAccessItems' },
        { name: 'stock', url: `${BASE_URL}/api/stock/index`, permission: 'canAccessStock' },
        { name: 'admin-notifications', url: `${BASE_URL}/api/admin/notification`, permission: 'canCreateAdmins' }
    ];
    
    for (const endpoint of endpointsToTest) {
        try {
            const response = await fetch(endpoint.url, {
                method: 'GET',
                headers: buildHeaders(authToken)
            });
            
            if (response.ok || response.status === 200) {
                (permissions as any)[endpoint.permission] = true;
                permissions.availableEndpoints.push(endpoint.name);
            }
        } catch (error) {
            
        }
    }
    
    
    try {
        const response = await fetch(`${BASE_URL}/api/item/create`, {
            method: 'POST',
            headers: buildHeaders(authToken),
            body: JSON.stringify({ Name: '__test__permission__check__' })
        });
        
       
        if (response.status !== 401 && response.status !== 403) {
            permissions.canCreateItems = true;
            permissions.canModifyItems = true;
        }
    } catch (error) {
        
    }
    
    
    if (permissions.canCreateAdmins) {
        permissions.userRole = 'admin';
    } else if (permissions.canAccessItems || permissions.canAccessStock) {
        permissions.userRole = 'user';
    }
    
    return permissions;
}

export async function listItems(token?: string) {
    const authToken = token || getToken();
    if (!authToken) throw new Error('Brak tokenu autoryzacji');
    
    const response = await fetch(`${BASE_URL}/api/item/index`, {
        method: 'GET',
        headers: buildHeaders(authToken)
    });
    
    if (!response.ok) throw new Error('Błąd pobierania listy przedmiotów');
    const data = await response.json();
    return data.array || data;
}

export async function createItem(name: string, token?: string) {
    const authToken = token || getToken();
    if (!authToken) throw new Error('Brak tokenu autoryzacji');
    
    const response = await fetch(`${BASE_URL}/api/item/create`, {
        method: 'POST',
        headers: buildHeaders(authToken),
        body: JSON.stringify({ Name: name })
    });
    
    if (!response.ok) throw new Error('Błąd tworzenia przedmiotu');
    return await response.json();
}

export async function modifyItem(id: number, name?: string, token?: string) {
    const authToken = token || getToken();
    if (!authToken) throw new Error('Brak tokenu autoryzacji');
    
    const requestData: any = { ID: id };
    if (name) requestData.Name = name;
    
    const response = await fetch(`${BASE_URL}/api/item/modify`, {
        method: 'PUT',
        headers: buildHeaders(authToken),
        body: JSON.stringify(requestData)
    });
    
    if (!response.ok) throw new Error('Błąd modyfikacji przedmiotu');
    return await response.json();
}

export async function listStock(token?: string) {
    const authToken = token || getToken();
    if (!authToken) throw new Error('Brak tokenu autoryzacji');
    
    const response = await fetch(`${BASE_URL}/api/stock/index`, {
        method: 'GET',
        headers: buildHeaders(authToken)
    });
    
    if (!response.ok) throw new Error('Błąd pobierania stanu magazynu');
    const data = await response.json();
    return data.array || data;
}

export async function addStock(stockData: {
    ProductID: number;
    Amount: number;
    Location: string;
}, token?: string) {
    const authToken = token || getToken();
    if (!authToken) throw new Error('Brak tokenu autoryzacji');
    
    const response = await fetch(`${BASE_URL}/api/stock/add`, {
        method: 'POST',
        headers: buildHeaders(authToken),
        body: JSON.stringify(stockData)
    });
    
    if (!response.ok) throw new Error('Błąd dodawania stanu magazynowego');
    return await response.json();
}

export async function modifyStock(id: number, data: {
    ProductID?: number;
    Amount?: number;
    Location?: string;
}, token?: string) {
    const authToken = token || getToken();
    if (!authToken) throw new Error('Brak tokenu autoryzacji');
    
    const requestData = {
        ID: id,
        ...data
    };
    
    console.log(' Modifying stock with data:', requestData);
    console.log(' Using token:', authToken);
    
    const response = await fetch(`${BASE_URL}/api/stock/modify`, {
        method: 'PUT',
        headers: buildHeaders(authToken),
        body: JSON.stringify(requestData)
    });
    
    if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error(' Stock modify error response:', errorText);
        throw new Error('Błąd modyfikacji stanu magazynowego');
    }
    return await response.json();
}

export async function locateStock(productId: number, token?: string) {
    const authToken = token || getToken();
    if (!authToken) throw new Error('Brak tokenu autoryzacji');
    
    const response = await fetch(`${BASE_URL}/api/stock/locate`, {
        method: 'POST',
        headers: buildHeaders(authToken),
        body: JSON.stringify({ ProductID: productId })
    });
    
    if (!response.ok) throw new Error('Błąd pobierania lokalizacji przedmiotu');
    return await response.json();
}




export { getToken, saveToken, removeToken };


