// src/App.js

import "./app.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/signUp/signUp";
import SignIn from "./pages/signIn/SignIn";
import StartPage from "./pages/startPage";
import ForgotPassword from './pages/forgotPassword/forgotPassword';
import UserForm from "./pages/userForm/userForm";
import OrganaizerForm from "./pages/organaizerForm/organaizerForm";
import SkipPassword from "./pages/skipPassword/skipPassword";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/skipPassword" element={< SkipPassword />} />
        <Route path="/user-form" element={<UserForm />} />
        <Route
          path="/organizer-form"
          element={<OrganaizerForm />} // Ensure OrganaizerForm is imported correctly
        />
      </Routes>
    </Router>
  );
}

export default App;
