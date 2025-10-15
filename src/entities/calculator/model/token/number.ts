import {
    IntegerDigitsOverflowError,
    InvalidNumberFormatError,
    TooLargeNumberError,
    MaxDigitsOverflowError,
    PrecisionDigitsOverflowError,
} from '../errors';

export const DECIMAL_NUMBER_REGEX = /^\d+(\.\d+)?/;
export const SCIENTIFIC_NUMBER_REGEX = /^\d+(\.\d+)?([eE][+-]?\d+)?/;
export const HEXADECIMAL_NUMBER_REGEX = /^0[xX][0-9a-fA-F]+$/;

export const MAX_TOTAL_DIGITS = 15;
export const MAX_BEFORE_DECIMAL = 12;
export const MAX_AFTER_DECIMAL = 8;
export const MAX_VALUE = 1e15;

export const validateNumber = (numericInput: number) => {
    const absNumber = Math.abs(numericInput);
    const strNumber = String(absNumber);

    if (!DECIMAL_NUMBER_REGEX.test(strNumber)) {
        throw new InvalidNumberFormatError();
    }

    const [intPart, fracPart = ''] = strNumber.split('.');

    if (intPart.length > MAX_BEFORE_DECIMAL) {
        throw new IntegerDigitsOverflowError(MAX_BEFORE_DECIMAL);
    }

    if (fracPart.length > MAX_AFTER_DECIMAL) {
        throw new PrecisionDigitsOverflowError(MAX_AFTER_DECIMAL);
    }

    if (intPart.length + fracPart.length > MAX_TOTAL_DIGITS) {
        throw new MaxDigitsOverflowError(MAX_TOTAL_DIGITS);
    }

    if (absNumber > MAX_VALUE) {
        throw new TooLargeNumberError(MAX_VALUE);
    }
};

export const toPrecision = (num: number) => parseFloat(num.toFixed(MAX_AFTER_DECIMAL));
