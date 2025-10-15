# Calculator App

A minimalistic calculator app built using modern frontend technologies and following SOLID principles.

https://clericlvl2.github.io/rpn-calculator/

## Algorithm

The calculation algorithm works in two steps:
1. Converting infix notation to reverse polish notation (RPN) using the [shunting yard algorithm](https://en.wikipedia.org/wiki/Shunting_yard_algorithm)
2. Calculating the RPN expression using a stack-based approach

For example, the infix expression `3 + 4 × 2`:
- Is converted to RPN: `3 4 2 * +`
- Is calculated by processing each token:
  - Push *3* → stack: *[3]*
  - Push *4* → stack: *[3, 4]*
  - Push *2* → stack: *[3, 4, 2]*
  - Apply **×** to *4* and *2* → stack: *[3, 8]*
  - Apply **+** to *3* and *8* → stack: *[11]*
- Result: *11*

## Features
- Basic arithmetic operations on decimal numbers
- Supported functions: sin, cos, tan, log, ln, sqrt, exp, fact
- Responsive design for various screen sizes

## Technologies
- Typescript
- Preact
- Vite
- Vitest
- Tailwind
- FSD

## Installation
1. Clone the repository:
   ```sh
   git clone git@github.com:clericlvl2/infix2rpn-calc.git
   ```
2. Navigate to the project folder:
   ```sh
   cd infix2rpn-calc
   ```
3. Install dependencies and start the development server:
   ```sh
   npm install
   npm run dev
   ```

## Usage
- Click on the numeric buttons to enter values.
- Use the operators (`+`, `-`, `*`, `/`) to perform calculations.
- Press `=` to get the result.
- Click `<` to remove last symbol
- Click `C` to clear the input and start fresh.

## Testing
Run the test suite with:
   ```sh
   npm run test
   ```

## Roadmap
- Calculator:
  - Add variables support (pi, e, etc)
  - Add scientific numbers support
  - Add calculation cache
  - Add calculation history
  - Add hooks on calculation stages
- UI:
  - Add key-pressing event listeners
  - Add functions buttons
  - Add rpn notation preview
  - Add rpn algorithm info
  - Add about section
  - Add theme picker