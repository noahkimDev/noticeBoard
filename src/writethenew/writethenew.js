import "./writethenew.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.css";
function Writethenew() {
  return (
    <>
      <h1 className="title">Text</h1>
      <div className="container">
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>제목</Form.Label>
            <Form.Control type="email" placeholder="" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>내용</Form.Label>
            <Form.Control as="textarea" rows={10} />
          </Form.Group>
        </Form>
        <Button variant="outline-dark" className="btn1">
          Submit
        </Button>
        <Button variant="outline-dark" className="btn2">
          Back
        </Button>
      </div>
    </>
  );
}

export default Writethenew;
