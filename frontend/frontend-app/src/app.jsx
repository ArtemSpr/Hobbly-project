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

function App() {
  const [userData, setUserData] = useState(null);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);

  const handleChildData = (data) => {
    setUserData(data);
    console.log("Main router get an info", data);
  };

  const handleOpenCreateEvent = (value) => {
    setIsCreateEventOpen(value);
    console.log("Main router get a value about creating own event");
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
        <Route
          path="/navigation"
          element={
            <Navigation
              userData={userData}
              isCreateEventOpen={isCreateEventOpen}
              setIsCreateEventOpen={setIsCreateEventOpen}
            />
          }
        />
        <Route path="/map" element={<Map userData={userData} />} />
        <Route path="/passwordVerif" element={<PasswordVerif />} />
        <Route
          path="/account"
          element={
            <Account
              userData={userData}
              isCreateEventOpen={isCreateEventOpen}
              setIsCreateEventOpen={setIsCreateEventOpen}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
