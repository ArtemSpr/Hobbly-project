import "./signIn.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        formData
      );
      console.log("Sign In Response:", response.data);
    } catch (error) {}
    console.log("Sign In Data:", formData);

    navigate("/");
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
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
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
