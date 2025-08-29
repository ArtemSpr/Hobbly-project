import "./signIn.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import eyeIcon from "../../assets/icons/icons8-eye-48.png";
import eyeSlashIcon from "../../assets/icons/icons8-closed-eye-24.png";



const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });

  const [showPassword, setShowPassword] = useState(false); 

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sign In Data:", formData);
    navigate("/home");
  };

  return (
    <div className="sign-in-container">
      <h2>Sign In</h2>
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
    <img
      src={showPassword ? eyeSlashIcon : eyeIcon}
      alt="Toggle password visibility"
      width="20"
      height="20"
    />
  </span>
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
    </div>
  );
};

export default SignIn;
