import { InvalidSymbolError } from '../errors';
import { IAbstractToken } from '../token';
import { ILexerStrategy } from './model';

export class Lexer<Token extends IAbstractToken> {
    private position = 0;

    constructor(
        private readonly input: string,
        private readonly rules: readonly ILexerStrategy[],
    ) {
    }

    getNextToken(): Token {
        for (const rule of this.rules) {
            const lexeme = rule.match(this.input, this.position);

            if (lexeme === null) {
                continue;
            }

            const token = rule.create(lexeme, this.position);
            this.position += lexeme.length;

            // @ts-expect-error todo i dont know how to handle this AbstractToken vs LexerToken
            return token;
        }

        throw new InvalidSymbolError(this.input[this.position], this.position);
    }
}
