import { isEmptyString } from '@lib/validation';

export class TokenBuffer {
  private accumulator: string[] = [];

  public add(chunk: string) {
    this.accumulator.push(String(chunk));
  }

  public collect(): string {
    return this.accumulator.join('');
  }

  public size() {
    return this.accumulator.length;
  }

  public clear() {
    this.accumulator = [];
  }
}
