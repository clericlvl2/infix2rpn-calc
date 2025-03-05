import { CalculatorProvider } from './components/Provider';
import { Display } from './components/Display';
import { NumberPad } from './components/NumberPad';

const CalculatorApp = () => {
  return (
    <CalculatorProvider>
      <div className="min-h-full min-w-[296px] flex flex-col items-center justify-center px-4 bg-green-950">
        <div className="lg:max-w-md flex flex-col gap-4 rounded-lg p-6 w-full bg-gray-800">
          <Display/>
          <NumberPad/>
        </div>
      </div>
    </CalculatorProvider>
  );
};

export default CalculatorApp;
