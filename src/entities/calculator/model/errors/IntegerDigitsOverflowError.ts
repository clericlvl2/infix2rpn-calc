export class IntegerDigitsOverflowError extends Error {
    constructor(maxDigits: number) {
        super(`Too many digits before decimal (max ${maxDigits})`);
        this.name = 'TooManyDigitsBeforeDecimalError';
    }
}
