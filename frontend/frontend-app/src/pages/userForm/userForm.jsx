import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import eyeIcon from "../../assets/icons/icons8-eye-48.png";
import eyeSlashIcon from "../../assets/icons/icons8-closed-eye-24.png";

import "./userForm.css";

const UserForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isNameTouched, setIsNameTouched] = useState(false);
  const [isEmailTouched, setIsEmailTouched] = useState(false);
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });

  const isNameInvalid = name.length < 3;
  const isEmailInvalid = !email || !/\S+@\S+\.\S+/.test(email);
  const isPasswordInvalid =
    !passwordValidations.length ||
    !passwordValidations.upper ||
    !passwordValidations.lower ||
    !passwordValidations.number ||
    !passwordValidations.special;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsNameTouched(true);
    setIsEmailTouched(true);
    setIsPasswordTouched(true);

    if (isNameInvalid || isEmailInvalid || isPasswordInvalid) return;

    try {
      const response = await axios.post(`/api/auth/register/user`, {
        name,
        email,
        password,
      });

      if (response.status === 201) {
        console.log("Registration successful:", response.data);
        navigate("/navigation");
      }
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="card">
      <div className="card-image">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="back-button"
        >
          ←
        </button>
        <h2 className="card-heading">
          Aloita
          <small>Luo käyttäjätilisi</small>
        </h2>
      </div>

      <form className="card-form" onSubmit={handleSubmit}>
        {/* Full name */}
        <div className="userForm-input">
          <input
            type="text"
            name="name"
            placeholder="Koko nimi"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setIsNameTouched(true)}
            className={`input-field ${
              isNameInvalid && isNameTouched ? "input-field-red" : ""
            }`}
          />
        </div>
        {isNameInvalid && isNameTouched && (
          <ul className="password-checklist">
            <li>Nimen on oltava vähintään 3 merkkiä pitkä</li>
          </ul>
        )}

        {/* Email */}
        <div className="userForm-input">
          <input
            type="email"
            name="email"
            placeholder="Sähköposti"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setIsEmailTouched(true)}
            className={`input-field ${
              isEmailInvalid && isEmailTouched ? "input-field-red" : ""
            }`}
          />
        </div>
        {isEmailInvalid && isEmailTouched && (
          <ul className="password-checklist">
            <li>Anna voimassa oleva sähköpostiosoite</li>
          </ul>
        )}

        {/* Password */}
        <div className="password-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Salasana"
            value={password}
            onChange={handlePasswordChange}
            onBlur={() => setIsPasswordTouched(true)}
            className={`input-field ${
              isPasswordInvalid && isPasswordTouched ? "input-field-red" : ""
            }`}
          />
          <span
            className="password-toggle-icon"
            onClick={() => setShowPassword((p) => !p)}
          >
            <img
              src={showPassword ? eyeSlashIcon : eyeIcon}
              alt="Näytä tai piilota salasana"
            />
          </span>
        </div>
        {password && (
          <ul className="password-checklist">
            <li className={passwordValidations.length ? "valid" : "invalid"}>
              8–20 merkkiä
            </li>
            <li className={passwordValidations.upper ? "valid" : "invalid"}>
              Vähintään yksi iso kirjain
            </li>
            <li className={passwordValidations.lower ? "valid" : "invalid"}>
              Vähintään yksi pieni kirjain
            </li>
            <li className={passwordValidations.number ? "valid" : "invalid"}>
              Vähintään yksi numero
            </li>
            <li className={passwordValidations.special ? "valid" : "invalid"}>
              Vähintään yksi erikoismerkki (!@#$)
            </li>
          </ul>
        )}

        <div className="action">
          <button type="submit" className="action-button">
            Rekisteröidy
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
