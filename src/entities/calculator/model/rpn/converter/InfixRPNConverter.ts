import { Stack } from '@shared/lib/Stack';
import { TParsedToken, TRPNToken, TStackToken } from '../../token/token';
import { IInfixRPNConverterStrategy } from './model';

export class InfixRPNConverter {
    private readonly stack = new Stack<TStackToken>();
    private readonly notation: TRPNToken[] = [];

    constructor(
        private readonly input: TParsedToken[],
        private readonly rules: IInfixRPNConverterStrategy[],
    ) {}

    convert(): TRPNToken[] {
        for (const token of this.input) {
            for (const rule of this.rules) {
                if (rule.match(token)) {
                    rule.process(token, this.stack, this.notation);
                    break;
                }
            }
        }

        this.stack.popAllTo(this.notation);

        return this.notation;
    }
}
