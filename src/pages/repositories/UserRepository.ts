import { listUsers, createUser, modifyUser } from "../api/api";

export interface User {
    id: number;
    name: string;
    surname: string;
    email: string;
    phone: string;
}

export class UserRepository {
    constructor(private token: string) {}

    /**
     * Obsługa różnych struktur odpowiedzi z API
     */
    private mapResponse(response: any): User[] {
        let arr: any[] = [];

        // Możliwe struktury:
        // 1) response.array
        if (response?.array && Array.isArray(response.array)) {
            arr = response.array;
        }
        // 2) response.data.array (dla axios)
        else if (response?.data?.array && Array.isArray(response.data.array)) {
            arr = response.data.array;
        }
        // 3) bezpośrednia tablica pod response lub response.data
        else if (Array.isArray(response)) {
            arr = response;
        } else if (Array.isArray(response?.data)) {
            arr = response.data;
        } else {
            console.warn("UserRepository: nieznana struktura odpowiedzi", response);
        }

        return arr.map((u: any) => ({
            id: u.ID,
            name: u.Name,
            surname: u.Surname,
            email: u.Email,
            phone: u.Phone,
        }));
    }

    async getAll(): Promise<User[]> {
        const resp = await listUsers(this.token);
        return this.mapResponse(resp);
    }

    async add(
        email: string,
        phone: string,
        name: string,
        surname: string
    ): Promise<User[]> {
        await createUser(this.token, email, phone, name, surname);
        return this.getAll();
    }

    async modify(
        userId: number,
        data: { email?: string; name?: string; surname?: string; phone?: string; accountActive?: boolean }
    ): Promise<User[]> {
        await modifyUser(this.token, userId, data);
        return this.getAll();
    }
}