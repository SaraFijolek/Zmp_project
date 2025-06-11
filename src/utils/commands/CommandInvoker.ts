
import { ICommand } from "./ICommand";

export class CommandInvoker {
    async run(command: ICommand) {
        return await command.execute();
    }
}
