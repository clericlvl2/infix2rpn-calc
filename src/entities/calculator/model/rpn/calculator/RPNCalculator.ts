import { Stack } from '@shared/lib/Stack';
import { isExist } from '@shared/lib/validation';
import { CalculationError } from '../../errors';
import { IAction, IArity } from '../../token/operations/model';
import { INumberToken, TokenType, TRPNToken } from '../../token/token';
import { validateNumber } from '../../token/number';

const PROCESSED_STACK_SIZE = 1;

export class RPNCalculator {
    private readonly stack = new Stack<number>();

    constructor(private readonly input: TRPNToken[]) {}

    calculate(): number {
        this.processInput();

        return this.getResult();
    }

    private processInput() {
        for (const token of this.input) {
            switch (token.type) {
                case TokenType.Number:
                    this.processNumberToken(token);
                    break;
                case TokenType.Operation:
                case TokenType.Command:
                    this.processActionToken(token);
                    break;
                default: throw new CalculationError();
            }
        }
    }

    private getResult(): number {
        if (this.stack.size() !== PROCESSED_STACK_SIZE) {
            throw new CalculationError();
        }

        const result = this.stack.pop();

        if (!isExist(result)) {
            throw new CalculationError();
        }

        return result;
    }

    private processNumberToken(token: INumberToken) {
        const nValue = parseFloat(token.value);

        validateNumber(nValue);

        this.stack.add(nValue);
    }

    private processActionToken({ value: { action, arity } }: {
        value: IArity & IAction;
    }) {
        const actionParameters: number[] = [];
        this.stack.popTo(actionParameters, arity);

        const actionResult = action(...actionParameters.reverse());

        validateNumber(actionResult);

        this.stack.add(actionResult);
    }
}
