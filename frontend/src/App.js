import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    age: '',
    bmi: '',
    children: '',
    smoker: '',
  });
  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.smoker === '') {
    alert('Please select a option for Smoker.');
    return;
  }

    try {
      const res = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: parseInt(formData.age),
          bmi: parseFloat(formData.bmi),
          children: parseInt(formData.children),
          smoker: formData.smoker,
        }),
      });
      const data = await res.json();
      setPrediction(data.predicted_insurance_cost);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Medical Insurance Cost Predictor</h2>
      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
        <div className="mb-3">
          <label className="form-label">Age</label>
          <input
            type="number"
            name="age"
            className="form-control"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">BMI</label>
          <input
            type="number"
            step="0.1"
            name="bmi"
            className="form-control"
            value={formData.bmi}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Children</label>
          <input
            type="number"
            name="children"
            className="form-control"
            value={formData.children}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Smoker</label>
          <select
            name="smoker"
            className="form-select"
            value={formData.smoker}
            onChange={handleChange}
            required
          >
            <option value="">--Select--</option>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary w-100">Predict</button>
      </form>

      {prediction !== null && (
        <div className="alert alert-success mt-4 text-center">
          <strong>Predicted Cost:</strong> ${prediction.toFixed(2)}
        </div>
      )}
    </div>
  );
}

export default App;