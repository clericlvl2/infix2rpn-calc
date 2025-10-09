import { DECIMAL_NUMBER_REGEX } from '@shared/model/validation';

const MAX_TOTAL_DIGITS = 15;
const MAX_BEFORE_DECIMAL = 12;
const MAX_AFTER_DECIMAL = 8;
const MAX_VALUE = 1e12;

function validateNumber(input: string) {
    // Basic numeric format check
    if (DECIMAL_NUMBER_REGEX.test(input)) {
        throw new Error('Invalid number format');
    }

    const [intPart, fracPart = ''] = input.split('.');

    if (intPart.replace('-', '').length > MAX_BEFORE_DECIMAL) {
        throw new Error(`Too many digits before decimal (max ${MAX_BEFORE_DECIMAL})`);
    }

    if (fracPart.length > MAX_AFTER_DECIMAL) {
        throw new Error(`Too many digits after decimal (max ${MAX_AFTER_DECIMAL})`);
    }

    if (intPart.replace('-', '').length + fracPart.length > MAX_TOTAL_DIGITS) {
        throw new Error(`Number too long (max ${MAX_TOTAL_DIGITS} digits total)`);
    }

    const numeric = Number(input);
    if (Math.abs(numeric) > MAX_VALUE) {
        throw new Error(`Number too big (max ±${MAX_VALUE})`);
    }
}
