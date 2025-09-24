import { IAbstractToken } from '../token';

export interface IParserStrategy {
    match(token: IAbstractToken): IAbstractToken | null;
    create(
        token: IAbstractToken,
        tokenizedExpression: IAbstractToken[],
        position: number,
    ): IAbstractToken;
}
