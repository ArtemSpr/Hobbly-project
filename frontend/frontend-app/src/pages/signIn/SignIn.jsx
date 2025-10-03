import "./signIn.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import ErrorIcon from "../../assets/icons/error.png";

const SignIn = ({ sendDataToParent }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorActive, setErrorActive] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      validatePassword(value);
    }
  };

  const validatePassword = (password) => {
    const validations = {
      length: password.length >= 8 && password.length <= 20,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordValidations(validations);
  };

  useEffect(() => {
    setErrorActive(Boolean(errorMessage));
  }, [errorMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`/api/auth/login`, formData);
      sendDataToParent(response.data.user);

      if (response.status === 200) {
        setErrorMessage("");
        navigate("/navigation");
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response?.data?.error || "Server error");
      } else if (error.request) {
        setErrorMessage("No response from server, please try again later");
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="sign-in-container">
      <h2>Sign In</h2>
      <div className="back-button-sign">
        <Link to="/" className="back-link">
          ←
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="sign-in-form">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <div className="password-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <span
            className="password-toggle-icon"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <div className={`errorBlock ${errorActive ? "active" : ""}`}>
          <img src={ErrorIcon} alt="Error" />
          <span>{errorMessage}</span>
        </div>

        {formData.password && (
          <ul className="password-checklist">
            <li className={passwordValidations.length ? "valid" : "invalid"}>
              8–20 characters
            </li>
            <li className={passwordValidations.upper ? "valid" : "invalid"}>
              At least one uppercase letter
            </li>
            <li className={passwordValidations.lower ? "valid" : "invalid"}>
              At least one lowercase letter
            </li>
            <li className={passwordValidations.number ? "valid" : "invalid"}>
              At least one number
            </li>
            <li className={passwordValidations.special ? "valid" : "invalid"}>
              At least one special character (!@#$...)
            </li>
          </ul>
        )}

        <button type="submit">Sign In</button>
      </form>

      <div className="sign-in-links">
        <Link to="/signup">Don't have an account? Sign Up</Link>
        <br />
        <Link to="/forgot-password">Forgot Password?</Link>
      </div>
      <footer>© 2025 Hobbly. All rights reserved.</footer>
    </div>
  );
};

export default SignIn;
