
import { ICommand } from "./ICommand";
import { modifyStock } from "../../api/api";

export class ModifyStockCommand implements ICommand {
    constructor(
        private token: string,
        private id: number,
        private data: { productId?: number; amount?: number; location?: string }
    ) {}
    async execute() {
        return await modifyStock(this.token, this.id, this.data);
    }
}
