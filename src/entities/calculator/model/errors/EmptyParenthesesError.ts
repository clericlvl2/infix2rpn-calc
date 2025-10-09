export class EmptyParenthesesError extends Error {
    constructor() {
        super('Empty parentheses found');
        this.name = 'EmptyParenthesesError';
    }
}
