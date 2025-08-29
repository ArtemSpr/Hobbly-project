import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/icons/bigGreenLogo.png";
import "../app.css";

const StartPage = () => {
  return (
    <div className="app">
      <div className="register-page">
        <div className="logo-side">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="buttons-side">
          <Link to="/signUp" className="btn-style signUp">
            Sign Up
          </Link>
          <Link to="/signIn" className="btn-style signIn">
            Sign In
          </Link>
          <Link to="/navigation" className="btn-style skipPassword">
            Skip Password
          </Link>
        </div>
        <div className="version">v0.1.1</div>
      </div>
    </div>
  );
};

export default StartPage;
