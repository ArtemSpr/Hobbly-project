import "./account.css";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import ProfileImage from "../../assets/image/prof-1.jpg";

import CopyWhite from "../../assets/icons/copy-white.png";
import CopyGrey from "../../assets/icons/copy-grey.png";

import LogOut from "../../assets/icons/logOut-icon.png";

import HomeIcon from "../../assets/icons/home-white.svg";
import MapIcon from "../../assets/icons/map-white.svg";
import AccountIcon from "../../assets/icons/account-icon.png";

const Account = ({ userData }) => {
  const [copyIcon, setCopyIcon] = useState(CopyGrey);

  const [password, setPassword] = useState("");
  const [repPassword, setRepPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isPasswordTouched, setIsPasswordTouched] = useState(false);
  const [isRepPasswordTouched, setIsRepPasswordTouched] = useState(false);

  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });

  const isPasswordInvalid =
    !passwordValidations.length ||
    !passwordValidations.upper ||
    !passwordValidations.lower ||
    !passwordValidations.number ||
    !passwordValidations.special;

  const doPasswordsMatch = password === repPassword;

  const validatePassword = (pass) => {
    setPasswordValidations({
      length: pass.length >= 8 && pass.length <= 20,
      upper: /[A-Z]/.test(pass),
      lower: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
    });
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    setIsPasswordTouched(true);
    validatePassword(val);
  };

  const handleRepPasswordChange = (e) => {
    const val = e.target.value;
    setRepPassword(val);
    setIsRepPasswordTouched(true);
  };

  useEffect(() => {
    const passChecker = document.querySelector(".password-checklist");
    if (!passChecker) return;
    if (isPasswordTouched && isPasswordInvalid) {
      passChecker.classList.remove("hidden");
    } else {
      passChecker.classList.add("hidden");
    }
  }, [password, isPasswordTouched, isPasswordInvalid]);

  const copyToClipboard = () => {
    if (!userData?.email) return;
    navigator.clipboard.writeText(userData.email).then(() => {
      setCopyIcon(CopyWhite);
      setTimeout(() => setCopyIcon(CopyGrey), 1000);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPasswordTouched(true);
    setIsRepPasswordTouched(true);

    if (isPasswordInvalid || !doPasswordsMatch) return;

    const passwordInfo = {
      email: userData?.email,
      oldPassword: password,
      newPassword: repPassword,
    };

    if (
      !passwordInfo.email ||
      !passwordInfo.oldPassword ||
      !passwordInfo.newPassword
    ) {
      console.error("Some of passwordInfo values are not valid");
      return;
    }

    try {
      const response = await axios.put(
        "/api/user/changePassword",
        passwordInfo
      );
      if (response.status === 200) {
        setPassword("");
        setRepPassword("");
        alert("Password saved");
        console.log("Password saved:", repPassword);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Something went wrong");
    }
  };

  useEffect(() => {
    const passwordBoard = document.querySelector(".account-passwordChange");
    if (!userData) {
      passwordBoard.classList.add("hidden");
    }
  }, []);

  return (
    <div className="account-container">
      <div className="account-profile">
        <img src={ProfileImage} alt="Profile" />
        <div className="profile-info">
          <span className="profile-name">{userData?.name || "user"} </span>
          <span className="profile-email">
            {userData?.email || "userEmail@gmail.com"}{" "}
            <img
              src={copyIcon}
              onClick={copyToClipboard}
              alt="Copy email"
              style={{ cursor: "pointer", width: "18px" }}
            />
          </span>
        </div>
        <div className="profile-role">{userData?.role || "guest"}</div>
      </div>

      <div className="account-passwordChange">
        <form className="password-card-form" onSubmit={handleSubmit}>
          <div className="passwordChange-title">
            <span>Change Password</span>
          </div>
          <div className="passwordChange-content">
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => setIsPasswordTouched(true)}
                className={`input-field ${
                  isPasswordInvalid && isPasswordTouched
                    ? "input-field-red"
                    : ""
                }`}
              />
              <span
                className="password-toggle-icon"
                onClick={() => setShowPassword((p) => !p)}
                style={{ cursor: "pointer" }}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
            {password && (
              <ul className="password-checklist hidden">
                <li
                  className={passwordValidations.length ? "valid" : "invalid"}
                >
                  8–20 merkkiä
                </li>
                <li className={passwordValidations.upper ? "valid" : "invalid"}>
                  Vähintään yksi iso kirjain
                </li>
                <li className={passwordValidations.lower ? "valid" : "invalid"}>
                  Vähintään yksi pieni kirjain
                </li>
                <li
                  className={passwordValidations.number ? "valid" : "invalid"}
                >
                  Vähintään yksi numero
                </li>
                <li
                  className={passwordValidations.special ? "valid" : "invalid"}
                >
                  Vähintään yksi erikoismerkki (!@#$)
                </li>
              </ul>
            )}
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="repPassword"
                placeholder="Repeat password"
                value={repPassword}
                onChange={handleRepPasswordChange}
                onBlur={() => setIsRepPasswordTouched(true)}
                className={`input-field ${
                  !doPasswordsMatch && isRepPasswordTouched
                    ? "input-field-red"
                    : ""
                }`}
              />
              <span
                className="password-toggle-icon"
                onClick={() => setShowPassword((p) => !p)}
                style={{ cursor: "pointer" }}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
            {!doPasswordsMatch && isRepPasswordTouched && (
              <div className="password-checklist not-match">
                <li className="invalid">Passwords do not match</li>
              </div>
            )}

            <div className="passwordChange-buttons">
              <button
                type="button"
                className="passwordChange-cancel"
                onClick={() => {
                  setPassword("");
                  setRepPassword("");
                }}
              >
                Cancel
              </button>
              <button className="passwordChange-save" type="submit">
                Save
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="logOut-cont">
        <div className="logOut-el">
          <Link to="/navigation" className={"active"}>
            <img src={LogOut} alt="Home" />
            <span>LogOut</span>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="navigation-footer">
        <div className="footer-el">
          <Link to="/navigation" className={"active"}>
            <img src={HomeIcon} alt="Home" />
            <span>Kotisivu</span>
          </Link>
        </div>
        <div className="footer-el">
          <Link to="/map" className={"active"}>
            <img src={MapIcon} alt="Map" />
            <span>Kartta</span>
          </Link>
        </div>
        <div className="footer-el">
          <Link to="/account" className={"active"}>
            <img src={AccountIcon} alt="Account" />
            <span>Account</span>
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Account;
