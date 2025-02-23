import { isEmptyString } from '../utils';

export class TokenAccumulator {
  private accumulator: string[] = [];

  add(chunk: string) {
    this.accumulator.push(chunk);
  }

  collect(): string {
    return this.accumulator.join('');
  }

  flushTo(target: string[]) {
    const token = this.collect();

    if (!isEmptyString(token)) {
      target.push(token);
    }

    this.reset();
  }

  reset() {
    this.accumulator = [];
  }
}
