import { TParsedToken, TRawToken } from '../token/token';
import { IParserStrategy } from './model';

export class Parser {
    constructor(private readonly rules: IParserStrategy[]) {}

    parse(expression: TRawToken[]): TParsedToken[] {
        // @ts-expect-error todo Parser must be generic to be type-safe
        return expression.map<TParsedToken>((token, position) => {
            for (const rule of this.rules) {
                if (rule.match(token)) {
                    return rule.create(token, expression, position);
                }
            }

            return token;
        });
    }
}
