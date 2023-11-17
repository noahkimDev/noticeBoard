import "./readTxt.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
function ReadTxt() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [chosenData, setChosenData] = useState("");
  const [sameUser, setSameUser] = useState("");
  const [isEditing, setIsEditing] = useState(true);
  const [titleEditing, setTitleEditing] = useState("");
  const [contentEditing, setContentEditing] = useState("");

  async function deleteData() {
    if (window.confirm("do you really want to delete this content?")) {
      await axios
        .delete(`http://localhost:8000/delete/${id}`, {
          withCredentials: true,
        })
        .then((data) => {
          console.log(data);
          alert("completed delete");
          navigate("/");
        }) //
        .catch((err) => console.log(err));
    }
  }
  useEffect(() => {
    axios
      .get(`http://localhost:8000/readTxt/${id}`, {
        withCredentials: true,
      }) //
      .then(async (data) => {
        console.log(data.data);
        await setChosenData(data.data.chosenData);
        await setSameUser(data.data.sameUser);
      }) //
      .catch((err) => console.log(err));
  }, []);

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
              disabled={isEditing}
              value={(!titleEditing ? chosenData.title : titleEditing) || ""}
              onChange={async function (e) {
                await setTitleEditing(e.target.value);
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>내용</Form.Label>
            <Form.Control
              disabled={isEditing}
              as="textarea"
              rows={10}
              value={
                (!contentEditing ? chosenData.content : contentEditing) || ""
              }
              onChange={async function (e) {
                await setContentEditing(e.target.value);
              }}
            />
          </Form.Group>
        </Form>
        {sameUser ? (
          <>
            {isEditing ? (
              <Button
                variant="outline-dark"
                onClick={async function () {
                  await setIsEditing(false);
                }}
                className="btn1"
              >
                Edit
              </Button>
            ) : (
              <Button
                variant="outline-dark"
                onClick={async function () {
                  await setIsEditing(true);
                  // 공백이 넘어감
                  // 아무것도 작성하지 않아도 기존에 있던 값을 보내야함

                  await axios
                    .put(
                      `http://localhost:8000/edit/${id}`,
                      {
                        newTitle: !titleEditing
                          ? chosenData.title
                          : titleEditing,
                        newContent: !contentEditing
                          ? chosenData.content
                          : contentEditing,
                      },
                      {
                        withCredentials: true,
                      }
                    ) //
                    .then((data) => console.log(data))
                    .catch((err) => console.log(err));
                }}
                className="btn1"
              >
                save
              </Button>
            )}
            <Button
              variant="outline-dark"
              className="btn1"
              onClick={deleteData}
            >
              Delete
            </Button>
          </>
        ) : (
          <></>
        )}

        <Link to="/">
          <Button variant="outline-dark" className="btn1">
            Home
          </Button>
        </Link>
      </div>
    </>
  );
}

export default ReadTxt;
