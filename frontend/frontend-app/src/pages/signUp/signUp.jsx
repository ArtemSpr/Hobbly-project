import "./signUp.css";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <div className="sign-up">
      <div className="role-title">Which account type do you need?</div>
      <div className="user-role-selector">
        <div className="role-buttons-container">
          <Link to="/user-form" className="role-button user-button">
            User
          </Link>
          <Link to="/organizer-form" className="role-button organizer-button">
            Organizer
          </Link>
        </div>
      </div>
      <footer>© 2025 YourApp. All rights reserved.</footer>
    </div>
  );
};

export default SignUp;
