from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import pandas as pd
import joblib
import shap
import warnings
warnings.filterwarnings("ignore")
from contextlib import asynccontextmanager

model = None
explainer = None

# Input schema using Pydantic
class InsuranceInput(BaseModel):
    age: int
    bmi: float
    children: int
    smoker: str

# FastAPI app
app = FastAPI()

@asynccontextmanager
async def lifespan(app: FastAPI):
    global model, explainer
    try:
        model = joblib.load("app/insurancemodel.pkl")
        explainer = shap.Explainer(model)
        print("Model and SHAP explainer loaded successfully")
    except Exception as e:
        print(f"Error loading model: {e}")
        raise e
    yield  # This allows the app to start

app = FastAPI(lifespan=lifespan)

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
    # Check if model and explainer are loaded
    if model is None or explainer is None:
        return {"error": "Model or explainer not loaded yet"}
    
    smoker_map = {"yes": 1, "no": 0}
    try:
        input_data = np.array([[
            data.age,
            data.bmi,
            data.children,
            smoker_map[data.smoker.lower()],
        ]])
        shap_values = explainer(input_data)
        feature_names = ["age", "bmi", "children", "smoker"]
        contributions = dict(zip(feature_names, shap_values.values[0]))
        return {"contributions": contributions}
    except Exception as e:
        return {"error": f"SHAP explanation failed: {e}"}
