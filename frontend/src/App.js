import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Alert, Table, Button } from "react-bootstrap";

import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import HeartForm from "./components/HeartForm";
import 'chart.js/auto';



const INITIAL_FORM = {
  BMI: "",
  Smoking: "No",
  AlcoholDrinking: "No",
  Stroke: "No",
  PhysicalHealth: 0,
  MentalHealth: 0,
  DiffWalking: "No",
  Sex: "Female",
  AgeCategory: "50-54",
  Race: "White",
  Diabetic: "No",
  PhysicalActivity: "Yes",
  GenHealth: "Very good",
  SleepTime: 7,
  Asthma: "No",
  KidneyDisease: "No",
  SkinCancer: "No",
};

function App() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("pred_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("pred_history", JSON.stringify(history));
  }, [history]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const val = ["BMI","PhysicalHealth","MentalHealth","SleepTime"].includes(name)
      ? (value === "" ? "" : Number(value))
      : value;
    setForm(f => ({ ...f, [name]: val }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setRisk(null);
  setError(null);

  try {
    console.log("Form envoyé :", form);

    // Si tu veux passer un seuil (par ex. 0.25)
    const seuil = 0.25; 
    const res = await axios.post(
      `http://127.0.0.1:8000/predict?threshold=${seuil}`,
      form,
      { headers: { "Content-Type": "application/json" } }
    );

    // Récupération de la probabilité renvoyée par le backend
    const prob = res.data.probability;

    // Mise à jour du risque affiché
    setRisk(prob);

    // Sauvegarde dans l'historique
    const record = { 
      timestamp: new Date().toISOString(), 
      input: form, 
      risk: prob 
    };
    setHistory(h => [record, ...h].slice(0, 50));

  } catch (err) {
    console.error(err);
    setError(err.response?.data?.detail || err.message || "Prediction failed");
  } finally {
    setLoading(false);
  }
};


  const clearHistory = () => {
    setHistory([]);
    setRisk(null);
    localStorage.removeItem("pred_history");
  };

 const donutData = risk != null ? {
  labels: ["Risk", "Remaining"],
  datasets: [{
    data: [Math.round(risk*100), 100 - Math.round(risk*100)],
    backgroundColor: [
      // couleur du risque
      risk > 0.5 ? "#f44336" : (risk > 0.1 ? "#ff9800" : "#4caf50"),

      // couleur du reste (gris clair)
      "#e0e0e0"
    ],
    hoverOffset: 4
  }]
} : null;


  return (
    <Container className="py-4">
      <h1 className="text-center mb-4">Heart Disease Risk Predictor</h1>
      <Row className="g-4 justify-content-center">
        <Col md={7}>
          <Card className="p-3 mb-3">
            <HeartForm form={form} handleChange={handleChange} handleSubmit={handleSubmit} loading={loading} />
          </Card>

          {error && <Alert variant="danger">{error}</Alert>}

          <Card className="p-3 mt-3">
            <Row>
              <Col md={6}>
                <h5>History</h5>
                <Button variant="outline-danger" size="sm" onClick={clearHistory}>Clear</Button>
                <Table size="sm" className="mt-2">
                  <thead><tr><th>Date</th><th>Risk%</th></tr></thead>
                  <tbody>
                    {history.map((h,i)=>(
                      <tr key={i}><td>{new Date(h.timestamp).toLocaleString()}</td><td>{(h.risk*100).toFixed(2)}</td></tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
              <Col md={6} className="text-center">
                <h5>Result</h5>
                {risk == null ? <p>No prediction yet</p> : (
                  <>
                    <Doughnut data={donutData} />
                    <h3 className="mt-2">{(risk*100).toFixed(2)}%</h3>
                  </>
                )}
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
