
import { ICommand } from "./ICommand";
import { listStock } from "../../api/api";

export class FetchStockCommand implements ICommand {
    constructor(private token: string) {}
    async execute() {
        return await listStock(this.token);
    }
}
