import { IAbstractToken } from '../token';
import { ILexerStrategy } from './model';

export const REGEX_MATCH_VALUE_INDEX = 0;

export abstract class LexerStrategy implements ILexerStrategy {
    protected constructor(private readonly pattern: RegExp) {
    }

    match(input: string, start: number): string | null {
        if (start > input.length || start < 0 || Number.isNaN(start)) {
            return null;
        }

        const substring = input.slice(start);
        const lexeme = substring.match(this.pattern)?.[REGEX_MATCH_VALUE_INDEX];

        return lexeme ?? null;
    }

    abstract create(lexeme: string, position: number): IAbstractToken;
}
