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

      if (response.status === 200) {
        console.log("✅ Login Successful:", response.data);
        navigate("/navigation");
      }
    } catch (error) {
      if (error.response) {
        console.error("Server Error:", error.response.data);
        alert(
          error.response.data.error ||
            "Login failed. Please check your credentials."
        );
      } else if (error.request) {
        console.error("No response from server:", error.request);
        alert("Server is not responding. Please try again later.");
      } else {
        console.error("Error:", error.message);
        alert("An unexpected error occurred.");
      }
    }
    console.log("Sign In Data:", formData);
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
