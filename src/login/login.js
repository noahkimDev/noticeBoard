import "./login.css";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

function Login() {
  return (
    <>
      <h1 className="title">Log-In</h1>

      <div className="container2">
        <Form noValidate>
          <div className="uppersideBtns">
            <Button type="submit" variant="outline-success" className="btn1">
              Back
            </Button>
            <Button type="submit" variant="outline-success" className="btn2">
              Sign-up
            </Button>
          </div>
          <Row className="mb-3 ">
            <Form.Group as={Col} md="14">
              <Form.Label>E-mail</Form.Label>
              <Form.Control required type="text" />
            </Form.Group>
          </Row>
          <Row className="mb-3 ">
            <Form.Group as={Col} md="14">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" required />
            </Form.Group>
          </Row>
          <div className="lowersideBtn">
            <Button type="submit" variant="warning" className="btn3" md="14">
              Submit form
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
}

export default Login;
