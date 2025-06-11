// src/utils/commands/AddStockCommand.ts
import { ICommand } from "./ICommand";
import { addStock } from "../../api/api";

export class AddStockCommand implements ICommand {
    constructor(
        private token: string,
        private productId: number,
        private amount: number,
        private location: string
    ) {}
    async execute() {
        return await addStock(this.token, this.productId, this.amount, this.location);
    }
}
