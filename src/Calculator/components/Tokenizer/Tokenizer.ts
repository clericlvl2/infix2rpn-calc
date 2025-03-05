import { isStrictStringifiedNumber as isNumberChunk } from '../../../shared/validation';
import type { TTokenizedExpression } from '../../types';
import { TokenAccumulator } from './TokenAccumulator';

export class Tokenizer {
  tokenizeExpression(expression: string): TTokenizedExpression {
    const tokenized: string[] = [];
    const numberTokenAccumulator = new TokenAccumulator();

    for (const chunk of expression) {
      if (this.isEmptyChunk(chunk)) {
        continue;
      }

      if (isNumberChunk(chunk)) {
        numberTokenAccumulator.add(chunk);
        continue;
      }

      numberTokenAccumulator.collectTo(tokenized);
      tokenized.push(chunk);
    }

    numberTokenAccumulator.collectTo(tokenized);

    return tokenized;
  }

  private isEmptyChunk(chunk: string) {
    return chunk.trim().length === 0;
  }
}
