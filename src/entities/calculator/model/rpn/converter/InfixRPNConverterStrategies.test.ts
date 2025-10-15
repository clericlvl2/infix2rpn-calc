import { Stack } from '@shared/lib/Stack';
import { beforeEach, describe, expect, it } from 'vitest';
import { Command, ICommand } from '../../token/commands';
import { IOperation } from '../../token/operations/model';
import { Operation } from '../../token/operations/operations';
import {
    ICommandToken,
    ILParenToken,
    INumberToken,
    IOperationToken,
    IRParenToken,
    TokenType,
    TRPNToken,
    TStackToken,
} from '../../token/token';
import {
    CommandConverterStrategy,
    LParenConverterStrategy,
    NumberConverterStrategy,
    OperationConverterStrategy,
    RParenConverterStrategy,
} from './InfixRPNConverterStrategies';

describe('InfixRPNConverterStrategies', () => {
    const POS = 1;

    const num = (v: string, pos: number = 0): INumberToken => ({ value: v, type: TokenType.Number, position: pos });
    const op = (o: IOperation): IOperationToken => ({ value: o, type: TokenType.Operation, position: POS });
    const lparen = (): ILParenToken => ({ value: '(', type: TokenType.LParen, position: POS });
    const rparen = (): IRParenToken => ({ value: ')', type: TokenType.RParen, position: POS });
    const com = (c: ICommand): ICommandToken => ({ value: c, type: TokenType.Command, position: POS });

    describe('NumberConverterStrategy', () => {
        let strategy: NumberConverterStrategy;
        let stack: Stack<TStackToken>;
        let notation: TRPNToken[];

        beforeEach(() => {
            strategy = new NumberConverterStrategy();
            stack = new Stack<TStackToken>();
            notation = [];
        });

        it('matches number tokens', () => {
            const token = num('5');
            expect(strategy.match(token)).toBe(true);
        });

        it('does not match non-number tokens', () => {
            const token = op(Operation.Add);
            expect(strategy.match(token as never)).toBe(false);
        });

        it('processes number tokens by adding them to notation', () => {
            const token = num('5');
            strategy.process(token, stack, notation);
            expect(notation).toEqual([token]);
        });
    });

    describe('OperationConverterStrategy', () => {
        let strategy: OperationConverterStrategy;
        let stack: Stack<TStackToken>;
        let notation: TRPNToken[];

        beforeEach(() => {
            strategy = new OperationConverterStrategy();
            stack = new Stack<TStackToken>();
            notation = [];
        });

        it('matches operation tokens', () => {
            const token = op(Operation.Add);
            expect(strategy.match(token)).toBe(true);
        });

        it('does not match non-operation tokens', () => {
            const token = num('5');
            expect(strategy.match(token)).toBe(false);
        });

        it('processes operation with higher precedence on stack by popping to notation', () => {
            const stackToken: TStackToken = op(Operation.Multiply);
            stack.add(stackToken);

            const token = op(Operation.Add);

            strategy.process(token, stack, notation);

            expect(notation).toEqual([stackToken]);
            expect(stack.readTop()).toEqual(token);
        });

        it('processes operation with equal precedence and left associativity by popping to notation', () => {
            const stackToken: TStackToken = op(Operation.Subtract);
            stack.add(stackToken);

            const token = op(Operation.Add);

            strategy.process(token, stack, notation);

            expect(notation).toEqual([stackToken]);
            expect(stack.readTop()).toEqual(token);
        });

        it('processes operation with equal precedence and right associativity by keeping on stack', () => {
            const stackToken: TStackToken = op(Operation.Power);
            stack.add(stackToken);

            const token = op(Operation.Power);

            strategy.process(token, stack, notation);

            expect(notation).toEqual([]);
            expect(stack.toArray()).toEqual([stackToken, token]);
        });

        it('processes operation with lower precedence by keeping on stack', () => {
            const stackToken: TStackToken = op(Operation.Add);
            stack.add(stackToken);

            const token = op(Operation.Multiply);

            strategy.process(token, stack, notation);

            expect(notation).toEqual([]);
            expect(stack.toArray()).toEqual([stackToken, token]);
        });

        it('processes operation with empty stack by adding to stack', () => {
            const token = op(Operation.Add);
            strategy.process(token, stack, notation);
            expect(notation).toEqual([]);
            expect(stack.readTop()).toEqual(token);
        });

        it('processes operation with command on stack by popping command to notation', () => {
            const stackToken: TStackToken = com(Command.Sin);
            stack.add(stackToken);

            const token = op(Operation.Add);

            strategy.process(token, stack, notation);

            expect(notation).toEqual([stackToken]);
            expect(stack.readTop()).toEqual(token);
        });
    });

    describe('LParenConverterStrategy', () => {
        let strategy: LParenConverterStrategy;
        let stack: Stack<TStackToken>;
        let notation: TRPNToken[];

        beforeEach(() => {
            strategy = new LParenConverterStrategy();
            stack = new Stack<TStackToken>();
            notation = [];
        });

        it('matches left paren tokens', () => {
            const token = lparen();
            expect(strategy.match(token)).toBe(true);
        });

        it('does not match non-left paren tokens', () => {
            const token = num('5');
            expect(strategy.match(token)).toBe(false);
        });

        it('processes left paren tokens by adding them to stack', () => {
            const token = lparen();
            strategy.process(token, stack);
            expect(notation).toEqual([]);
            expect(stack.readTop()).toEqual(token);
        });
    });

    describe('RParenConverterStrategy', () => {
        let strategy: RParenConverterStrategy;
        let stack: Stack<TStackToken>;
        let notation: TRPNToken[];

        beforeEach(() => {
            strategy = new RParenConverterStrategy();
            stack = new Stack<TStackToken>();
            notation = [];
        });

        it('matches right paren tokens', () => {
            const token = rparen();
            expect(strategy.match(token)).toBe(true);
        });

        it('does not match non-right paren tokens', () => {
            const token = num('5');
            expect(strategy.match(token)).toBe(false);
        });

        it('processes right paren by popping operators to notation until left paren', () => {
            const lParenToken: TStackToken = lparen();
            const addToken: TStackToken = op(Operation.Add);
            const mulToken: TStackToken = op(Operation.Multiply);

            stack.add(lParenToken);
            stack.add(addToken);
            stack.add(mulToken);

            const token = rparen();
            strategy.process(token, stack, notation);

            expect(notation).toEqual([mulToken, addToken]);
            expect(stack.readTop()).toBeNull();
        });

        it('processes right paren with no matching left paren by popping all operators', () => {
            const addToken: TStackToken = op(Operation.Add);
            const mulToken: TStackToken = op(Operation.Multiply);

            stack.add(addToken);
            stack.add(mulToken);

            const token = rparen();
            strategy.process(token, stack, notation);

            expect(notation).toEqual([mulToken, addToken]);
            expect(stack.readTop()).toBeNull();
        });
    });

    describe('CommandConverterStrategy', () => {
        let strategy: CommandConverterStrategy;
        let stack: Stack<TStackToken>;
        let notation: TRPNToken[];

        beforeEach(() => {
            strategy = new CommandConverterStrategy();
            stack = new Stack<TStackToken>();
            notation = [];
        });

        it('matches command tokens', () => {
            const token = com(Command.Sin);
            expect(strategy.match(token)).toBe(true);
        });

        it('does not match non-command tokens', () => {
            const token = num('5');
            expect(strategy.match(token)).toBe(false);
        });

        it('processes command tokens by adding them to stack', () => {
            const token = com(Command.Cos);
            strategy.process(token, stack);
            expect(notation).toEqual([]);
            expect(stack.readTop()).toEqual(token);
        });
    });
});
