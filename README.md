# Calculator App

A simple calculator app built using modern frontend technologies and SOLID principles in mind.
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

- Calculator:
  - Add associativity support
  - Add suffix support
  - Add functions support (sqrt, sin, etc.)
  - Add variables support (pi, e, etc)
  - Add decimal numbers with comma support
  - Add scientific numbers support
  - Add smart errors
  - Add calculation cache
  - Add rpn notation hook, show notation on every input
  - Add key-pressing event listeners
- UI:
  - Add minimalistic and visually appealing look, possibly pixel-art
  - Add an informer explaining reverse polish notation
  - Add a visible field for showing current rpn notation
  - Add small 'about me' section
  - Add theme picker
- Fix
  - Fix input scroll behaviour on backspace, not intuitive
  - Fix parentheses problem "()", sensible input?
  - Fix max input length
  - Fix safe calculation threshold (isSafeNumber)
