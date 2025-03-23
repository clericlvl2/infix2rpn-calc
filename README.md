# Calculator App

A simple, visually appealing calculator built using modern frontend technologies.
Calculation algorithm is based on [reverse polish notation](https://en.wikipedia.org/wiki/Shunting_yard_algorithm)

https://clericlvl2.github.io/rpn-calculator/

## Features
- Basic arithmetic operations: Addition, Subtraction, Multiplication, Division
- Clear button to reset calculations
- User-friendly interface with distinct color-coded buttons
- Responsive design for various screen sizes

## Technologies
- Preact
- Vite
- Typescript
- Jest
- Tailwind

## Installation
1. Clone the repository:
   ```sh
   git clone git@github.com:clericlvl2/rpn-calculator.git
   ```
2. Navigate to the project folder:
   ```sh
   cd calculator-app
   ```
3. Open `index.html` in a browser, or if using a framework, install dependencies:
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

## Plans

- Calculator features:
  - Add different associativity support (5!, for example)
  - Add multi-symbols named operators (sqrt, sin, etc.)
  - Track keyboard input with non-focused calculator input field
  - Refactor Tokenizator, add different token types
- UI:
  - Add visible informer about project, explain why it is cool
  - Add different operators sets (simple and engeneering)
  - Add theme picker
- Fix
  - Adjust input scroll behaviour on backspace
  - Restrict validation policy (1--1)
  - Fix parenthesys problem "()"
