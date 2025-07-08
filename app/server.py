from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import pandas as pd
# import shap
import joblib

# Load the model
model = joblib.load("app/insurancemodel.pkl")

# # Initialize SHAP explainer
# explainer = shap.Explainer(model)

# Input schema using Pydantic
class InsuranceInput(BaseModel):
    age: int
    bmi: float
    children: int
    smoker: str

# FastAPI app
app = FastAPI()

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

@app.post("/predict")
def predict(data: InsuranceInput):
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
    smoker_map = {"yes": 1, "no": 0}
    try:
        input_df = pd.DataFrame([{
            "age": data.age,
            "bmi": data.bmi,
            "children": data.children,
            "smoker": smoker_map[data.smoker.lower()],
        }])
    except KeyError as e:
        return {"error": f"Invalid input: {e}"}

    shap_values = explainer(input_df)
    contributions = dict(zip(input_df.columns, shap_values.values[0]))

    return {"contributions": contributions}
