import "./home.css";

import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  function signUpForm() {
    navigate("/signup");
  }
  function logInForm() {
    navigate("/login");
  }
  function writeTheNewForm() {
    navigate("/writethenew");
  }
  return (
    <>
      <h1 className="title">My Board</h1>
      <div className="homeTable">
        <div className="uppersideBtns">
          <Button
            type="submit"
            onClick={writeTheNewForm}
            variant="outline-secondary"
            className="btn1"
          >
            New
          </Button>
          <div>
            <Button
              type="submit"
              variant="outline-secondary"
              className="btn2"
              onClick={signUpForm}
            >
              Sign-up
            </Button>{" "}
            <Button
              type="submit"
              variant="outline-secondary"
              onClick={logInForm}
              className="btn2"
            >
              Log-in
            </Button>
          </div>
        </div>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th className="col-md-8">Title</th>
              <th>Date</th>
              <th>Nickname</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>I am a boy</td>
              <td>2023.07.01</td>
              <td>kim</td>
            </tr>
            <tr>
              <td>I am a student</td>
              <td>2023.07.01</td>
              <td>michael</td>
            </tr>
            <tr>
              <td>I am Sam</td>
              <td>2023.07.01</td>
              <td>jordan</td>
            </tr>
          </tbody>
        </Table>
        <a href="http://www.naver.com" className="paging">
          [1]
        </a>
        <div className="searchTitle">
          <InputGroup className="mb-3 ">
            <Form.Control
              placeholder="Search title"
              aria-label="Search title"
              aria-describedby="basic-addon2"
            />
            <Button variant="outline-secondary" id="button-addon2">
              Search
            </Button>
          </InputGroup>
        </div>
      </div>
    </>
  );
}

export default Home;
