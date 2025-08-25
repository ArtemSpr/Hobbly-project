// src/App.js

import "./app.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/signUp/signUp";
import SignIn from "./pages/signIn/SignIn";
import StartPage from "./pages/startPage";
import ForgotPassword from "./pages/forgotPassword/forgotPassword";
import UserForm from "./pages/userForm/userForm";
import OrganaizerForm from "./pages/organaizerForm/organaizerForm";
import Navigation from "./pages/navigation/navigation";

//! TO DO: Think where you should use token from login response

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/user-form" element={<UserForm />} />
        <Route path="/organizer-form" element={<OrganaizerForm />} />
        <Route path="/navigation" element={<Navigation />} />
      </Routes>
    </Router>
  );
}

export default App;
