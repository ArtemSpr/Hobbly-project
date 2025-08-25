import { Link } from "react-router-dom";
import "./navigation.css";

const Navigation = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/signIn">Sign In</Link>
        </li>
        <li>
          <Link to="/signUp">Sign Up</Link>
        </li>
        <li>
          <Link to="/forgot-password">Forgot Password</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
