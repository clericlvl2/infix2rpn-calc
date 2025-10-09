export class UnmatchedParenthesesError extends Error {
    constructor() {
        super('Unmatched parentheses found');
        this.name = 'UnmatchedParenthesesError';
    }
}
