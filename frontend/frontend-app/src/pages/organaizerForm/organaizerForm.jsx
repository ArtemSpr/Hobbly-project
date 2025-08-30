import { useState } from "react";
import { Link } from "react-router-dom";
import "./organaizerForm.css";

import eyeIcon from "../../assets/icons/icons8-eye-48.png";
import eyeSlashIcon from "../../assets/icons/icons8-closed-eye-24.png";

// ! TO DO : add space checker for description

const OrganaizerForm = () => {
  const [NameValue, setNameValue] = useState("");
  const [EmailValue, setEmailValue] = useState("");
  const [PasswordValue, setPasswordValue] = useState("");
  const [LogoValue, setLogoValue] = useState(null);
  const [LogoName, setLogoName] = useState("");
  const [DescriptionValue, setDescriptionValue] = useState("");
  const [AddressValue, setAddressValue] = useState("");
  const [CityValue, setCityValue] = useState("");
  const [PostalCodeValue, setPostalCodeValue] = useState("");
  const [IdentificationNumberValue, setIdentificationNumberValue] =
    useState("");
  const [OrganizationTypeValue, setOrganizationTypeValue] = useState("");

  const [isNameInvalid, setIsNameInvalid] = useState(false);
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);
  const [isLogoInvalid, setIsLogoInvalid] = useState(false);
  const [isDescriptionInvalid, setIsDescriptionInvalid] = useState(false);
  const [isAddressInvalid, setIsAddressInvalid] = useState(false);
  const [isCityInvalid, setIsCityInvalid] = useState(false);
  const [isPostalCodeInvalid, setIsPostalCodeInvalid] = useState(false);
  const [isOrganizationTypeInvalid, setIsOrganizationTypeInvalid] =
    useState(false);

  // Додаткові стани для touched і password toggle
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
    setIsPasswordInvalid(!value || value.length < 8 || !/\d/.test(value));
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

  const getStarted = (e) => {
    e.preventDefault();

    const isFormInvalid =
      !NameValue ||
      !EmailValue ||
      !PasswordValue ||
      !LogoValue ||
      !DescriptionValue ||
      !AddressValue ||
      !CityValue ||
      !PostalCodeValue ||
      !OrganizationTypeValue ||
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

    console.log("Name:", NameValue);
    console.log("Email:", EmailValue);
    console.log("Password:", PasswordValue);
    console.log("Logo:", LogoValue);
    console.log("Description:", DescriptionValue);
    console.log("Address:", AddressValue);
    console.log("City:", CityValue);
    console.log("Postal Code:", PostalCodeValue);
    console.log("ID Number:", IdentificationNumberValue);
    console.log("Organization Type:", OrganizationTypeValue);

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
  };

  return (
    <div className="card-org">
      <div className="card-image">
        <div className="back-button">
          <Link to="/signUp" className="back-link">
            ←
          </Link>
        </div>
        <h2 className="card-heading">
          Get started
          <small>Let us create your Organizer account</small>
        </h2>
      </div>

      <form className="card-form" onSubmit={getStarted}>
        {/* Name */}
        <div className="userForm-input">
          <input
            type="text"
            placeholder="Full Organization Name"
            value={NameValue}
            onChange={handleNameChanges}
            onBlur={() => setIsNameTouched(true)}
            className={`input-field ${
              isNameInvalid && isNameTouched ? "input-field-red" : ""
            }`}
          />
        </div>
        {isNameInvalid && isNameTouched && (
          <ul className="password-checklist">
            <li>Name must be at least 3 characters</li>
          </ul>
        )}

        {/* Email */}
        <div className="userForm-input">
          <input
            type="email"
            placeholder="Email"
            value={EmailValue}
            onChange={handleEmailChange}
            onBlur={() => setIsEmailTouched(true)}
            className={`input-field ${
              isEmailInvalid && isEmailTouched ? "input-field-red" : ""
            }`}
          />
        </div>
        {isEmailInvalid && isEmailTouched && (
          <ul className="password-checklist">
            <li>Please enter a valid email</li>
          </ul>
        )}

        {/* Password */}
        <div className="password-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={PasswordValue}
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
              alt="Toggle password"
            />
          </span>
        </div>
        {PasswordValue && (
          <ul className="password-checklist">
            <li className={PasswordValue.length >= 8 ? "valid" : ""}>
              8+ characters
            </li>
            <li className={/\d/.test(PasswordValue) ? "valid" : ""}>
              At least one number
            </li>
          </ul>
        )}

        {/* Description */}
        <div className="userForm-input">
          <input
            type="text"
            placeholder="Description"
            value={DescriptionValue}
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
            <li>Description must be 25–300 characters</li>
          </ul>
        )}

        {/* Address */}
        <div className="userForm-input">
          <input
            type="text"
            placeholder="Address"
            value={AddressValue}
            onChange={handleAddressChange}
            onBlur={() => setIsAddressTouched(true)}
            className={`input-field ${
              isAddressInvalid && isAddressTouched ? "input-field-red" : ""
            }`}
          />
        </div>
        {isAddressInvalid && isAddressTouched && (
          <ul className="password-checklist">
            <li>Address must be at least 5 characters</li>
          </ul>
        )}

        {/* City */}
        <div className="userForm-input">
          <input
            type="text"
            placeholder="City"
            value={CityValue}
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
            value={PostalCodeValue}
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
            value={IdentificationNumberValue}
            onChange={handleIdentificationNumberChange}
          />
        </div>

        {/* Organization Type */}
        <div className="userForm-input">
          <input
            type="text"
            list="organization-types"
            placeholder="Organization Type"
            value={OrganizationTypeValue}
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
            <option value="Limited company" />
          </datalist>
        </div>
        {isOrganizationTypeInvalid && isOrganizationTypeTouched && (
          <ul className="password-checklist">
            <li>Please select organization type</li>
          </ul>
        )}

        <div className="action">
          <button type="submit" className="action-button">
            Get started
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrganaizerForm;
