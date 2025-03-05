import { TokenAccumulator } from '@Calculator/components/Tokenizer/TokenAccumulator';

describe('TokenAccumulator', () => {
  let accumulator: TokenAccumulator;

  beforeEach(() => {
    accumulator = new TokenAccumulator();
  });

  describe('add', () => {
    it('should add a chunk to the accumulator', () => {
      accumulator.add('test');

      expect(accumulator.collect()).toBe('test');
    });

    it('should add multiple chunks in sequence', () => {
      accumulator.add('hello');
      accumulator.add(' ');
      accumulator.add('world');

      expect(accumulator.collect()).toBe('hello world');
    });

    it('should handle empty strings', () => {
      accumulator.add('');

      expect(accumulator.collect()).toBe('');
    });

    it('should handle numeric values converted to strings', () => {
      accumulator.add('42');

      expect(accumulator.collect()).toBe('42');
    });

    it('should handle special characters', () => {
      accumulator.add('@#$%^&*()');

      expect(accumulator.collect()).toBe('@#$%^&*()');
    });
  });

  describe('collect', () => {
    it('should join all accumulated chunks and return the result', () => {
      accumulator.add('part1');
      accumulator.add('part2');
      accumulator.add('part3');

      expect(accumulator.collect()).toBe('part1part2part3');
    });

    it('should reset the accumulator after collecting', () => {
      accumulator.add('first');
      accumulator.collect();

      accumulator.add('second');
      expect(accumulator.collect()).toBe('second');
    });

    it('should return an empty string if nothing was added', () => {
      expect(accumulator.collect()).toBe('');
    });

    it('should handle collect called multiple times without adding', () => {
      accumulator.add('test');
      expect(accumulator.collect()).toBe('test');
      expect(accumulator.collect()).toBe('');
      expect(accumulator.collect()).toBe('');
    });
  });

  describe('collectTo', () => {
    it('should collect accumulated chunks and push to target array', () => {
      const target: string[] = [];

      accumulator.add('token');
      accumulator.collectTo(target);

      expect(target).toEqual(['token']);
    });

    it('should not push to target if accumulated string is empty', () => {
      const target: string[] = [];

      accumulator.collectTo(target);

      expect(target).toEqual([]);
    });

    it('should handle multiple collectTo calls with same target', () => {
      const target: string[] = [];

      accumulator.add('first');
      accumulator.collectTo(target);

      accumulator.add('second');
      accumulator.collectTo(target);

      expect(target).toEqual(['first', 'second']);
    });

    it('should work with pre-populated targets', () => {
      const target = ['existing'];

      accumulator.add('new');
      accumulator.collectTo(target);

      expect(target).toEqual(['existing', 'new']);
    });

    it('should reset accumulator after collecting to target', () => {
      const target: string[] = [];

      accumulator.add('token1');
      accumulator.collectTo(target);

      accumulator.add('token2');
      accumulator.collectTo(target);

      expect(target).toEqual(['token1', 'token2']);
    });

    it('should not modify target if nothing to collect', () => {
      const target = ['original'];

      accumulator.collectTo(target);

      expect(target).toEqual(['original']);
    });
  });

  describe('integration tests', () => {
    it('should handle a sequence of operations correctly', () => {
      const targetArray: string[] = [];

      accumulator.add('2');
      accumulator.add('5');
      accumulator.collectTo(targetArray);

      accumulator.add('+');
      accumulator.collectTo(targetArray);

      accumulator.add('3');
      accumulator.collectTo(targetArray);

      expect(targetArray).toEqual(['25', '+', '3']);
    });

    it('should handle mixed collect and collectTo operations', () => {
      const targetArray: string[] = [];

      accumulator.add('first');
      const collected = accumulator.collect();

      accumulator.add('second');
      accumulator.collectTo(targetArray);

      expect(collected).toBe('first');
      expect(targetArray).toEqual(['second']);
    });

    it('should simulate tokenizing a math expression', () => {
      const tokens = [];
      const expression = "3.14 + (2 * sin(45))";

      for (let i = 0; i < expression.length; i++) {
        const char = expression[i];

        if (char === ' ') {
          accumulator.collectTo(tokens);
          continue;
        }

        if ('+-*/()'.includes(char)) {
          accumulator.collectTo(tokens);
          tokens.push(char);
          continue;
        }

        accumulator.add(char);
      }

      accumulator.collectTo(tokens);

      expect(tokens).toEqual(['3.14', '+', '(', '2', '*', 'sin', '(', '45', ')', ')']);
    });
  });

  describe('edge cases', () => {
    it('should handle adding undefined or null (treats them as strings)', () => {
      accumulator.add(undefined as unknown as string);
      expect(accumulator.collect()).toBe('undefined');

      accumulator.add(null as unknown as string);
      expect(accumulator.collect()).toBe('null');
    });

    it('should handle non-string inputs by converting to string', () => {
      accumulator.add(42 as unknown as string);
      expect(accumulator.collect()).toBe('42');

      accumulator.add({} as unknown as string);
      expect(accumulator.collect()).toBe('[object Object]');
    });

    it('should handle very large accumulations', () => {
      for (let i = 0; i < 1000; i++) {
        accumulator.add('a');
      }

      expect(accumulator.collect().length).toBe(1000);
    });

    it('should work with empty target arrays', () => {
      const target: string[] = [];

      accumulator.add('test');
      accumulator.collectTo(target);

      expect(target).toEqual(['test']);
    });
  });
});
