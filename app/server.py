from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import pandas as pd
# import shap
import joblib

# Global model variable
model = None

# Input schema using Pydantic
class InsuranceInput(BaseModel):
    age: int
    bmi: float
    children: int
    smoker: str

# FastAPI app
app = FastAPI()

@app.on_event("startup")
async def load_model():
    global model
    try:
        model = joblib.load("app/insurancemodel.pkl")
        print("Model loaded successfully")
    except Exception as e:
        print(f"Error loading model: {e}")
        raise e

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Message": "Model API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/predict")
def predict(data: InsuranceInput):
    # Check if model is loaded
    if model is None:
        return {"error": "Model not loaded yet"}
    
    # Map string inputs to numeric values (as used during training)
    smoker_map = {"yes": 1, "no": 0}

    try:
        input_data = np.array([[
            data.age,
            data.bmi,
            data.children,
            smoker_map[data.smoker.lower()],
        ]])
    except KeyError as e:
        return {"error": f"Invalid input: {e}"}

    prediction = model.predict(input_data)
    return {"predicted_insurance_cost": prediction[0]}

@app.post("/explain")
def explain(data: InsuranceInput):
    # Check if model is loaded
    if model is None:
        return {"error": "Model not loaded yet"}
    
    # Simplified feature importance explanation without SHAP
    smoker_map = {"yes": 1, "no": 0}
    try:
        # Basic feature impact simulation
        smoker_value = smoker_map[data.smoker.lower()]
        
        # Simple feature importance approximation
        contributions = {
            "age": data.age * 250,  # Age has moderate impact
            "bmi": (data.bmi - 25) * 400,  # BMI deviation from normal
            "children": data.children * 500,  # Each child adds cost
            "smoker": smoker_value * 20000,  # Smoking has major impact
        }
        
        return {"contributions": contributions}
    except KeyError as e:
        return {"error": f"Invalid input: {e}"}
