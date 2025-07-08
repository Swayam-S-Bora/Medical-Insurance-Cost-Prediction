import { useState } from 'react';
import { Calculator, Heart, Users, Cigarette, TrendingUp, Info, Eye, EyeOff } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL || 'https://medical-insurance-cost-predictor-xby8.onrender.com';

function App() {
  const [formData, setFormData] = useState({
    age: '',
    bmi: '',
    children: '',
    smoker: ''
  });
  const [calculatorVisible, setCalculatorVisible] = useState(false);
  const [bmiCalc, setBmiCalc] = useState({ height: '', weight: '', calculatedBMI: null });
  const [prediction, setPrediction] = useState(null);
  const [contributions, setContributions] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600' };
    return { category: 'Obese', color: 'text-red-600' };
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    if (formData.smoker === '') {
      alert('Please select an option for Smoker.');
      setIsLoading(false);
      return;
    }

    const payload = {
      age: parseInt(formData.age),
      bmi: parseFloat(formData.bmi),
      children: parseInt(formData.children),
      smoker: formData.smoker
    };

    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setPrediction(data.predicted_insurance_cost);

      const explainRes = await fetch(`${API_URL}/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const explainData = await explainRes.json();
      setContributions(explainData.contributions);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderExplainabilityPanel = () => {
    if (!contributions) return null;

    const items = Object.entries(contributions);
    const maxAbs = Math.max(...items.map(([_, v]) => Math.abs(v)));

    const featureExplanations = {
      age: "Age is a key factor - older individuals typically have higher healthcare costs",
      bmi: "BMI impacts health risk assessment and premium calculations",
      children: "Number of dependents affects coverage scope and costs",
      smoker: "Smoking status significantly influences insurance premiums due to health risks",
    };

    const featureIcons = {
      age: <TrendingUp className="w-4 h-4" />,
      bmi: <Heart className="w-4 h-4" />,
      children: <Users className="w-4 h-4" />,
      smoker: <Cigarette className="w-4 h-4" />
    };

    return (
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <button
          className='flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium'
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          Feature Impact Analysis {showDetails ? '▲' : '▼'}
        </button>
        {showDetails && (
          <div className="mt-4 space-y-4">
            <div className="text-sm text-gray-600 mb-3">
              <Info className="w-4 h-4 inline mr-1" />
              Understanding how each factor contributes to your premium:
            </div>
            {items.map(([feature, value]) => {
              const percent = (Math.abs(value) / maxAbs) * 100;
              const isPositive = value >= 0;
              return (
                <div key={feature} className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {featureIcons[feature]}
                      <span className="font-medium capitalize">{feature}</span>
                    </div>
                    <span className={`font-semibold ${isPositive ? 'text-red-600' : 'text-green-600'}`}>
                      {isPositive ? '+' : ''}${value.toFixed(0)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-3 transition-all duration-500 ${isPositive ? 'bg-gradient-to-r from-red-400 to-red-600' : 'bg-gradient-to-r from-green-400 to-green-600'}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600">{featureExplanations[feature]}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const bmiInfo = formData.bmi ? getBMICategory(parseFloat(formData.bmi)) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Medical Insurance Cost Predictor</h1>
          </div>
          <p className="text-gray-600">Get an estimate of your medical insurance premium based on your profile</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="space-y-6">
            {/* Age Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-gray-700">
                <TrendingUp className="w-4 h-4" />
                Age
              </label>
              <input
                type="number"
                name="age"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your age"
                value={formData.age}
                onChange={handleChange}
                min="18"
                max="100"
                required
              />
            </div>

            {/* BMI Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-gray-700">
                <Heart className="w-4 h-4" />
                BMI (Body Mass Index)
              </label>
              <input
                type="number"
                step="0.1"
                name="bmi"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                  <span className={`font-medium ${bmiInfo.color}`}>{bmiInfo.category}</span>
                </div>
              )}
            </div>

            {/* Children Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-gray-700">
                <Users className="w-4 h-4" />
                Number of Children
              </label>
              <input
                type="number"
                name="children"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter number of children"
                value={formData.children}
                onChange={handleChange}
                min="0"
                max="10"
                required
              />
            </div>

            {/* Smoker Select */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-gray-700">
                <Cigarette className="w-4 h-4" />
                Smoking Status
              </label>
              <select
                name="smoker"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
            <div className="space-y-4">
              <button
                onClick={() => setCalculatorVisible(!calculatorVisible)}
                className="w-full bg-gray-200 text-black py-2 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium text-lg"
              >
                Toggle BMI Calculator
              </button>

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            {calculatorVisible && (
              <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
                <h3 className="font-medium text-gray-800 mb-2">BMI Calculator</h3>
                <input
                  type="number"
                  placeholder="Height in cm"
                  value={bmiCalc.height}
                  onChange={(e) => setBmiCalc({ ...bmiCalc, height: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2"
                />
                <input
                  type="number"
                  placeholder="Weight in kg"
                  value={bmiCalc.weight}
                  onChange={(e) => setBmiCalc({ ...bmiCalc, weight: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
                <button
                  onClick={() => {
                    const heightInMeters = bmiCalc.height / 100;
                    const calculatedBMI = (bmiCalc.weight / (heightInMeters * heightInMeters)).toFixed(2);
                    setBmiCalc({ ...bmiCalc, calculatedBMI });
                  }}
                  className="mt-2 bg-blue-500 text-white py-1 px-4 rounded-lg"
                >
                  Calculate BMI
                </button>
                {bmiCalc.calculatedBMI && (
                  <p className="text-sm text-gray-600 mt-2">
                    Your BMI is: <span className="font-semibold">{bmiCalc.calculatedBMI}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Results Card */}
        {prediction !== null && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Calculator className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Your Estimated Premium</h3>
              <div className="text-4xl font-bold text-green-600 mb-1">
                ${prediction.toFixed(0)}
              </div>
              <p className="text-gray-600">Annual premium estimate</p>
            </div>
            
            {/* Premium Breakdown */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Premium Breakdown</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>Monthly: <span className="font-medium">${(prediction / 12).toFixed(0)}</span></div>
                <div>Quarterly: <span className="font-medium">${(prediction / 4).toFixed(0)}</span></div>
              </div>
            </div>

            {renderExplainabilityPanel()}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;