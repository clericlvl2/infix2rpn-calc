export class DivisionByZeroError extends Error {
    constructor(dividend: number, divisor: number, position: number) {
        super(`Division by zero detected. Result is infinity: ${dividend}/${divisor} at position ${position}`);
        this.name = 'DivisionByZeroError';
    }
}
