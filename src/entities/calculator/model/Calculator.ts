import { Lexer } from './lexer/Lexer';
import {
    CommandLexerStrategy,
    EOFLexerStrategy,
    NumberLexerStrategy,
    OperatorLexerStrategy,
    ParensLexerStrategy,
    WhitespaceLexerStrategy,
} from './lexer/LexerStrategies';
import { ILexerStrategy } from './lexer/model';
import { Command, COMMANDS_REGEX } from './token/commands';
import { Operation, OPERATIONS_REGEX } from './token/operations/operations';
import { IParserStrategy } from './parser/model';
import { Parser } from './parser/Parser';
import { RawCommandParserStrategy, RawOperationParserStrategy } from './parser/ParserStrategies';
import { InfixRPNConverter } from './rpn/converter/InfixRPNConverter';
import {
    CommandConverterStrategy,
    LParenConverterStrategy,
    NumberConverterStrategy,
    OperationConverterStrategy,
    RParenConverterStrategy,
} from './rpn/converter/InfixRPNConverterStrategies';
import { IInfixRPNConverterStrategy } from './rpn/converter/model';
import { RPNCalculator } from './rpn/calculator/RPNCalculator';
import { TokenType, TParsedToken, TRawToken, TRPNToken } from './token/token';
import { Validator } from './validation/Validator';

// todo parse commands and operation regex from constants themselves
const OPERATIONS = [
    Operation.Add,
    Operation.Subtract,
    Operation.Multiply,
    Operation.Divide,
    Operation.Power,
    Operation.UnarySubtract,
    Operation.UnaryAdd,
];

const COMMANDS = [
    Command.Sin,
    Command.Cos,
    Command.Tan,
    Command.Log,
    Command.Ln,
    Command.Sqrt,
    Command.Exp,
    Command.Fact,
];

const LEXER_STRATEGIES = [
    new WhitespaceLexerStrategy(),
    new NumberLexerStrategy(),
    new ParensLexerStrategy(),
    new OperatorLexerStrategy(OPERATIONS_REGEX),
    new CommandLexerStrategy(COMMANDS_REGEX),
    new EOFLexerStrategy(),
];

const PARSER_STRATEGIES = [
    new RawOperationParserStrategy(OPERATIONS),
    new RawCommandParserStrategy(COMMANDS),
];

const INFIX_RPN_CONVERTER_STRATEGIES = [
    new NumberConverterStrategy(),
    new LParenConverterStrategy(),
    new RParenConverterStrategy(),
    new OperationConverterStrategy(),
    new CommandConverterStrategy(),
];

export class Calculator {
    private validator: Validator;
    private parser: Parser;

    constructor(
        private lexerStrategies: ILexerStrategy[] = LEXER_STRATEGIES,
        private parserStrategies: IParserStrategy[] = PARSER_STRATEGIES,
        private converterStrategies: IInfixRPNConverterStrategy[] = INFIX_RPN_CONVERTER_STRATEGIES,
    ) {
        this.parser = new Parser(this.parserStrategies);
        this.validator = new Validator();
    }

    calculate(expression: string): number {
        const validated = this.validate(expression);
        const tokenized = this.tokenize(validated);
        const parsed = this.parse(tokenized);
        const rpnConverted = this.convertInfixToRPN(parsed);

        return this.calculateRPN(rpnConverted);
    }

    private validate(expression: string) {
        this.validator.checkString(expression);
        this.validator.checkEmptyString(expression);
        this.validator.checkParentheses(expression);

        return expression;
    }

    private parse(tokenized: TRawToken[]) {
        return this.parser.parse(tokenized);
    }

    private tokenize(expression: string): TRawToken[] {
        const tokenized: TRawToken[] = [];
        const lexer = new Lexer(expression, this.lexerStrategies);

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
        const converter = new InfixRPNConverter(expression, this.converterStrategies);

        return converter.convert();
    }

    private calculateRPN(expression: TRPNToken[]) {
        const calculator = new RPNCalculator(expression);

        return calculator.calculate();
    }
}
