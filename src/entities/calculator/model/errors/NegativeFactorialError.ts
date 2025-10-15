export class NegativeFactorialError extends Error {
    constructor(value: number) {
        super(`Factorial of negative number: ${value}`);
        this.name = 'NegativeFactorialError';
    }
}
