import { Stack } from '@shared/lib/Stack';
import { CalculationError } from '../errors';
import { IOperation } from '../operations/model';
import { INumberToken, IOperationToken, TokenType, TRPNToken } from '../token';
import { validateNumber } from '../validation/number';

export class RPNCalculator {
    private stack = new Stack<number>();
    private tokenProcessor = {
        [TokenType.Number]: this.processNumberToken.bind(this),
        [TokenType.Operation]: this.processOperationToken.bind(this),
    };

    constructor(private input: TRPNToken[]) {}

    calculate(): number {
        // @ts-expect-error todo I don't know how to deal with maps and corresponding loops...
        this.input.forEach(token => this.tokenProcessor[token.type]?.(token));
        const result = this.stack.pop() as number;

        this.checkEmptyCalculationStack();

        return result;
    }

    private checkEmptyCalculationStack(): void {
        if (this.stack.size()) {
            throw new CalculationError();
        }
    }

    private processNumberToken(nToken: INumberToken) {
        const nValue = parseFloat(nToken.value);

        validateNumber(nValue);

        this.stack.add(nValue);
    }

    private processOperationToken(oToken: IOperationToken) {
        const actionParameters: number[] = [];
        const operation = oToken.value as IOperation;

        this.stack.popTo(actionParameters, operation.arity);

        const actionResult = operation.action(...actionParameters.reverse());

        validateNumber(actionResult);

        this.stack.add(actionResult);
    }
}
