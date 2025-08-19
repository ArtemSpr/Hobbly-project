import "./singUp.css";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <div className="sing-up">
      <div className="role-title">Which account type do you need?</div>
      <div className="user-role-selector">
        <div className="role-buttons-container">
          <button className="role-button user-button">
            <Link to="/user-form">User</Link>
          </button>
          <button className="role-button organizer-button">
            <Link to="/organizer-form">Organizer</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
