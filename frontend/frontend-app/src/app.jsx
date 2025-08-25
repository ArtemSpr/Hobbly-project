// src/App.js

import "./app.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/singUp/singUp";
import SignIn from "./pages/signIn/SignIn";
import StartPage from "./pages/startPage";
import ForgotPassword from './pages/forgotPassword/forgotPassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/skipPassword" element={<div>Skip Password Page</div>} />
        <Route path="/user-form" element={<div>User Form Page</div>} />
        <Route
          path="/organizer-form"
          element={<div>Organizer Form Page</div>}
        />
      </Routes>
    </Router>
  );
}

export default App;
