import "./app.css";

import Logo from "./assets/icons/bigGreenLogo.png";

function App() {
  return (
    <div className="app">
      <div className="register-page">
        <div className="logo-side">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="buttons-side">
          <div className="btn-style signUp">Sign Up</div>
          <div className="btn-style signIn">Sign In</div>
          <div className="btn-style skipPassword">Skip Password</div>
        </div>
        <div className="version">v0.1.1</div>
      </div>
    </div>
  );
}

export default App;
