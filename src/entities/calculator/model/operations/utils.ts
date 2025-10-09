import { ArityType, IOperation, SuffixType } from './model';

export const createOperationKey = (
    symbol: string,
    arity: ArityType,
    suffix?: SuffixType,
) => `${symbol}${arity}${suffix ?? ''}`;

export const createOperation = (op: IOperation): Readonly<IOperation> => Object.freeze({ ...op });
