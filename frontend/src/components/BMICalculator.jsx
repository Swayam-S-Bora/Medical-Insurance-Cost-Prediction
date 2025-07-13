import { Calculator, Ruler, Weight } from 'lucide-react';
import React from 'react';

export default function BMICalculator({ calculatorVisible, setCalculatorVisible, bmiCalc, setBmiCalc, setFormData, formData }) {
  return (
    <div className="overflow-hidden transition-all duration-300 ease-in-out" style={{maxHeight: calculatorVisible ? '400px' : '0px'}}>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 mt-3 shadow-inner">
        <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
          <Calculator className="w-4 h-4" />
          BMI Calculator
        </h4>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="flex items-center gap-1 text-sm font-semibold text-gray-700 mb-1">
              <Ruler className="w-3 h-3" />
              Height (cm)
            </label>
            <input
              type="number"
              value={bmiCalc.height}
              onChange={e => setBmiCalc({ ...bmiCalc, height: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="flex items-center gap-1 text-sm font-semibold text-gray-700 mb-1">
              <Weight className="w-3 h-3" />
              Weight (kg)
            </label>
            <input
              type="number"
              value={bmiCalc.weight}
              onChange={e => setBmiCalc({ ...bmiCalc, weight: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
        <button
          onClick={() => {
            const heightInMeters = bmiCalc.height / 100;
            const calculatedBMI = (bmiCalc.weight / (heightInMeters * heightInMeters)).toFixed(2);
            setBmiCalc({ ...bmiCalc, calculatedBMI });
            setFormData({ ...formData, bmi: calculatedBMI });
          }}
          disabled={!bmiCalc.height || !bmiCalc.weight}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
        >
          <Calculator className="w-4 h-4" />
          Calculate & Use BMI
        </button>
      </div>
    </div>
  );
} 