// src/App.js

import "./app.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/singUp/singUp";
import SingIn from "./pages/singIn";
import StartPage from "./pages/startPage";
import UserForm from "./pages/userForm/userForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/signIn" element={<SingIn />} />
        <Route path="/skipPassword" element={<div>Skip Password Page</div>} />
        <Route path="/user-form" element={<UserForm />} />
        <Route
          path="/organizer-form"
          element={<div>Organizer Form Page</div>}
        />
      </Routes>
    </Router>
  );
}

export default App;
