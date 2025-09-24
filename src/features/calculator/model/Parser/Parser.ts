import { TParsedToken, TRawToken } from '../token';
import { IParserStrategy } from './model';

export class Parser {
    constructor(private readonly rules: IParserStrategy[]) {}

    parse(expression: TRawToken[]): TParsedToken[] {
        // @ts-expect-error todo do something
        return expression.map<TParsedToken>((token, position) => {
            for (const rule of this.rules) {
                const match = rule.match(token);

                if (match) {
                    return rule.create(token, expression, position);
                }
            }

            return token;
        });
    }
}
