export class LargeNumberError extends Error {
    constructor(maxValue: number) {
        super(`Number too large (max ±${maxValue})`);
        this.name = 'NumberTooBigError';
    }
}
