# Medical Insurance Cost Prediction

A responsive web application to predict medical insurance costs based on various factors such as age, BMI, number of children, and smoking status.

## 🌐 Live Demo

You can access the live application at: [https://medical-insurance-cost-prediction.vercel.app/](https://medical-insurance-cost-prediction.vercel.app/)

## 📋 Project Overview

This project aims to predict medical insurance costs using machine learning models. The application provides users with an intuitive interface to input their personal information and get an estimated insurance cost prediction along with explanations about how each factor contributes to the final cost.

### ✨ Key Features

- **Insurance Cost Prediction**: Users can input their age, BMI, number of children, and smoking status to get personalized insurance cost predictions
- **Interactive BMI Calculator**: Built-in BMI calculator for users who don't know their BMI
- **Feature Impact Analysis**: Detailed breakdown of how each factor contributes to the insurance cost
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Predictions**: Instant results with detailed explanations

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs with Python
- **Python**: Core programming language
- **Uvicorn**: ASGI server for running FastAPI applications

### Frontend
- **React**: JavaScript library for building user interfaces
- **Tailwind CSS**: Utility-first CSS framework for styling

### Machine Learning
- **scikit-learn**: Machine learning library for model training and evaluation
- **pandas**: Data manipulation and analysis
- **numpy**: Numerical computing library
- **matplotlib & seaborn**: Data visualization libraries
- **joblib**: Model serialization and deployment

### Infrastructure
- **Docker**: Containerization for consistent deployment
- **Docker Compose**: Multi-container Docker applications
- **Render**: Cloud platform for deployment

## 🤖 Machine Learning Models

The project experimented with multiple machine learning algorithms to find the best performing model:

### Models Tested

1. **Linear Regression**
   - Train Accuracy: 72.95%
   - Test Accuracy: 80.62%
   - CV Score: 74.71%

2. **Support Vector Regressor (SVR)**
   - Train Accuracy: -10.15%
   - Test Accuracy: -13.44%
   - CV Score: -10.37%
   - *Note: Poor performance due to data characteristics*

3. **Random Forest Regressor**
   - Train Accuracy: 97.46%
   - Test Accuracy: 88.22%
   - CV Score: 83.67%
   - *Best Parameters: n_estimators=120*

4. **Gradient Boosting Regressor** ⭐ **Selected Model**
   - Train Accuracy: 86.82%
   - Test Accuracy: 90.17%
   - CV Score: 86.06%
   - *Best Parameters: n_estimators=20, learning_rate=0.2*

### Model Selection Rationale

The **Gradient Boosting Regressor** was chosen as the final model because:
- Excellent test accuracy (90.17%) indicating good generalization
- Balanced performance between training and test sets (less overfitting compared to Random Forest)
- Strong cross-validation score (86.06%) showing consistent performance
- Good interpretability with feature importance analysis

### Feature Importance Analysis

The model identified the following feature importance rankings:
1. **Smoker Status**: 68.99% (Most significant factor)
2. **BMI**: 17.61%
3. **Age**: 12.12%
4. **Children**: 1.11%
5. **Sex**: 0.03% (Excluded from final model)
6. **Region**: 0.14% (Excluded from final model)

## 🚀 Installation Guide

### Prerequisites

- **Docker**: Ensure Docker is installed on your machine
- **Docker Compose**: For running multi-container applications

### Quick Start with Docker

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/Medical-Insurance-Cost-Prediction.git
   cd Medical-Insurance-Cost-Prediction
   ```

2. **Run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Manual Installation

#### Backend Setup

1. **Navigate to project directory:**
   ```bash
   cd Medical-Insurance-Cost-Prediction
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the backend:**
   ```bash
   uvicorn app.server:app --host 0.0.0.0 --port 8000
   ```

#### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## 📊 Dataset Information

The model was trained on medical insurance dataset from kaggle containing:

- **Features**: 
  - Age (18-64 years)
  - Sex (Male/Female)
  - BMI (Body Mass Index)
  - Children (Number of dependents: 0-5)
  - Smoker (Yes/No)
  - Region (Northeast, Southeast, Southwest, Northwest)
- **Target**: Insurance charges ($1,121 - $63,770)

### Data Preprocessing

- **Outlier Treatment**: BMI values were capped using IQR method
- **Feature Encoding**: Categorical variables converted to numerical format
- **Feature Selection**: Removed low-importance features (sex, region)
- **Data Splitting**: 80% training, 20% testing

## 🔧 API Endpoints

### Prediction Endpoint
```
POST /predict
Content-Type: application/json

{
    "age": 21,
    "bmi": 23.3,
    "children": 0,
    "smoker": "no"
}
```

### Explanation Endpoint
```
POST /explain
Content-Type: application/json

{
    "age": 21,
    "bmi": 23.3,
    "children": 0,
    "smoker": "no"
}
```

## 🏗️ Project Structure

```
Medical-Insurance-Cost-Prediction/
├── app/
│   ├── server.py              # FastAPI backend server
│   └── insurancemodel.pkl     # Trained ML model
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main React application
│   │   ├── main.jsx          # React entry point
│   │   └── index.css         # Styling
│   ├── package.json          # Frontend dependencies
│   └── vite.config.js        # Vite configuration
├── Prediction_Model.ipynb     # Jupyter notebook with ML development
├── insurance.csv             # Dataset
├── requirements.txt          # Python dependencies
├── Dockerfile               # Backend containerization
├── docker-compose.yml       # Multi-container setup
└── README.md               # Project documentation
```

## 🧪 Model Performance Metrics

| Model | Train Accuracy | Test Accuracy | CV Score | Comments |
|-------|---------------|---------------|----------|----------|
| Linear Regression | 72.95% | 80.62% | 74.71% | Good baseline |
| SVR | -10.15% | -13.44% | -10.37% | Poor fit |
| Random Forest | 97.46% | 88.22% | 83.67% | Overfitting |
| **Gradient Boosting** | **86.82%** | **90.17%** | **86.06%** | **Best overall** |


## Acknowledgments

- Dataset source: Kaggle Medical Insurance Cost Dataset [https://www.kaggle.com/datasets/rahulvyasm/medical-insurance-cost-prediction](https://www.kaggle.com/datasets/rahulvyasm/medical-insurance-cost-prediction)
- Icons: Lucide React
- Deployment: Render & Vercel

---
