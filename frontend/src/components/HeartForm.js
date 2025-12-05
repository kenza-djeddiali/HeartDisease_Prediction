import React from "react";
import { Row, Col, Form, Button } from "react-bootstrap";

const HeartForm = ({ form, handleChange, handleSubmit, loading }) => {
  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col sm={6}>
          <Form.Group className="mb-2">
            <Form.Label>BMI</Form.Label>
            <Form.Control type="number" step="0.1" name="BMI" value={form.BMI} onChange={handleChange}/>
          </Form.Group>
        </Col>

        <Col sm={6}>
          <Form.Group className="mb-2">
            <Form.Label>Age Category</Form.Label>
            <Form.Select name="AgeCategory" value={form.AgeCategory} onChange={handleChange}>
              {["18-24","25-29","30-34","35-39","40-44","45-49","50-54","55-59","60-64","65-69","70-74","75-79","80 or older"].map(a=>(
                <option key={a}>{a}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col sm={6}>
          <Form.Group className="mb-2">
            <Form.Label>Sex</Form.Label>
            <Form.Select name="Sex" value={form.Sex} onChange={handleChange}>
              <option>Female</option>
              <option>Male</option>
            </Form.Select>
          </Form.Group>
        </Col>

        <Col sm={6}>
          <Form.Group className="mb-2">
            <Form.Label>Race</Form.Label>
            <Form.Select name="Race" value={form.Race} onChange={handleChange}>
              {["White","Black","Asian","Other"].map(r=>(
                <option key={r}>{r}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        {["Smoking","AlcoholDrinking","PhysicalActivity","Stroke","DiffWalking","Diabetic","Asthma","KidneyDisease","SkinCancer"].map(field=>(
          <Col sm={6} key={field}>
            <Form.Group className="mb-2">
              <Form.Label>{field}</Form.Label>
              <Form.Select name={field} value={form[field]} onChange={handleChange}>
                <option>No</option>
                <option>Yes</option>
              </Form.Select>
            </Form.Group>
          </Col>
        ))}

        <Col sm={6}>
          <Form.Group className="mb-2">
            <Form.Label>Gen Health</Form.Label>
            <Form.Select name="GenHealth" value={form.GenHealth} onChange={handleChange}>
              {["Excellent","Very good","Good","Fair","Poor"].map(g=>(
                <option key={g}>{g}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        {["PhysicalHealth","MentalHealth","SleepTime"].map(field=>(
          <Col sm={6} key={field}>
            <Form.Group className="mb-2">
              <Form.Label>{field} (days/hours)</Form.Label>
              <Form.Control type="number" name={field} value={form[field]} onChange={handleChange}/>
            </Form.Group>
          </Col>
        ))}

        <Col sm={12} className="mt-2">
          <Button type="submit" disabled={loading} className="w-100">
            {loading ? "Calculating..." : "Predict Risk"}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default HeartForm;
