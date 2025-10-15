export class MaxDigitsOverflowError extends Error {
    constructor(maxDigits: number) {
        super(`Number too long (max ${maxDigits} digits total)`);
        this.name = 'NumberTooLongError';
    }
}
