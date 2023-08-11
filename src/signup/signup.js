import "./signup.css";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const navigate = useNavigate();

  let [nickNameInfo, setNickNameInfo] = useState("");
  let [emailInfo, setEmailInfo] = useState("");
  let [emailCheckInfo, setEmailCheckInfo] = useState("");
  let [passwordInfo, setPasswordInfo] = useState("");
  let [passwordCheckInfo, setPasswordCheckInfo] = useState("");

  const signupSubmit = () => {
    //
    let data = {
      emailInfo: emailInfo,
      passwordInfo: passwordInfo,
      nickNameInfo: nickNameInfo,
    };
    //
    if (
      emailInfo === "" ||
      emailCheckInfo === "" ||
      passwordCheckInfo === "" ||
      passwordInfo === "" ||
      nickNameInfo === ""
    ) {
      return alert("there is vacant input value");
    }

    if (emailInfo === emailCheckInfo) {
      if (passwordInfo === passwordCheckInfo) {
        axios
          .post("http://localhost:8000/signup", data, {
            withCredentials: true,
          }) //
          .then((res) => {
            console.log("응답확인");
            alert("회원가입완료!");
            navigate("/");
          })
          .catch((err) => {
            alert(err.response.data);
            console.log(err);
          });
      } else {
        alert("different password");
      }
    } else {
      alert("diffent email");
    }
  };

  return (
    <>
      <h1 className="title">Sign-up</h1>

      <div className="container2">
        <Form noValidate>
          <div className="uppersideBtns">
            <Link to="/" style={{ width: "100%" }}>
              <Button type="submit" variant="success" className="signupBtn">
                Home
              </Button>
            </Link>
            {/* <Button type="submit" variant="outline-success" className="btn2">
              Sign-up
            </Button> */}
          </div>
          <Row className="mb-3 row">
            <Form.Group as={Col} md="14">
              <Form.Label>Nickname</Form.Label>
              <Form.Control
                required
                type="text"
                onChange={function (e) {
                  setNickNameInfo(e.target.value);
                }}
              />
            </Form.Group>
          </Row>
          <Row className="mb-3 row">
            <Form.Group as={Col} md="14">
              <Form.Label>E-mail</Form.Label>
              <Form.Control
                required
                type="text"
                onChange={function (e) {
                  setEmailInfo(e.target.value);
                }}
              />
            </Form.Group>
          </Row>
          <Row className="mb-3 row">
            <Form.Group as={Col} md="14">
              <Form.Label>E-mail confirmation</Form.Label>
              <Form.Control
                required
                type="text"
                onChange={function (e) {
                  setEmailCheckInfo(e.target.value);
                }}
              />
            </Form.Group>
          </Row>
          <Row className="mb-3 row">
            <Form.Group as={Col} md="14">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                required
                onChange={function (e) {
                  setPasswordInfo(e.target.value);
                }}
              />
            </Form.Group>
          </Row>
          <Row className="mb-3 row">
            <Form.Group as={Col} md="14">
              <Form.Label>Password confirmation</Form.Label>
              <Form.Control
                type="password"
                required
                onChange={function (e) {
                  setPasswordCheckInfo(e.target.value);
                }}
              />
            </Form.Group>
          </Row>
          <div className="lowersideBtn">
            <Button
              type="submit"
              variant="warning"
              className="btn3"
              md="14"
              onClick={async function (e) {
                await e.preventDefault();
                await signupSubmit();
              }}
            >
              Submit form
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
}

export default Signup;
