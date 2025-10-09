export class InvalidDataTypeError extends Error {
    constructor() {
        super(`Unexpected data type passed as expression, string required`);
        this.name = 'InvalidDataTypeError';
    }
}
