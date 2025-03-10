import { Display } from './components/Display';
import { NumberPad } from './components/NumberPad';
import { CalculatorProvider } from './components/Provider';

const CalculatorApp = () => {
  return (
    <CalculatorProvider>
      <div className="w-3/4 flex flex-col gap-8 p-4 md:w-1/2 md:p-8 bg-gray-800">
        <Display/>
        <NumberPad/>
      </div>
    </CalculatorProvider>
  );
};

export default CalculatorApp;
