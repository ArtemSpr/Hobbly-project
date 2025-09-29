import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ErrorIcon from "../../assets/icons/error.png";

import "./userForm.css";

const UserForm = ({ sendDataToParent }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isNameTouched, setIsNameTouched] = useState(false);
  const [isEmailTouched, setIsEmailTouched] = useState(false);
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });
  const [errorMessage, setErrorMessage] = useState("");

  const isNameInvalid = name.length < 3;
  const isEmailInvalid = !email || !/\S+@\S+\.\S+/.test(email);
  const isPasswordInvalid =
    !passwordValidations.length ||
    !passwordValidations.upper ||
    !passwordValidations.lower ||
    !passwordValidations.number ||
    !passwordValidations.special;

  const validatePassword = (pass) => {
    setPasswordValidations({
      length: pass.length >= 8 && pass.length <= 20,
      upper: /[A-Z]/.test(pass),
      lower: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
    });
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    setIsPasswordTouched(true);
    validatePassword(val);
  };

  useEffect(() => {
    const errorBlock = document.querySelector(".errorBlock");
    if (errorBlock) {
      if (errorMessage) {
        errorBlock.classList.add("active");
      } else {
        errorBlock.classList.remove("active");
      }
    }
  }, [errorMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsNameTouched(true);
    setIsEmailTouched(true);
    setIsPasswordTouched(true);

    if (isNameInvalid || isEmailInvalid || isPasswordInvalid) return;

    try {
      const response = await axios.post("/api/auth/register/user", {
        name,
        email,
        password,
      });
      sendDataToParent(response.data.user);

      if (response.status === 201) {
        console.log("Registration successful:", response.data);
        setErrorMessage("");
        navigate("/navigation");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error("Server Error:", error.response.data);
          setErrorMessage(error.response.data.error || "Server error");
        } else if (error.request) {
          console.error("No response from server:", error.request);
          setErrorMessage("No response from server, please try again later");
        } else {
          console.error("Error:", error.message);
          setErrorMessage("An unexpected error occurred");
        }
      } else {
        console.error("Unexpected Error:", error);
        setErrorMessage("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="card">
      <div className="card-image">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="back-button-sign"
        >
          ←
        </button>
        <h2 className="card-heading">
          Start
          <small>Create your account</small>
        </h2>
      </div>

      <form className="card-form" onSubmit={handleSubmit}>
        {/* Full name */}
        <div className="userForm-input">
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setIsNameTouched(true)}
            className={`input-field ${
              isNameInvalid && isNameTouched ? "input-field-red" : ""
            }`}
          />
        </div>
        {isNameInvalid && isNameTouched && (
          <ul className="password-checklist">
            <li key="name-length">Name must be at least 3 characters long</li>
          </ul>
        )}

        {/* Email */}
        <div className="userForm-input">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setIsEmailTouched(true)}
            className={`input-field ${
              isEmailInvalid && isEmailTouched ? "input-field-red" : ""
            }`}
          />
        </div>
        {isEmailInvalid && isEmailTouched && (
          <ul className="password-checklist">
            <li key="email-invalid">Please enter a valid email address</li>
          </ul>
        )}

        {/* Password */}
        <div className="password-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            onBlur={() => setIsPasswordTouched(true)}
            className={`input-field ${
              isPasswordInvalid && isPasswordTouched ? "input-field-red" : ""
            }`}
          />
          <span
            className="password-toggle-icon"
            onClick={() => setShowPassword((p) => !p)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>
        {password && (
          <ul className="password-checklist">
            <li
              key="pass-length"
              className={passwordValidations.length ? "valid" : "invalid"}
            >
              8–20 characters
            </li>
            <li
              key="pass-upper"
              className={passwordValidations.upper ? "valid" : "invalid"}
            >
              At least one uppercase letter
            </li>
            <li
              key="pass-lower"
              className={passwordValidations.lower ? "valid" : "invalid"}
            >
              At least one lowercase letter
            </li>
            <li
              key="pass-number"
              className={passwordValidations.number ? "valid" : "invalid"}
            >
              At least one number
            </li>
            <li
              key="pass-special"
              className={passwordValidations.special ? "valid" : "invalid"}
            >
              At least one special character (!@#$)
            </li>
          </ul>
        )}
        <div className="errorBlock">
          <img src={ErrorIcon} alt="Error" />
          <span>{errorMessage}</span>
        </div>

        <div className="action">
          <button type="submit" className="action-button">
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
