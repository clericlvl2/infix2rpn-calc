export class InvalidOperationError extends Error {
    constructor(operation: string, position: number) {
        super(`Invalid operation found: '${operation}' at position ${position}`);
        this.name = 'InvalidOperationError';
    }
}
