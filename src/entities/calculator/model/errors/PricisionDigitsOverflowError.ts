export class PricisionDigitsOverflowError extends Error {
    constructor(maxDigits: number) {
        super(`Too many digits after decimal (max ${maxDigits})`);
        this.name = 'TooManyDigitsAfterDecimalError';
    }
}
