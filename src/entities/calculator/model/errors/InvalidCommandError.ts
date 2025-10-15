export class InvalidCommandError extends Error {
    constructor(symbol: string, position: number) {
        super(`Unexpected function ${symbol} at position ${position}`);
        this.name = 'InvalidDataTypeError';
    }
}
