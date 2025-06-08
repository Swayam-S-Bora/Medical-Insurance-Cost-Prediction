from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import joblib

# Load the model
model = joblib.load("app/insurancemodel.pkl")

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
    allow_origins=["http://localhost:3000"],  # React frontend origin
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
