import { IOperation } from '@shared/lib/math';
import { Stack } from '@shared/lib/Stack';
import { isExist } from '@shared/model/validation';
import { ILParenToken, INumberToken, IOperationToken, TokenType, TParsedToken, TRPNToken } from './token';

export class InfixRPNConverter {
    private operationsStack = new Stack<IOperationToken | ILParenToken>();
    private notation: TRPNToken[] = [];
    private tokenProcessor = {
        [TokenType.Number]: this.processNumberToken.bind(this),
        [TokenType.Operation]: this.processOperationToken.bind(this),
        [TokenType.LParen]: this.processLParenToken.bind(this),
        [TokenType.RParen]: this.processRParenToken.bind(this),
    };

    constructor(private readonly input: TParsedToken[]) {}

    convert(): TRPNToken[] {
        // @ts-expect-error todo i dont know how to deal with maps and corresponding loops...
        this.input.forEach(token => this.tokenProcessor[token.type]?.(token));
        this.operationsStack.popAllTo(this.notation);

        return this.notation;
    }

    private processNumberToken(nToken: INumberToken): void {
        this.notation.push(nToken);
    }

    private processOperationToken(oToken: IOperationToken): void {
        const topStackItem = this.operationsStack.readTop();

        if (isExist(topStackItem) && oToken.value.precedence <= this.getTokenPrecedence(topStackItem)) {
            this.operationsStack.popTopTo(this.notation);
        }

        this.operationsStack.add(oToken);
    }

    private processLParenToken(pToken: ILParenToken): void {
        this.operationsStack.add(pToken);
    }

    private processRParenToken(): void {
        let token = this.operationsStack.pop();

        while (token && token.type !== TokenType.LParen) {
            this.notation.push(token);
            token = this.operationsStack.pop();
        }
    }

    private getTokenPrecedence(token: TParsedToken): number {
        return isExist(token) && token.type === TokenType.Operation
            ? (token.value as IOperation).precedence
            : 0;
    }
}
