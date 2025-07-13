import React from 'react';
import { Activity, TrendingUp, Users, Heart, Calculator, Cigarette } from 'lucide-react';

export default function PremiumForm({
  formData,
  handleChange,
  handleSubmit,
  isLoading,
  calculatorVisible,
  setCalculatorVisible,
  bmiInfo,
  BMICalculatorComponent
}) {
  return (
    <div className="w-full max-w-xl flex-shrink-0">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 lg:p-8 border border-white/30">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Calculate Premium
            </h2>
          </div>
          <p className="text-gray-600 text-sm">Enter your details to get an accurate estimate</p>
        </div>
        <div className="space-y-4">
          {/* Age and Children Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-semibold text-gray-700 text-sm">
                <TrendingUp className="w-4 h-4 text-green-600" />
                Age
              </label>
              <input
                type="number"
                name="age"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                placeholder="Enter your age"
                value={formData.age}
                onChange={handleChange}
                min="18"
                max="100"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-semibold text-gray-700 text-sm">
                <Users className="w-4 h-4 text-green-600" />
                Children
              </label>
              <input
                type="number"
                name="children"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                placeholder="Number of children"
                value={formData.children}
                onChange={handleChange}
                min="0"
                max="10"
                required
              />
            </div>
          </div>
          {/* BMI Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 font-semibold text-gray-700 text-sm">
                <Heart className="w-4 h-4 text-red-500" />
                BMI (Body Mass Index)
              </label>
              <button
                type="button"
                onClick={() => setCalculatorVisible(!calculatorVisible)}
                className="text-xs bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-full hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 flex items-center gap-1 shadow-md"
              >
                <Calculator className="w-3 h-3" />
                {calculatorVisible ? 'Hide' : 'Calculate'}
              </button>
            </div>
            <input
              type="number"
              step="0.1"
              name="bmi"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
              placeholder="Enter your BMI"
              value={formData.bmi}
              onChange={handleChange}
              min="10"
              max="50"
              required
            />
            {bmiInfo && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">Category:</span>
                <span className={`font-semibold ${bmiInfo.color}`}>{bmiInfo.category}</span>
              </div>
            )}
            {/* BMI Calculator Popup */}
            {BMICalculatorComponent}
          </div>
          {/* Smoker Select */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-semibold text-gray-700 text-sm">
              <Cigarette className="w-4 h-4 text-orange-600" />
              Smoking Status
            </label>
            <select
              name="smoker"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
              value={formData.smoker}
              onChange={handleChange}
              required
            >
              <option value="">Select your smoking status</option>
              <option value="no">Non-smoker</option>
              <option value="yes">Smoker</option>
            </select>
          </div>
          {/* Submit Button */}
          <div className="mt-6">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="w-5 h-5" />
                  Calculate Premium
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 