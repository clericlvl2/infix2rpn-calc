# Calculator App

A simple, visually appealing calculator built using modern frontend technologies.
Calculation algorithm is based on [reverse polish notation](https://en.wikipedia.org/wiki/Shunting_yard_algorithm)

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
- Click `C` to clear the input and start fresh.

## Plans

- Add more calculator features
  - Add different associativity support (5!, for example)
  - Add multi-symbols named operators (sqrt, sin, etc.)
  - Add di for app components
- Add more UI features
  - Operators picker (unary operators enabled by default)
  - Operators creator
  - Themes picker
