import "./home.css";

import { Pagination } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Home() {
  const navigate = useNavigate();

  const [searchTxt, setSearchTxt] = useState("");
  const [list, setList] = useState("");
  const [backupList, setBackupList] = useState("");
  const [num, setNum] = useState(0);
  const [rememberPage, setRememberPage] = useState("");
  const [memberOrNot, setMemberOrNot] = useState(false);
  const [whoAreYou, setWhoAreYou] = useState("");
  useEffect(() => {
    axios
      .get("http://localhost:8000/", {
        withCredentials: true,
      })
      .then(async (data) => {
        console.log("확인", data.data);
        await setList(data.data.allList);
        await setBackupList(data.data.allList);
        await setWhoAreYou(data.data.loginInfo);
        // await setMemberOrNot(false);
        await setMemberOrNot(data.data.areYouMember);
      })
      .catch((err) => console.log(err));
    console.log("홈 시작");
  }, []);

  function logout() {
    axios
      .get("http://localhost:8000/auth/logout", {
        withCredentials: true,
      }) //
      .then((data) => {
        console.log("로그아웃 성공", data);
        setMemberOrNot(false);
        setWhoAreYou("");
        // console.log("로그아웃", boolean);
      }) //
      .catch((err) => console.error(err));
  }
  function rendering(array, num) {
    if (!Array.isArray(array) || array.length === 0) {
      return null;
    }
    let usingArr = [...array];
    // console.log(num);
    // console.log(usingArr[0].Member);
    return usingArr.slice(6 * num, 6 * (num + 1)).map((e, i) => (
      <tr key={i}>
        <td
          onClick={async function () {
            await navigate(`/readTxt/${e.id}`);
          }}
        >
          {e.title}
        </td>
        <td>{e.createdAt.slice(0, 10)}</td>
        <td>{e.Member ? e.Member.nickname : e.author}</td>
      </tr>
    ));
  }

  function search(txt) {
    axios
      .get(`http://localhost:8000/search/${txt}`, {
        withCredentials: true,
      }) //
      .then(async (data) => {
        await setList(data.data);
      }) //
      .catch((err) => {
        console.log(err);
      });
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
      <h6 className="title">Hello! {whoAreYou}</h6>

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
            {memberOrNot ? (
              <>
                <Button
                  type="submit"
                  variant="outline-secondary"
                  className="btn4"
                  onClick={async function () {
                    await logout();
                  }}
                >
                  Log-out
                </Button>
              </>
            ) : (
              <>
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
              </>
            )}
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
          <tbody>{rendering(list, num)}</tbody>
        </Table>
        <Pagination className="paging">
          <Pagination.First
            onClick={function () {
              if (list.length) {
                setNum(0);
              }
            }}
          />
          <Pagination.Prev
            onClick={function (e) {
              if (list.length) {
                if (rememberPage === 1) {
                  setNum(0);
                } else {
                  setNum(rememberPage - 2);
                  setRememberPage(rememberPage - 1);
                }
              }
            }}
          />
          {/* Math.floor가 아니라 무조건 올림으로 해야함*/}
          {/* 6개 단위로 페이지를 끊을 때, 페이지 갯수가 7개를 넘어갔을 때 바로 페이지가 생기게 하려면 */}
          {/* 무조건 올림으로 해야함 */}
          {Array.isArray(list)
            ? list.slice(0, Math.ceil(list.length / 6)).map((e, i) => {
                if (i < 5) {
                  return (
                    <Pagination.Item
                      key={i}
                      onClick={function (e) {
                        setNum(i);
                        if (parseInt(e.target.textContent)) {
                          setRememberPage(parseInt(e.target.textContent));
                        }
                      }}
                    >
                      {i + 1}
                    </Pagination.Item>
                  );
                } else if (i === Math.ceil(list.length / 6) - 1) {
                  return (
                    <Pagination key={`ellipsis-and-last-${i}`}>
                      <Pagination.Ellipsis />
                      <Pagination.Item
                        key={`last-item-${i}`}
                        onClick={function (e) {
                          setNum(i);
                          if (parseInt(e.target.textContent)) {
                            setRememberPage(parseInt(e.target.textContent));
                          }
                        }}
                      >
                        {i + 1}
                      </Pagination.Item>
                    </Pagination>
                  );
                }
              })
            : null}
          <Pagination.Next
            onClick={async function (e) {
              if (list.length) {
                if (rememberPage === Math.ceil(list.length / 6) - 1) {
                  // console.log("here", num, rememberPage);
                  await setNum(rememberPage);
                  await setRememberPage(rememberPage + 1);
                } else if (rememberPage < Math.ceil(list.length / 6) - 1) {
                  await setNum(rememberPage);
                  await setRememberPage(rememberPage + 1);
                  // console.log(num, rememberPage);
                }
              }
            }}
          />
          <Pagination.Last
            onClick={function () {
              if (list.length) {
                setNum(Math.ceil(list.length / 6) - 1);
              }
            }}
          />
        </Pagination>
        {rememberPage ? (
          <Badge bg="light" text="dark">
            {rememberPage} / {Math.ceil(list.length / 6)} page
          </Badge>
        ) : null}

        <div className="searchTitle">
          <InputGroup className="mb-3 ">
            <Form.Control
              placeholder="Search title"
              aria-label="Search title"
              aria-describedby="basic-addon2"
              onChange={async function (e) {
                await setSearchTxt(e.target.value);
              }}
            />
            <Button
              variant="outline-secondary"
              id="button-addon2"
              onClick={async function () {
                if (searchTxt) {
                  // console.log("something", searchTxt);
                  await search(searchTxt);
                } else {
                  // console.log("nothing", backupList);
                  await setList(backupList);
                }
              }}
            >
              Search
            </Button>
          </InputGroup>
        </div>
      </div>
    </>
  );
}

export default Home;
