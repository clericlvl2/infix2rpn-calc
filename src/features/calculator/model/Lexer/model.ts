import { IAbstractToken } from '../token';

export interface ILexerStrategy {
    match(input: string, position: number): string | null;
    create(lexeme: string, position: number): IAbstractToken;
}
