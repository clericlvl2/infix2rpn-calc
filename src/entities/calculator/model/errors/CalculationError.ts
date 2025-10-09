export class CalculationError extends Error {
    constructor() {
        super('An unexpected error occurred during calculations');
        this.name = 'CalculationError';
    }
}
