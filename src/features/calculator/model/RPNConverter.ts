import { IOperation } from '@shared/lib/math';
import { Stack } from '@shared/lib/Stack';
import { isExist } from '@shared/model/validation';
import { ILParenToken, INumberToken, IOperationToken, TokenType, TParsedToken, TRPNToken } from './token';

export class RPNConverter {
    private operationsStack = new Stack<IOperationToken | ILParenToken>();
    private notation: TRPNToken[] = [];
    private tokenProcessor = {
        [TokenType.Number]: this.processNumberToken.bind(this),
        [TokenType.Operation]: this.processOperationToken.bind(this),
        [TokenType.LParen]: this.processLParenToken.bind(this),
        [TokenType.RParen]: this.processRParenToken.bind(this),
    };

    convert(tokenizedExpression: TParsedToken[]): TRPNToken[] {
        const converted = this.getConvertedExpression(tokenizedExpression);

        this.reset();

        return converted;
    }

    reset(): void {
        this.notation = [];
        this.operationsStack.clear();
    }

    private getConvertedExpression(tokenizedExpression: TParsedToken[]): TRPNToken[] {
        // @ts-expect-error todo i dont know how to deal with maps and corresponding loops...
        tokenizedExpression.forEach(token => this.tokenProcessor[token.type]?.(token));
        this.operationsStack.popAllTo(this.notation);

        return this.notation;
    }

    private processNumberToken(nToken: INumberToken): void {
        this.notation.push(nToken);
    }

    private processOperationToken(oToken: IOperationToken): void {
        const topStackItem = this.operationsStack.readTop();
        const topStackItemPrecedence = this.getStackItemPrecedence(topStackItem);

        if (isExist(topStackItem) && (oToken.value as IOperation).precedence <= topStackItemPrecedence) {
            this.operationsStack.popTopTo(this.notation);
        }

        this.operationsStack.push(oToken);
    }

    private processLParenToken(pToken: ILParenToken): void {
        this.operationsStack.push(pToken);
    }

    private processRParenToken(): void {
        let token = this.operationsStack.pop();

        while (token && token.type !== TokenType.LParen) {
            this.notation.push(token);
            token = this.operationsStack.pop();
        }
    }

    private getStackItemPrecedence(token: TParsedToken | undefined): number {
        return isExist(token) && token.type === TokenType.Operation
            ? (token.value as IOperation).precedence
            : 0;
    }
}
