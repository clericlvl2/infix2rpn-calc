import { TokenAccumulator } from '../common/components/TokenAccumulator';
import { isStrictStringifiedNumber as isNumberChunk } from '../common/utils';
import type { TTokenizedExpression } from './types';

export class Tokenizer {
  tokenizeExpression(expression: string): TTokenizedExpression {
    const tokenized: string[] = [];
    const numberTokenAccumulator = new TokenAccumulator();

    for (const chunk of expression) {
      if (isNumberChunk(chunk)) {
        numberTokenAccumulator.add(chunk);
      } else {
        numberTokenAccumulator.collectTo(tokenized);
        tokenized.push(chunk);
      }
    }

    numberTokenAccumulator.collectTo(tokenized);

    return tokenized;
  }
}
