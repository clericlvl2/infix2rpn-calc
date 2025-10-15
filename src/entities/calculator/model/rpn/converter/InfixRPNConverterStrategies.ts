import { Stack } from '@shared/lib/Stack';
import { isExist } from '@shared/lib/validation';
import { AssociativityType } from '../../token/operations/model';
import {
    ICommandToken,
    ILParenToken,
    INumberToken,
    IOperationToken,
    IRParenToken,
    TokenType,
    TParsedToken,
    TRPNToken,
    TStackToken,
} from '../../token/token';
import { matchTokenByType } from '../../token/utils';
import { IInfixRPNConverterStrategy } from './model';

export class NumberConverterStrategy implements IInfixRPNConverterStrategy {
    match(token: TParsedToken): token is INumberToken {
        return matchTokenByType(token, TokenType.Number);
    }

    process(token: INumberToken, _: Stack<TStackToken>, notation: TRPNToken[]): void {
        notation.push(token);
    }
}

export class OperationConverterStrategy implements IInfixRPNConverterStrategy {
    private precedence(token: IOperationToken): number {
        return token.value.precedence;
    }

    private associativity(token: IOperationToken): AssociativityType {
        return token.value.associativity;
    }

    match(token: TParsedToken): token is IOperationToken {
        return matchTokenByType(token, TokenType.Operation);
    }

    process(token: IOperationToken, stack: Stack<TStackToken>, notation: TRPNToken[]): void {
        const stackTop = stack.readTop();

        if (
            (
                isExist(stackTop)
                && matchTokenByType(stackTop, TokenType.Command)
            )
            || (
                isExist(stackTop)
                && matchTokenByType(stackTop, TokenType.Operation)
                && (
                    this.precedence(stackTop) > this.precedence(token)
                    || (
                        this.precedence(stackTop) === this.precedence(token)
                        && this.associativity(token) === AssociativityType.Left
                    )
                )
            )
        ) {
            stack.popTopTo(notation);
        }

        stack.add(token);
    }
}

export class LParenConverterStrategy implements IInfixRPNConverterStrategy {
    match(token: TParsedToken): token is ILParenToken {
        return matchTokenByType(token, TokenType.LParen);
    }

    process(token: ILParenToken, stack: Stack<TStackToken>): void {
        stack.add(token);
    }
}

export class RParenConverterStrategy implements IInfixRPNConverterStrategy {
    match(token: TParsedToken): token is IRParenToken {
        return matchTokenByType(token, TokenType.RParen);
    }

    process(_: IRParenToken, stack: Stack<TStackToken>, notation: TRPNToken[]): void {
        let token = stack.pop();

        while (token && token.type !== TokenType.LParen) {
            notation.push(token);
            token = stack.pop();
        }
    }
}

export class CommandConverterStrategy implements IInfixRPNConverterStrategy {
    match(token: TParsedToken): token is ICommandToken {
        return matchTokenByType(token, TokenType.Command);
    }

    process(token: ICommandToken, stack: Stack<TStackToken>): void {
        stack.add(token);
    }
}
