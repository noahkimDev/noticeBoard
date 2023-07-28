/*eslint-disable*/
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./home/home";
import Login from "./login/login";
import Signup from "./signup/signup";
import Writethenew from "./writethenew/writethenew";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/signup" element={<Signup></Signup>}></Route>
        <Route
          path="/writethenew"
          element={<Writethenew></Writethenew>}
        ></Route>
      </Routes>
    </>
  );
}

export default App;
