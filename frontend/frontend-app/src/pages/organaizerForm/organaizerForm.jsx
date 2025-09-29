import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./organaizerForm.css";
import axios from "axios";

const OrganizerForm = ({ sendDataToParent }) => {
  const navigate = useNavigate();
  const [name, setNameValue] = useState("");
  const [email, setEmailValue] = useState("");
  const [password, setPasswordValue] = useState("");
  const [LogoValue, setLogoValue] = useState(null);
  const [LogoName, setLogoName] = useState("");
  const [description, setDescriptionValue] = useState("");
  const [address, setAddressValue] = useState("");
  const [city, setCityValue] = useState("");
  const [postalCode, setPostalCodeValue] = useState("");
  const [idNumber, setIdentificationNumberValue] = useState("");
  const [orgType, setOrganizationTypeValue] = useState("");

  const [isNameInvalid, setIsNameInvalid] = useState(false);
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });
  const [isPasswordInvalid, setIsPasswordInvalid] = useState("");
  const [isLogoInvalid, setIsLogoInvalid] = useState(false);
  const [isDescriptionInvalid, setIsDescriptionInvalid] = useState(false);
  const [isAddressInvalid, setIsAddressInvalid] = useState(false);
  const [isCityInvalid, setIsCityInvalid] = useState(false);
  const [isPostalCodeInvalid, setIsPostalCodeInvalid] = useState(false);
  const [isOrganizationTypeInvalid, setIsOrganizationTypeInvalid] =
    useState(false);

  const [isNameTouched, setIsNameTouched] = useState(false);
  const [isEmailTouched, setIsEmailTouched] = useState(false);
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);
  const [isDescriptionTouched, setIsDescriptionTouched] = useState(false);
  const [isAddressTouched, setIsAddressTouched] = useState(false);
  const [isCityTouched, setIsCityTouched] = useState(false);
  const [isPostalCodeTouched, setIsPostalCodeTouched] = useState(false);
  const [isOrganizationTypeTouched, setIsOrganizationTypeTouched] =
    useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleNameChanges = (e) => {
    const value = e.target.value;
    setNameValue(value);
    setIsNameInvalid(!value || value.length < 3);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmailValue(value);
    setIsEmailInvalid(!value || !/\S+@\S+\.\S+/.test(value));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPasswordValue(value);
    validatePassword(value);
  };

  const validatePassword = (password) => {
    const validations = {
      length: password.length >= 8 && password.length <= 20,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordValidations(validations);
  };

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddressValue(value);
    setIsAddressInvalid(!value || value.length < 5);
  };

  const handleCityChange = (e) => {
    const value = e.target.value;
    setCityValue(value);
    setIsCityInvalid(!value);
  };

  const handlePostalCodeChange = (e) => {
    const value = e.target.value;
    setPostalCodeValue(value);
    setIsPostalCodeInvalid(!value || !/^\d{5,10}$/.test(value));
  };

  const handleIdentificationNumberChange = (e) => {
    setIdentificationNumberValue(e.target.value);
  };

  const handleOrganizationTypeChange = (e) => {
    const value = e.target.value;
    setOrganizationTypeValue(value);
    setIsOrganizationTypeInvalid(!value);
  };

  const descriptionChecker = (e) => {
    const value = e.target.value;
    setDescriptionValue(value);
    setIsDescriptionInvalid(!value || value.length < 25 || value.length > 300);
  };

  const logoChecker = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setIsLogoInvalid(true);
      setLogoValue(null);
      setLogoName("");
      return;
    }

    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > 2) {
      alert("File size exceeds 2MB");
      e.target.value = null;
      setIsLogoInvalid(true);
      setLogoValue(null);
      setLogoName("");
    } else {
      setIsLogoInvalid(false);
      setLogoValue(file);
      setLogoName(file.name);
    }
  };

  const getStarted = async (e) => {
    e.preventDefault();

    const setIsPasswordInvalid = !(
      passwordValidations.length &&
      passwordValidations.upper &&
      passwordValidations.lower &&
      passwordValidations.number &&
      passwordValidations.special
    );

    const isFormInvalid =
      !name ||
      !email ||
      !password ||
      !description ||
      !address ||
      !city ||
      !postalCode ||
      !orgType ||
      isNameInvalid ||
      isEmailInvalid ||
      isPasswordInvalid ||
      isLogoInvalid ||
      isDescriptionInvalid ||
      isAddressInvalid ||
      isCityInvalid ||
      isPostalCodeInvalid ||
      isOrganizationTypeInvalid;

    if (isFormInvalid) {
      return;
    }

    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Logo:", LogoValue);
    console.log("Description:", description);
    console.log("Address:", address);
    console.log("City:", city);
    console.log("Postal Code:", postalCode);
    console.log("ID Number:", idNumber);
    console.log("Organization Type:", orgType);

    setNameValue("");
    setEmailValue("");
    setPasswordValue("");
    setLogoValue(null);
    setLogoName("");
    setDescriptionValue("");
    setAddressValue("");
    setCityValue("");
    setPostalCodeValue("");
    setIdentificationNumberValue("");
    setOrganizationTypeValue("");

    try {
      const response = await axios.post(`/api/auth/register/org`, {
        name,
        email,
        password,
        // LogoValue,
        description,
        address,
        city,
        postalCode,
        idNumber,
        orgType,
      });

      if (response.status === 201) {
        console.log("Registration successful:", response.data);
        sendDataToParent(response.data.user);
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
    <div className="card-org">
      <div className="card-image">
        <div className="back-button-sign">
          <Link to="/signUp" className="back-link">
            ←
          </Link>
        </div>
        <h2 className="card-heading">
          Start
          <small>Create your organizer account</small>
        </h2>
      </div>

      <form className="card-form" onSubmit={getStarted}>
        {/* Name */}
        <div className="userForm-input">
          <input
            type="text"
            placeholder="Organization full name"
            value={name}
            onChange={handleNameChanges}
            onBlur={() => setIsNameTouched(true)}
            className={`input-field ${
              isNameInvalid && isNameTouched ? "input-field-red" : ""
            }`}
          />
        </div>
        {isNameInvalid && isNameTouched && (
          <ul className="password-checklist">
            <li>Name must be at least 3 characters long</li>
          </ul>
        )}

        {/* Email */}
        <div className="userForm-input">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            onBlur={() => setIsEmailTouched(true)}
            className={`input-field ${
              isEmailInvalid && isEmailTouched ? "input-field-red" : ""
            }`}
          />
        </div>
        {isEmailInvalid && isEmailTouched && (
          <ul className="password-checklist">
            <li>Please enter a valid email address</li>
          </ul>
        )}

        {/* Password */}
        <div className="password-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            onBlur={() => setIsPasswordTouched(true)}
            className={`input-field ${
              isPasswordTouched && isPasswordInvalid ? "input-field-red" : ""
            }`}
          />
          <span
            className="password-toggle-icon"
            onClick={() => setShowPassword((p) => !p)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>
        {password && (
          <ul className="password-checklist">
            <li className={passwordValidations.length ? "valid" : "invalid"}>
              8–20 characters
            </li>
            <li className={passwordValidations.upper ? "valid" : "invalid"}>
              At least one uppercase letter
            </li>
            <li className={passwordValidations.lower ? "valid" : "invalid"}>
              At least one lowercase letter
            </li>
            <li className={passwordValidations.number ? "valid" : "invalid"}>
              At least one number
            </li>
            <li className={passwordValidations.special ? "valid" : "invalid"}>
              At least one special character (!@#$...)
            </li>
          </ul>
        )}

        {/* Description */}
        <div className="userForm-input">
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={descriptionChecker}
            onBlur={() => setIsDescriptionTouched(true)}
            className={`input-field ${
              isDescriptionInvalid && isDescriptionTouched
                ? "input-field-red"
                : ""
            }`}
          />
        </div>
        {isDescriptionInvalid && isDescriptionTouched && (
          <ul className="password-checklist">
            <li>Description must be 25–300 characters long</li>
          </ul>
        )}

        {/* Address */}
        <div className="userForm-input">
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={handleAddressChange}
            onBlur={() => setIsAddressTouched(true)}
            className={`input-field ${
              isAddressInvalid && isAddressTouched ? "input-field-red" : ""
            }`}
          />
        </div>
        {isAddressInvalid && isAddressTouched && (
          <ul className="password-checklist">
            <li>Address must be at least 5 characters long</li>
          </ul>
        )}

        {/* City */}
        <div className="userForm-input">
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={handleCityChange}
            onBlur={() => setIsCityTouched(true)}
            className={`input-field ${
              isCityInvalid && isCityTouched ? "input-field-red" : ""
            }`}
          />
        </div>
        {isCityInvalid && isCityTouched && (
          <ul className="password-checklist">
            <li>City is required</li>
          </ul>
        )}

        {/* Postal Code */}
        <div className="userForm-input">
          <input
            type="text"
            placeholder="Postal Code"
            value={postalCode}
            onChange={handlePostalCodeChange}
            onBlur={() => setIsPostalCodeTouched(true)}
            className={`input-field ${
              isPostalCodeInvalid && isPostalCodeTouched
                ? "input-field-red"
                : ""
            }`}
          />
        </div>
        {isPostalCodeInvalid && isPostalCodeTouched && (
          <ul className="password-checklist">
            <li>Postal code must be 5–10 digits</li>
          </ul>
        )}

        {/* Identification Number */}
        <div className="userForm-input">
          <input
            type="text"
            placeholder="Identification Number"
            value={idNumber}
            onChange={handleIdentificationNumberChange}
          />
        </div>

        {/* Organization Type */}
        <div className="userForm-input">
          <input
            type="text"
            list="organization-types"
            placeholder="Organization Type"
            value={orgType}
            onChange={handleOrganizationTypeChange}
            onBlur={() => setIsOrganizationTypeTouched(true)}
            className={`input-field ${
              isOrganizationTypeInvalid && isOrganizationTypeTouched
                ? "input-field-red"
                : ""
            }`}
          />
          <datalist id="organization-types">
            <option value="Association" />
            <option value="Private" />
            <option value="Limited Company" />
          </datalist>
        </div>
        {isOrganizationTypeInvalid && isOrganizationTypeTouched && (
          <ul className="password-checklist">
            <li>Please select an organization type</li>
          </ul>
        )}

        <div className="action">
          <button type="submit" className="action-button">
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrganizerForm;
