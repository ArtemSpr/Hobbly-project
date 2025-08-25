import "./forgotPassword.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Request reset for:", email);
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
        <button type="submit">Reset Password</button>
      </form>
      <div className="link-group">
        <Link to="/signIn">Back to Sign In</Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
