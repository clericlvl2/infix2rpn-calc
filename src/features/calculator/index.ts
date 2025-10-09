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
import { InfixRPNConverter } from './model/InfixRPNConverter';
import { TLexerToken, TokenType, TParsedToken, TRawToken, TRPNToken } from './model/token';
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

    constructor(
        private operations: IOperation[] = OPERATIONS,
        private lexerStrategies: ILexerStrategy[] = LEXER_STRATEGIES,
        private parserStrategies: IParserStrategy[] = PARSER_STRATEGIES,
    ) {
        this.parser = new Parser(this.parserStrategies);
        this.validator = new Validator(this.operations.map(op => op.symbol));
    }

    calculate(expression: string): number {
        this.validator.checkString(expression);
        const filtered = filterWhitespaces(expression);
        const validated = this.validate(filtered);
        const tokenized = this.tokenize(validated);
        const parsed = this.parser.parse(tokenized);
        const converted = this.convertInfixToRPN(parsed);

        return this.calculateRPN(converted);
    }

    private validate(expression: string) {
        this.validator.checkEmptyString(expression);
        this.validator.checkNotAllowedSymbols(expression);
        this.validator.checkParentheses(expression);

        return expression;
    }

    private tokenize(expression: string): TRawToken[] {
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

    private convertInfixToRPN(expression: TParsedToken[]) {
        const converter = new InfixRPNConverter(expression);

        return converter.convert();
    }

    private calculateRPN(expression: TRPNToken[]) {
        const calculator = new RPNCalculator(expression);

        return calculator.calculate();
    }
}
