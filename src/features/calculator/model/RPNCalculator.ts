import { ErrorMessage } from '../config/errors';
import { IOperation } from '@shared/lib/math';
import { Stack } from '@shared/lib/Stack';
import { INumberToken, IOperationToken, TokenType, TRPNToken } from './token';

export class RPNCalculator {
    private stack = new Stack<number>();
    private tokenProcessor = {
        [TokenType.Number]: this.processNumberToken.bind(this),
        [TokenType.Operation]: this.processOperationToken.bind(this),
    };

    calculate(expression: TRPNToken[]): number {
        this.initExpressionCalc(expression);
        const result = this.stack.pop() as number;

        this.checkEmptyCalculationStack();

        return result;
    }

    reset() {
        this.stack.clear();
    }

    private initExpressionCalc(expression: TRPNToken[]): void {
        // @ts-expect-error todo I don't know how to deal with maps and corresponding loops...
        expression.forEach(token => this.tokenProcessor[token.type]?.(token));
    }

    private checkEmptyCalculationStack(): void {
        if (this.stack.size()) {
            throw new Error(ErrorMessage.CalculationError);
        }
    }

    private processNumberToken(nToken: INumberToken) {
        const nValue = parseFloat(nToken.value);

        this.stack.push(nValue);
    }

    private processOperationToken(oToken: IOperationToken) {
        const actionParameters: number[] = [];
        const operation = oToken.value as IOperation;

        this.stack.popTo(actionParameters, operation.arity);

        const actionResult = operation.action(...actionParameters.reverse());

        this.stack.push(actionResult);
    }
}
