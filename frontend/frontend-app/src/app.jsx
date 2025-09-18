import "./app.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import SignUp from "./pages/signUp/signUp";
import SignIn from "./pages/signIn/SignIn";
import StartPage from "./pages/startPage";
import ForgotPassword from "./pages/forgotPassword/forgotPassword";
import UserForm from "./pages/userForm/userForm";
import OrganaizerForm from "./pages/organaizerForm/organaizerForm";
import SkipPassword from "./pages/skipPassword/skipPassword";
import Navigation from "./pages/navigation/navigation";
import Map from "./pages/map/map";
import PasswordVerif from "./pages/passwordVerif/passwordVerif";
import Account from "./pages/account/account";

//! TO DO: Think where you should use token from login response

//! ----------------------------------------------------------
//? TO DO: show information about user in his account
//! ----------------------------------------------------------

function App() {
  const [userData, setUserData] = useState(null);

  const handleChildData = (data) => {
    setUserData(data);
    console.log("Father get an information");
  };
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route
          path="/signIn"
          element={<SignIn sendDataToParent={handleChildData} />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/user-form"
          element={<UserForm sendDataToParent={handleChildData} />}
        />
        <Route
          path="/organizer-form"
          element={<OrganaizerForm sendDataToParent={handleChildData} />}
        />
        <Route path="/navigation" element={<Navigation />} />
        <Route path="/map" element={<Map />} />
        <Route path="/passwordVerif" element={<PasswordVerif />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </Router>
  );
}

export default App;
