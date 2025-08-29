import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

import "./userForm.css";

const UserForm = () => {
  const navigate = useNavigate();
  const [NameValue, setNameValue] = useState("");
  const [EmailValue, setEmailValue] = useState("");
  const [PasswordValue, setPasswordValue] = useState("");

  const [isNameTouched, setIsNameTouched] = useState(false);
  const [isEmailTouched, setIsEmailTouched] = useState(false);
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);

  //! TO DO: Submit func. work even if input are empty
  //! TO DO: Submit func. work even if you entered only email

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const isNameInvalid = NameValue.length < 3;
  const isEmailInvalid = !EmailValue || !/\S+@\S+\.\S+/.test(EmailValue);
  const isPasswordInvalid =
    !PasswordValue || PasswordValue.length < 8 || !/\d/.test(PasswordValue);

  const handleNameChanges = (e) => {
    const value = e.target.value;
    setNameValue(value);
    setIsNameTouched(true);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmailValue(value);
    setIsEmailTouched(true);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPasswordValue(value);
    setIsPasswordTouched(true);
  };

  const getStarted = async (e) => {
    e.preventDefault();

    if (isNameInvalid || isEmailInvalid || isPasswordInvalid) {
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/register`,
        {
          name: NameValue,
          email: EmailValue,
          password: PasswordValue,
        }
      );
      console.log("User created:", response.data);

      if (response.status === 200) {
        console.log("✅ WellDone:", response.data);
        navigate("/navigation");
      }
    } catch (error) {
      if (error.response) {
        console.error("Server error:", error.response.data);
        if (error.response.status === 400) {
          console.log("❌ This email is already registered");
        }
      } else if (error.request) {
        console.error("No response from server");
      } else {
        console.error("Axios error:", error.message);
      }
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
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="back-button"
        >
          ←
        </button>
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
          {isNameInvalid && isNameTouched && (
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
          {isEmailInvalid && isEmailTouched && (
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
          {isPasswordInvalid && isPasswordTouched && (
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
