import "./readTxt.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
function readTxt() {
  return (
    <>
      <h1 className="title">Text</h1>
      <div className="container">
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>제목</Form.Label>
            <Form.Control
              type="title"
              placeholder=""
              disabled
              readOnly
              //   onChange={function (e) {}}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>내용</Form.Label>
            <Form.Control
              disabled
              as="textarea"
              rows={10}
              onChange={function (e) {}}
            />
          </Form.Group>
        </Form>
        <Button variant="outline-dark" className="btn1">
          Edit
        </Button>
        <Link to="/">
          <Button variant="outline-dark" className="btn2">
            Back
          </Button>
        </Link>
      </div>
    </>
  );
}

export default readTxt;
