import { isExist } from '../utils';

export class Stack<Item> {
  private stack: Item[];

  constructor(stack: Item[] = []) {
    this.stack = stack;
  }

  public size(): number {
    return this.stack.length;
  }

  public push(item: Item): void {
    this.stack.push(item);
  }

  public pop(): Item | undefined {
    return this.stack.pop();
  }

  public readTop(): Item | undefined {
    return this.stack.at(-1);
  }

  public clear() {
    this.stack = [];
  }

  public popTo(target: unknown[], count: number): void {
    const potentialStackSize = this.size() - count;
    const newStackSize = potentialStackSize < 0 ? 0 : potentialStackSize;

    while (this.size() > newStackSize) {
      const item = this.pop();

      if (isExist(item)) {
        target.push(item);
      }
    }
  }

  public popTopTo(target: unknown[]): void {
    return this.popTo(target, 1);
  }

  public popAllTo(target: unknown[]): void {
    return this.popTo(target, this.size());
  }
}
