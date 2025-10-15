import { isExist } from './validation';

export class Stack<Item> {
    private stack: Item[];

    constructor(stack: Item[] = []) {
        this.stack = stack;
    }

    size(): number {
        return this.stack.length;
    }

    add(item: Item): void {
        this.stack.push(item);
    }

    pop(): Item | null {
        return this.stack.pop() ?? null;
    }

    clear() {
        this.stack = [];
    }

    readTop(): Item | null {
        return this.stack[this.size() - 1] ?? null;
    }

    toArray(): Item[] {
        return [...this.stack];
    }

    popTo(target: unknown[], count: number): void {
        const potentialStackSize = this.size() - count;
        const newStackSize = potentialStackSize < 0 ? 0 : potentialStackSize;

        while (this.size() > newStackSize) {
            const item = this.pop();

            if (isExist(item)) {
                target.push(item);
            }
        }
    }

    popTopTo(target: unknown[]): void {
        return this.popTo(target, 1);
    }

    popAllTo(target: unknown[]): void {
        return this.popTo(target, this.size());
    }
}
