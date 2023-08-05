import "./home.css";

import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Home() {
  const navigate = useNavigate();
  const [list, setList] = useState("");
  useEffect(() => {
    axios
      .get("http://localhost:8000")
      .then((data) => {
        console.log(data.data);
        setList(data.data);
      })
      .catch((err) => console.log(err));
    console.log("홈 시작");
  }, []);

  function rendering(array) {
    if (!Array.isArray(array) || array.lengh == 0) {
      return null;
    }
    return array.map((e, i) => (
      <tr key={i}>
        <td
          onClick={async function () {
            await navigate(`/readTxt/${e.id}`);
          }}
        >
          {e.title}
        </td>
        <td>{e.createdAt}</td>
        <td>{e.author}</td>
      </tr>
    ));
  }

  function signUpForm() {
    navigate(`/signup`);
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
          <tbody>{rendering(list)}</tbody>
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
