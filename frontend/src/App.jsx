import { useState } from 'react';
import { Calculator, Heart, Users, Cigarette, TrendingUp, Info, Eye, EyeOff, Activity, Ruler, Weight } from 'lucide-react';
import PremiumForm from './components/PremiumForm';
import PremiumResult from './components/PremiumResult';
import FeatureImpactPanel from './components/FeatureImpactPanel';
import BMICalculator from './components/BMICalculator';

const API_URL = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL || 'https://medical-insurance-cost-predictor-xby8.onrender.com';

// Preload API to reduce cold starts
const preloadAPI = async () => {
  try {
    await fetch(`${API_URL}/health`, { method: 'GET' });
  } catch (error) {
    console.log('API preload failed:', error);
  }
};

// Preload on component mount
if (typeof window !== 'undefined') {
  setTimeout(preloadAPI, 1000);
}

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

    // Validate all fields
    if (!formData.age || !formData.bmi || !formData.children || formData.smoker === '') {
      alert('Please fill in all fields including Age, BMI, Children, and Smoking Status.');
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

  // Compose the BMI calculator popup
  const bmiCalculatorPopup = (
    <BMICalculator
      calculatorVisible={calculatorVisible}
      setCalculatorVisible={setCalculatorVisible}
      bmiCalc={bmiCalc}
      setBmiCalc={setBmiCalc}
      setFormData={setFormData}
      formData={formData}
    />
  );

  // Compose the feature impact panel
  const featureImpactPanel = (
    <FeatureImpactPanel
      contributions={contributions}
      showDetails={showDetails}
      setShowDetails={setShowDetails}
      isMobile={false}
    />
  );

  const bmiInfo = formData.bmi ? getBMICategory(parseFloat(formData.bmi)) : null;

  return (
    <div className="w-full h-screen overflow-hidden" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Desktop Layout */}
      <div className="hidden md:flex w-full h-full">
        {/* Left Side - Input Form */}
        <div className="w-[60%] h-full flex items-center justify-center p-4 lg:p-8">
          <PremiumForm
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            calculatorVisible={calculatorVisible}
            setCalculatorVisible={setCalculatorVisible}
            bmiCalc={bmiCalc}
            setBmiCalc={setBmiCalc}
            bmiInfo={bmiInfo}
            BMICalculatorComponent={bmiCalculatorPopup}
          />
        </div>
        {/* Right Side - Title and Results */}
        <PremiumResult prediction={prediction} showResults={showResults}>
          {featureImpactPanel}
        </PremiumResult>
      </div>
      {/* Mobile Layout */}
      <div className="md:hidden w-full h-screen p-4 overflow-y-auto" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        {/* Mobile Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold" style={{color: '#ffffff'}}>
              Medical Insurance Cost Predictor
            </h1>
          </div>
          <p style={{color: 'rgba(255, 255, 255, 0.8)'}}>Get an estimate of your medical insurance premium based on your profile</p>
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
              <BMICalculator
                calculatorVisible={calculatorVisible}
                setCalculatorVisible={setCalculatorVisible}
                bmiCalc={bmiCalc}
                setBmiCalc={setBmiCalc}
                setFormData={setFormData}
                formData={formData}
              />
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
          <div className="output-blur-container p-6 border border-white/30 shadow-2xl flex flex-col max-h-[80vh]">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <Calculator className="w-8 h-8" style={{color: '#ffffff'}} />
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{color: '#ffffff'}}>Your Estimated Premium</h3>
              <div className="text-4xl font-bold mb-1" style={{color: '#ffffff'}}>
                ${prediction.toFixed(0)}
              </div>
              <p style={{color: 'rgba(255, 255, 255, 0.8)'}}>Annual premium estimate</p>
            </div>
            {/* Premium Breakdown */}
            <div className="bg-white/10 rounded-xl p-4 mb-6">
              <h4 className="font-bold mb-3" style={{color: '#ffffff'}}>Premium Breakdown</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div style={{color: 'rgba(255, 255, 255, 0.9)'}}>Monthly: <span className="font-bold" style={{color: '#ffffff'}}>${(prediction / 12).toFixed(0)}</span></div>
                <div style={{color: 'rgba(255, 255, 255, 0.9)'}}>Quarterly: <span className="font-bold" style={{color: '#ffffff'}}>${(prediction / 4).toFixed(0)}</span></div>
              </div>
            </div>
            <FeatureImpactPanel
              contributions={contributions}
              showDetails={showDetails}
              setShowDetails={setShowDetails}
              isMobile={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;