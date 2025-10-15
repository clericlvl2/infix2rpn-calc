import { IAbstractToken, TParsedToken } from '../token/token';

export interface IParserStrategy {
    match(token: IAbstractToken): boolean;
    create(
        token: IAbstractToken,
        expression: IAbstractToken[],
        position: number,
    ): TParsedToken;
}
