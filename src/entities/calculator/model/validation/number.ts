import { DECIMAL_NUMBER_REGEX } from '@shared/model/validation';
import {
    IntegerDigitsOverflowError,
    InvalidNumberFormatError,
    LargeNumberError,
    LongNumberError,
    PricisionDigitsOverflowError,
} from '../errors';

const MAX_TOTAL_DIGITS = 15;
const MAX_BEFORE_DECIMAL = 12;
const MAX_AFTER_DECIMAL = 8;
const MAX_VALUE = 1e15;

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
        throw new PricisionDigitsOverflowError(MAX_AFTER_DECIMAL);
    }

    if (intPart.length + fracPart.length > MAX_TOTAL_DIGITS) {
        throw new LongNumberError(MAX_TOTAL_DIGITS);
    }

    if (absNumber > MAX_VALUE) {
        throw new LargeNumberError(MAX_VALUE);
    }
};
