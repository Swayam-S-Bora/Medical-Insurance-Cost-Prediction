import { useState } from 'react';
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    age: '',
    bmi: '',
    children: '',
    smoker: '',
  });

  const [prediction, setPrediction] = useState(null);
  const [contributions, setContributions] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.smoker === '') {
      alert('Please select an option for Smoker.');
      return;
    }

    const payload = {
      age: parseInt(formData.age),
      bmi: parseFloat(formData.bmi),
      children: parseInt(formData.children),
      smoker: formData.smoker,
    };

    try {
      const res = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setPrediction(data.predicted_insurance_cost);

      const explainRes = await fetch('http://localhost:8000/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const explainData = await explainRes.json();
      setContributions(explainData.contributions);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const renderExplainabilityPanel = () => {
    if (!contributions) return null;

    const items = Object.entries(contributions);
    const maxAbs = Math.max(...items.map(([_, v]) => Math.abs(v)));

    const featureExplanations = {
      age: "Younger individuals typically pay lower premiums.",
      bmi: "A healthy BMI reduces health risk and thus insurance cost.",
      children: "Having more children can increase coverage needs.",
      smoker: "Being a smoker significantly increases insurance costs.",
    };

    return (
      <div className="mt-8">
        <h5 className="text-lg font-semibold mb-4">Feature Contributions (SHAP)</h5>
        {items.map(([feature, value]) => {
          const percent = (Math.abs(value) / maxAbs) * 100;
          return (
            <div key={feature} className="mb-3">
              <div className="flex justify-between text-sm font-medium">
                <span>{feature}</span>
                <span className="text-gray-500">{value.toFixed(2)}</span>
              </div>
              <div className="w-full bg-gray-200 h-4 rounded overflow-hidden">
                <div
                  className={`h-4 ${value >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}

        <button
          className="mt-4 flex items-center text-blue-600 hover:underline"
          onClick={() => setShowDetails(!showDetails)}
        >
          Details {showDetails ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
        </button>

        {showDetails && (
          <div className="mt-3 p-4 border border-gray-200 rounded bg-gray-50">
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {items.map(([feature]) => (
                <li key={feature}>
                  <strong>{feature}:</strong> {featureExplanations[feature] || "No explanation available."}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Medical Insurance Cost Predictor</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Age</label>
          <input
            type="number"
            name="age"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">BMI</label>
          <input
            type="number"
            step="0.1"
            name="bmi"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={formData.bmi}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Children</label>
          <input
            type="number"
            name="children"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={formData.children}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Smoker</label>
          <select
            name="smoker"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={formData.smoker}
            onChange={handleChange}
            required
          >
            <option value="">--Select--</option>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Predict
        </button>
      </form>

      {prediction !== null && (
        <>
          <div className="mt-6 text-center text-green-700 font-semibold">
            Predicted Cost: ${prediction.toFixed(2)}
          </div>
          {renderExplainabilityPanel()}
        </>
      )}
    </div>
  );
}

export default App;