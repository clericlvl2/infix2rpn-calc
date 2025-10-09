export class InvalidSymbolError extends Error {
    constructor(symbol: string, position: number) {
        super(`Invalid symbol found: '${symbol}' at position ${position}`);
        this.name = 'InvalidSymbolError';
    }
}
