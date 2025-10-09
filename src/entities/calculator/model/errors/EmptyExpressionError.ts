export class EmptyExpressionError extends Error {
    constructor() {
        super('Empty expression passed');
        this.name = 'EmptyExpressionError';
    }
}
