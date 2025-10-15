import { TLexerToken } from '../token/token';

export interface ILexerStrategy {
    match(input: string, position: number): string | null;
    create(lexeme: string, position: number): TLexerToken;
}
