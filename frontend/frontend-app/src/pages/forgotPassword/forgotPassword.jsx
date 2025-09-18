import "./forgotPassword.css";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import ErrorIcon from "../../assets/icons/error.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

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

    try {
      const response = await axios.post("/api/auth/forgotPassword", {
        email,
      });

      if (response.status === 200) {
        console.log("Vefification password sended to email", email);
        navigate("/passwordVerif");
      }
    } catch (error) {
      if (error.response) {
        console.error("Server Error:", error.response.data);
        setErrorMessage(error.response?.data?.error || "Server error");
      } else if (error.request) {
        console.error("No response from server:", error.request);
        setErrorMessage("No response from server, please try again later");
      } else {
        console.error("Error:", error.message);
        setErrorMessage("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="forgot-container">
      <h2>Forgot Password?</h2>
      <p>Enter your registered email address to reset your password.</p>
      <form onSubmit={handleSubmit} className="forgot-form">
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="errorBlock">
          <img src={ErrorIcon}></img>
          <span>{errorMessage}</span>
        </div>
        <button type="submit">Reset Password</button>
      </form>
      <div className="link-group">
        <Link to="/signIn">Back to Sign In</Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
