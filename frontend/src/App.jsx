import { useState } from 'react';
import { Calculator, Heart, Users, Cigarette, TrendingUp, Info, Eye, EyeOff, Activity, Ruler, Weight } from 'lucide-react';

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
  const [showResults, setShowResults] = useState(false);

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
      setShowResults(true);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left Side - Input Form */}
        <div className="w-1/2 p-8 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Calculate Premium
                  </h2>
                </div>
                <p className="text-gray-600 text-sm">Enter your details to get an accurate estimate</p>
              </div>

              <div className="space-y-6">
                {/* Age Input */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-semibold text-gray-700 text-sm">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
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
                  
                  {/* BMI Calculator */}
                  {calculatorVisible && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 mt-3 shadow-inner">
                      <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                        <Calculator className="w-4 h-4" />
                        BMI Calculator
                      </h4>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                            <Ruler className="w-3 h-3" />
                            Height (cm)
                          </label>
                          <input
                            type="number"
                            placeholder="e.g., 175"
                            value={bmiCalc.height}
                            onChange={(e) => setBmiCalc({ ...bmiCalc, height: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                            <Weight className="w-3 h-3" />
                            Weight (kg)
                          </label>
                          <input
                            type="number"
                            placeholder="e.g., 70"
                            value={bmiCalc.weight}
                            onChange={(e) => setBmiCalc({ ...bmiCalc, weight: e.target.value })}
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
                      {bmiCalc.calculatedBMI && (
                        <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200 shadow-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Calculated BMI:</span>
                            <span className="font-bold text-blue-800">{bmiCalc.calculatedBMI}</span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm text-gray-600">Category:</span>
                            <span className={`text-sm font-bold ${getBMICategory(parseFloat(bmiCalc.calculatedBMI)).color}`}>
                              {getBMICategory(parseFloat(bmiCalc.calculatedBMI)).category}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Children Input */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-semibold text-gray-700 text-sm">
                    <Users className="w-4 h-4 text-green-600" />
                    Number of Children
                  </label>
                  <input
                    type="number"
                    name="children"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
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
                <div className="mt-8">
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
        </div>

        {/* Right Side - Title and Results */}
        <div className="w-1/2 p-8 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute top-40 right-32 w-24 h-24 bg-white rounded-full"></div>
            <div className="absolute bottom-32 left-40 w-16 h-16 bg-white rounded-full"></div>
          </div>
          
          {/* Title (shows when no results) */}
          <div className={`text-center transition-all duration-1000 ${showResults ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'} ${showResults ? 'absolute' : 'relative'}`}>
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
                <Activity className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
                Medical Insurance
              </h1>
              <h2 className="text-4xl font-bold text-white/90 mb-6">
                Cost Predictor
              </h2>
              <p className="text-white/80 text-lg max-w-md mx-auto leading-relaxed">
                Get an accurate estimate of your medical insurance premium based on your personal profile and health factors
              </p>
            </div>
          </div>

          {/* Results (fades in when available) */}
          {prediction !== null && (
            <div className={`transition-all duration-1000 ${showResults ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-95'} ${!showResults ? 'absolute' : 'relative'} w-full max-w-md`}>
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                    <Calculator className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Your Estimated Premium</h3>
                  <div className="text-5xl font-bold text-white mb-2">
                    ${prediction.toFixed(0)}
                  </div>
                  <p className="text-white/80">Annual premium estimate</p>
                </div>
                
                {/* Premium Breakdown */}
                <div className="bg-white/10 rounded-xl p-4 mb-6">
                  <h4 className="font-bold text-white mb-3">Premium Breakdown</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-white/90">Monthly: <span className="font-bold text-white">${(prediction / 12).toFixed(0)}</span></div>
                    <div className="text-white/90">Quarterly: <span className="font-bold text-white">${(prediction / 4).toFixed(0)}</span></div>
                  </div>
                </div>

                {/* Feature Impact */}
                {contributions && (
                  <div className="bg-white/10 rounded-xl p-4">
                    <button
                      className='flex items-center gap-2 text-white hover:text-white/80 transition-colors duration-200 font-bold mb-3'
                      onClick={() => setShowDetails(!showDetails)}
                    >
                      {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      Feature Impact {showDetails ? '▲' : '▼'}
                    </button>
                    {showDetails && (
                      <div className="space-y-2">
                        {Object.entries(contributions).map(([feature, value]) => {
                          const isPositive = value >= 0;
                          return (
                            <div key={feature} className="flex items-center justify-between text-sm">
                              <span className="text-white/90 capitalize">{feature}</span>
                              <span className={`font-bold ${isPositive ? 'text-red-200' : 'text-green-200'}`}>
                                {isPositive ? '+' : ''}${value.toFixed(0)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen p-4">
        {/* Mobile Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Medical Insurance Cost Predictor
            </h1>
          </div>
          <p className="text-gray-600">Get an estimate of your medical insurance premium based on your profile</p>
        </div>

        {/* Mobile Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-6 border border-white/20">
          <div className="space-y-6">
            {/* Age Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-semibold text-gray-700 text-sm">
                <TrendingUp className="w-4 h-4 text-blue-600" />
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
              
              {/* BMI Calculator */}
              {calculatorVisible && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 mt-3 shadow-inner">
                  <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    BMI Calculator
                  </h4>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                        <Ruler className="w-3 h-3" />
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g., 175"
                        value={bmiCalc.height}
                        onChange={(e) => setBmiCalc({ ...bmiCalc, height: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                        <Weight className="w-3 h-3" />
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g., 70"
                        value={bmiCalc.weight}
                        onChange={(e) => setBmiCalc({ ...bmiCalc, weight: e.target.value })}
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
                  {bmiCalc.calculatedBMI && (
                    <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Calculated BMI:</span>
                        <span className="font-bold text-blue-800">{bmiCalc.calculatedBMI}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-gray-600">Category:</span>
                        <span className={`text-sm font-bold ${getBMICategory(parseFloat(bmiCalc.calculatedBMI)).color}`}>
                          {getBMICategory(parseFloat(bmiCalc.calculatedBMI)).category}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Children Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-semibold text-gray-700 text-sm">
                <Users className="w-4 h-4 text-green-600" />
                Number of Children
              </label>
              <input
                type="number"
                name="children"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
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
            <div className="mt-8">
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

        {/* Mobile Results */}
        {prediction !== null && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Calculator className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Your Estimated Premium</h3>
              <div className="text-4xl font-bold text-green-600 mb-1">
                ${prediction.toFixed(0)}
              </div>
              <p className="text-gray-600">Annual premium estimate</p>
            </div>
            
            {/* Premium Breakdown */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <h4 className="font-bold text-gray-700 mb-2">Premium Breakdown</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>Monthly: <span className="font-bold">${(prediction / 12).toFixed(0)}</span></div>
                <div>Quarterly: <span className="font-bold">${(prediction / 4).toFixed(0)}</span></div>
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