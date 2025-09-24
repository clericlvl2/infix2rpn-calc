import {Arity, IOperation} from "@lib/math/operation/model";

export const createOperationId = (symbol: string, arity: Arity) => `${symbol}${arity}`;
export const createOperation = <S extends string>(op: IOperation<S>): Readonly<IOperation<S>> =>
  Object.freeze({ ...op });
