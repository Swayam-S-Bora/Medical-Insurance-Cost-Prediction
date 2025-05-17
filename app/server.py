from fastapi import FastAPI
import numpy as np
import joblib

model = joblib.load("insurancemodel.pkl")

class_names = np.array([
    "age",
    "sex",
    "bmi",
    "children",
    "smoker",
    "region"
])

app = FastAPI()

@app.get("/")
def read_root():
    return {"Message": "Model API"}

@app.get("/predict")
def predict(data: dict):
    """
    Predict the insurance cost based on the input data.
    """
    # Convert input data to a numpy array
    input_data = np.array([[data.age, data.sex, data.bmi, data.children, data.smoker, data.region]])
    prediction = model.predict(input_data)
    class_name = class_names[prediction] [0]
    return {"prediction": class_name}

