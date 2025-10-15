import { PARENTHESES_REGEX, WHITESPACE_REGEX } from '@shared/lib/validation';
import { InvalidSymbolError } from '../errors';
import { isLeftParen, isRightParen, TParen } from '../token/parentheses';
import {
    EOF_VALUE,
    IEOFToken,
    ILParenToken,
    INumberToken,
    IRawCommandToken,
    IRawOperationToken,
    IRParenToken,
    IWhitespaceToken,
    TLexerToken,
    TokenType,
} from '../token/token';
import { createToken } from '../token/utils';
import { DECIMAL_NUMBER_REGEX } from '../token/number';
import { ILexerStrategy } from './model';

export const REGEX_MATCH_VALUE_INDEX = 0;

abstract class LexerStrategy implements ILexerStrategy {
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

    abstract create(lexeme: string, position: number): TLexerToken;
}

export class WhitespaceLexerStrategy extends LexerStrategy {
    constructor(pattern: RegExp = WHITESPACE_REGEX) {
        super(pattern);
    }

    create(value: string, position: number): IWhitespaceToken {
        return createToken<IWhitespaceToken>({
            value: value,
            type: TokenType.Whitespace,
            position,
            skippable: true,
        });
    }
}

export class EOFLexerStrategy extends LexerStrategy {
    constructor(pattern: RegExp = new RegExp(EOF_VALUE)) {
        super(pattern);
    }

    match(input: string, position: number): string | null {
        return position >= input.length ? EOF_VALUE : null;
    }

    create(_: string, position: number): IEOFToken {
        return createToken<IEOFToken>({
            value: EOF_VALUE,
            type: TokenType.EOF,
            position,
        });
    }
}

export class NumberLexerStrategy extends LexerStrategy {
    constructor(pattern: RegExp = DECIMAL_NUMBER_REGEX) {
        super(pattern);
    }

    create(value: string, position: number): INumberToken {
        return createToken<INumberToken>({
            value: value,
            type: TokenType.Number,
            position,
        });
    }
}

export class ParensLexerStrategy extends LexerStrategy {
    constructor(pattern: RegExp = PARENTHESES_REGEX) {
        super(pattern);
    }

    create(value: TParen, position: number): ILParenToken | IRParenToken {
        if (isLeftParen(value)) {
            return createToken<ILParenToken>({ value, position, type: TokenType.LParen });
        }

        if (isRightParen(value)) {
            return createToken<IRParenToken>({ value, position, type: TokenType.RParen });
        }

        throw new InvalidSymbolError(value, position);
    }
}

export class OperatorLexerStrategy extends LexerStrategy {
    constructor(pattern: RegExp) {
        super(pattern);
    }

    create(value: string, position: number): IRawOperationToken {
        return createToken<IRawOperationToken>({
            value: value,
            type: TokenType.RawOperation,
            position,
        });
    }
}

export class CommandLexerStrategy extends LexerStrategy {
    constructor(pattern: RegExp) {
        super(pattern);
    }

    create(value: string, position: number): IRawCommandToken {
        return createToken<IRawCommandToken>({
            value: value,
            type: TokenType.RawCommand,
            position,
        });
    }
}
