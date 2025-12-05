# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import warnings

warnings.filterwarnings("ignore", category=UserWarning)

# Créer l'application FastAPI
app = FastAPI(title="Heart Disease Risk API")

# CORS : autoriser React en localhost
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # ["*"] pour tests rapides
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Charger le modèle entraîné
model = joblib.load("models/lr_heart_disease_pipeline.pkl")  # chemin vers ton modèle

# Définir le schéma attendu pour les patients
class Patient(BaseModel):
    BMI: float
    Smoking: str
    AlcoholDrinking: str
    Stroke: str
    PhysicalHealth: float
    MentalHealth: float
    DiffWalking: str
    Sex: str
    AgeCategory: str
    Race: str
    Diabetic: str
    PhysicalActivity: str
    GenHealth: str
    SleepTime: float
    Asthma: str
    KidneyDisease: str
    SkinCancer: str

# Route de prédiction
@app.post("/predict")
def predict_risk(patient: Patient, threshold: float = 0.25):
    """
    Prédit le risque de maladie cardiaque pour un patient.
    threshold : float, seuil pour classifier le patient comme 'à risque'
    """
    try:
        # Convertir le patient en DataFrame
        data = pd.DataFrame([patient.dict()])

        # Probabilité de maladie
        prob = model.predict_proba(data)[0][1]

        # Classe selon le seuil
        risk_class = int(prob >= threshold)

        return {
            "probability": float(prob),
            "threshold": threshold,
            "risk_class": risk_class  # 0 = faible risque, 1 = risque élevé
        }

    except Exception as e:
        return {"error": str(e)}

