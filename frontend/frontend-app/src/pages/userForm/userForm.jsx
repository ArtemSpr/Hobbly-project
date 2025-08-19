import { Link } from "react-router-dom";
import { useState } from "react";

import "./userForm.css";

const UserForm = () => {
  const [NameValue, setNameValue] = useState("");
  const [EmailValue, setEmailValue] = useState("");
  const [PasswordValue, setPasswordValue] = useState("");

  const [isNameInvalid, setIsNameInvalid] = useState(false);
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);

  const handleNameChanges = (e) => {
    const value = e.target.value;
    setNameValue(value);
    setIsNameInvalid(!value || value.length < 3);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmailValue(value);
    setIsEmailInvalid(!value || !/\S+@\S+\.\S+/.test(value));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPasswordValue(value);
    setIsPasswordInvalid(!value || value.length < 8 || !/\d/.test(value));
  };

  const getStarted = (e) => {
    e.preventDefault();

    if (isNameInvalid || isEmailInvalid || isPasswordInvalid) {
      return; // блокуємо відправку, якщо є помилки
    }

    console.log("Name:", NameValue);
    console.log("Email:", EmailValue);
    console.log("Password:", PasswordValue);

    setNameValue("");
    setEmailValue("");
    setPasswordValue("");
  };

  return (
    <div className="card">
      <div className="card-image">
        <h2 className="card-heading">
          Get started
          <small>Let us create your account</small>
        </h2>
      </div>
      <form className="card-form" onSubmit={getStarted}>
        {/* Full name */}
        <div className="input">
          <input
            type="text"
            name="fullName"
            className={`input-field ${isNameInvalid ? "input-field-red" : ""}`}
            id="fullName"
            value={NameValue}
            onChange={handleNameChanges}
          />
          <label className="input-label">Full name</label>
          {isNameInvalid && (
            <p className="error-text">Name must be at least 3 characters</p>
          )}
        </div>

        {/* Email */}
        <div className="input">
          <input
            type="email"
            name="email"
            className={`input-field ${isEmailInvalid ? "input-field-red" : ""}`}
            id="email"
            value={EmailValue}
            onChange={handleEmailChange}
          />
          <label className="input-label">Email</label>
          {isEmailInvalid && (
            <p className="error-text">Please enter a valid email</p>
          )}
        </div>

        {/* Password */}
        <div className="input">
          <input
            type="password"
            name="password"
            className={`input-field ${
              isPasswordInvalid ? "input-field-red" : ""
            }`}
            id="password"
            value={PasswordValue}
            onChange={handlePasswordChange}
          />
          <label className="input-label">Password</label>
          {isPasswordInvalid && (
            <p className="error-text">
              Password must be at least 8 characters and contain a number
            </p>
          )}
        </div>

        <div className="action">
          <button type="submit" className="action-button">
            Get started
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
