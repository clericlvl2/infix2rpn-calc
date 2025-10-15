import { IAbstractToken, TokenType, TokenTypeMap } from './token';

export const createToken = <T extends IAbstractToken>(value: T): Readonly<T> => Object.freeze<T>({ ...value });
export const matchTokenByType = <T extends TokenType>(
    token: IAbstractToken,
    type: T,
): token is TokenTypeMap[T] => token.type === type;
