export class InvalidNumberFormatError extends Error {
    constructor() {
        super('Invalid number format');
        this.name = 'InvalidNumberFormatError';
    }
}
