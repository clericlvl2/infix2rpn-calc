import { Stack } from '@shared/lib/Stack';
import { describe, expect, it } from 'vitest';

describe('Stack', () => {
    it('creates an empty stack when no initial array is provided', () => {
        const stack = new Stack();
        expect(stack.size()).toBe(0);
    });

    it('creates a stack with initial items', () => {
        const initialItems = [1, 2, 3];
        const stack = new Stack(initialItems);
        expect(stack.size()).toBe(3);
    });

    describe('size method', () => {
        it('returns correct size after operations', () => {
            const stack = new Stack<number>();
            expect(stack.size()).toBe(0);

            stack.add(1);
            expect(stack.size()).toBe(1);

            stack.add(2);
            expect(stack.size()).toBe(2);

            stack.pop();
            expect(stack.size()).toBe(1);
        });
    });

    describe('add method', () => {
        it('adds items to the stack', () => {
            const stack = new Stack<string>();
            stack.add('first');
            stack.add('second');

            expect(stack.size()).toBe(2);
        });

        it('works with different types', () => {
            const stack = new Stack<number | string | boolean>();
            stack.add(1);
            stack.add('two');
            stack.add(true);

            expect(stack.size()).toBe(3);
        });
    });

    describe('pop method', () => {
        it('removes and returns the last item', () => {
            const stack = new Stack<number>();
            stack.add(1);
            stack.add(2);

            const popped = stack.pop();
            expect(popped).toBe(2);
            expect(stack.size()).toBe(1);
        });

        it('returns null for an empty stack', () => {
            const stack = new Stack<number>();
            const popped = stack.pop();
            expect(popped).toBeNull();
        });
    });

    describe('readTop method', () => {
        it('returns the top item without removing it', () => {
            const stack = new Stack<number>();
            stack.add(1);
            stack.add(2);

            const top = stack.readTop();
            expect(top).toBe(2);
            expect(stack.size()).toBe(2);
        });

        it('returns null for an empty stack', () => {
            const stack = new Stack<number>();
            const top = stack.readTop();
            expect(top).toBeNull();
        });
    });

    describe('clear method', () => {
        it('removes all items from the stack', () => {
            const stack = new Stack<number>();
            stack.add(1);
            stack.add(2);

            stack.clear();
            expect(stack.size()).toBe(0);
            expect(stack.readTop()).toBeNull();
        });
    });

    describe('popTo method', () => {
        it('pops specified number of items to target array', () => {
            const stack = new Stack<number>([1, 2, 3, 4, 5]);
            const target: number[] = [];

            stack.popTo(target, 3);

            expect(target).toEqual([5, 4, 3]);
            expect(stack.size()).toBe(2);
        });

        it('handles popping more items than stack size', () => {
            const stack = new Stack<number>([1, 2]);
            const target: number[] = [];

            stack.popTo(target, 5);

            expect(target).toEqual([2, 1]);
            expect(stack.size()).toBe(0);
        });

        it('works with mixed type arrays', () => {
            const stack = new Stack<number | string>([1, 'two', 3]);
            const target: (number | string)[] = [];

            stack.popTo(target, 2);

            expect(target).toEqual([3, 'two']);
            expect(stack.size()).toBe(1);
        });
    });

    describe('popTopTo method', () => {
        it('pops the top item to target array', () => {
            const stack = new Stack<number>([1, 2, 3]);
            const target: number[] = [];

            stack.popTopTo(target);

            expect(target).toEqual([3]);
            expect(stack.size()).toBe(2);
        });

        it('handles empty stack', () => {
            const stack = new Stack<number>();
            const target: number[] = [];

            stack.popTopTo(target);

            expect(target).toEqual([]);
            expect(stack.size()).toBe(0);
        });
    });

    describe('popAllTo method', () => {
        it('pops all items to target array', () => {
            const stack = new Stack<number>([1, 2, 3]);
            const target: number[] = [];

            stack.popAllTo(target);

            expect(target).toEqual([3, 2, 1]);
            expect(stack.size()).toBe(0);
        });

        it('handles empty stack', () => {
            const stack = new Stack<number>();
            const target: number[] = [];

            stack.popAllTo(target);

            expect(target).toEqual([]);
            expect(stack.size()).toBe(0);
        });
    });

    it('supports multiple push and pop operations', () => {
        const stack = new Stack<number>();

        stack.add(1);
        stack.add(2);
        expect(stack.pop()).toBe(2);
        stack.add(3);
        expect(stack.size()).toBe(2);
    });

    it('works with complex objects', () => {
        interface TestObject {
            id: number;
            name: string;
        }

        const stack = new Stack<TestObject>();
        const obj1 = { id: 1, name: 'first' };
        const obj2 = { id: 2, name: 'second' };

        stack.add(obj1);
        stack.add(obj2);

        expect(stack.readTop()).toEqual(obj2);
        expect(stack.size()).toBe(2);
    });
});
