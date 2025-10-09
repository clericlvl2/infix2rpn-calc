import { filterWhitespaces } from '@shared/model/validation';
import { Lexer } from './lexer/Lexer';
import { ILexerStrategy } from './lexer/model';
import {
    EOFLexerStrategy,
    NumberLexerStrategy,
    OperatorLexerStrategy,
    ParensLexerStrategy,
    WhitespaceLexerStrategy,
} from './lexer/strategies';
import { Operation, OPERATIONS_REGEX } from './operations/constants';
import type { IOperation } from './operations/model';
import { IParserStrategy } from './parser/model';
import { Parser } from './parser/Parser';
import { RawOperationParserStrategy } from './parser/strategies';
import { InfixRPNConverter } from './rpn/InfixRPNConverter';
import { RPNCalculator } from './rpn/RPNCalculator';
import { TLexerToken, TokenType, TParsedToken, TRawToken, TRPNToken } from './token';
import { Validator } from './validation/Validator';

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
    new WhitespaceLexerStrategy(),
    new NumberLexerStrategy(),
    new ParensLexerStrategy(),
    new OperatorLexerStrategy(OPERATIONS_REGEX),
    new EOFLexerStrategy(),
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
