import type { IOperation } from '@shared/lib/math';
import { filterWhitespaces, OPERATIONS_REGEX } from '@shared/model/validation';
import { Operation } from './config/operations';
import { Lexer } from './model/Lexer/Lexer';
import { ILexerStrategy } from './model/Lexer/model';
import {
    EOFStrategy,
    NumberLexerStrategy,
    OperatorLexerStrategy,
    ParensLexerStrategy,
    WhitespaceStrategy,
} from './model/Lexer/strategies';
import { IParserStrategy } from './model/Parser/model';
import { Parser } from './model/Parser/Parser';
import { RawOperationParserStrategy } from './model/Parser/strategies';
import { RPNCalculator } from './model/RPNCalculator';
import { RPNConverter } from './model/RPNConverter';
import { TLexerToken, TokenType, TRawToken } from './model/token';
import { Validator } from './model/Validator';

const OPERATIONS = [
    Operation.Plus,
    Operation.Minus,
    Operation.Multiply,
    Operation.Divide,
    Operation.Power,
    Operation.UnaryMinus,
    Operation.UnaryPlus,
];

const LEXER_STRATEGIES = [
    new WhitespaceStrategy(),
    new NumberLexerStrategy(),
    new ParensLexerStrategy(),
    new OperatorLexerStrategy(OPERATIONS_REGEX),
    new EOFStrategy(),
];

const PARSER_STRATEGIES = [
    new RawOperationParserStrategy(OPERATIONS),
];

export class Calculator {
    private validator: Validator;
    private parser: Parser;
    private rpnConverter: RPNConverter;
    private rpnCalculator: RPNCalculator;

    constructor(
        private operations: IOperation[] = OPERATIONS,
        private lexerStrategies: ILexerStrategy[] = LEXER_STRATEGIES,
        private parserStrategies: IParserStrategy[] = PARSER_STRATEGIES,
    ) {
        this.parser = new Parser(this.parserStrategies);
        this.validator = new Validator(this.operations.map(op => op.symbol));
        this.rpnConverter = new RPNConverter();
        this.rpnCalculator = new RPNCalculator();
    }

    calculate(expression: string): number {
        this.resetRPN();

        this.validator.checkString(expression);
        const filtered = filterWhitespaces(expression);
        const validated = this.validateExpression(filtered);
        const tokenized = this.tokenizer(validated);
        const recognized = this.parser.parse(tokenized);
        const converted = this.rpnConverter.convert(recognized);

        return this.rpnCalculator.calculate(converted);
    }

    private resetRPN() {
        this.rpnConverter.reset();
        this.rpnCalculator.reset();
    }

    private validateExpression(expression: string) {
        this.validator.checkEmptyString(expression);
        this.validator.checkNotAllowedSymbols(expression);
        this.validator.checkParentheses(expression);

        return expression;
    }

    private tokenizer(expression: string): TRawToken[] {
        const tokenized: TRawToken[] = [];
        const lexer = new Lexer<TLexerToken>(expression, this.lexerStrategies);

        let token;

        while (true) {
            token = lexer.getNextToken();

            if (token.type === TokenType.EOF) {
                break;
            }

            if (token?.skippable) {
                continue;
            }

            tokenized.push(token);
        }

        return tokenized;
    }
}
