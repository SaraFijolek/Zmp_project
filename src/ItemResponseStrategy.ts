// src/utils/ItemResponseStrategy.ts

export interface Item {
    id: number;
    name: string;
}

export interface ItemResponseStrategy {
    /** Czy ta strategia obsłuży podany response? */
    supports(response: any): boolean;
    /** Mappuje response na tablicę Item */
    map(response: any): Item[];
}

export class ArrayStrategy implements ItemResponseStrategy {
    supports(response: any): boolean {
        return Array.isArray(response);
    }
    map(response: any): Item[] {
        return (response as any[]).map(i => ({
            id: i.ID,
            name: i.Name,
        }));
    }
}

export class ObjectArrayStrategy implements ItemResponseStrategy {
    supports(response: any): boolean {
        return response?.array && Array.isArray(response.array);
    }
    map(response: any): Item[] {
        return (response.array as any[]).map(i => ({
            id: i.ID,
            name: i.Name,
        }));
    }
}

export class FallbackStrategy implements ItemResponseStrategy {
    supports(_response: any): boolean {
        return true; // domyślnie wszystko, gdy inne nie pasują
    }
    map(response: any): Item[] {
        console.warn("Nieznany format odpowiedzi:", response);
        return [];
    }
}

export class StrategyFactory {
    private static strategies: ItemResponseStrategy[] = [
        new ObjectArrayStrategy(),
        new ArrayStrategy(),
        new FallbackStrategy(),
    ];

    /** Zwraca pierwszą strategię, która obsłuży dany response */
    static getStrategy(response: any): ItemResponseStrategy {
        return this.strategies.find(s => s.supports(response))!;
    }
}
