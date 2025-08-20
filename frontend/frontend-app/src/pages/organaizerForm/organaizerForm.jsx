import { useState } from "react";
import "./organaizerForm.css";

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

    // перевірка всіх обов'язкових полів
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
      // можна показати alert або просто не відправляти форму
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

    // скидання форми
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
        <h2 className="card-heading">
          Get started
          <small>Let us create your Organaizer account</small>
        </h2>
      </div>
      <form className="card-form" onSubmit={getStarted}>
        {/* Name */}
        <div className="input">
          <input
            type="text"
            className={`input-field ${isNameInvalid ? "input-field-red" : ""}`}
            value={NameValue}
            onChange={handleNameChanges}
          />
          <label className="input-label">Full Organization Name</label>
          {isNameInvalid && (
            <p className="error-text">Name must be at least 3 characters</p>
          )}
        </div>

        {/* Email */}
        <div className="input">
          <input
            type="email"
            className={`input-field ${isEmailInvalid ? "input-field-red" : ""}`}
            value={EmailValue}
            onChange={handleEmailChange}
          />
          <label className="input-label">Email</label>
          {isEmailInvalid && (
            <p className="error-text">Please enter a valid email</p>
          )}
        </div>

        {/* Password */}
        <div className="input">
          <input
            type="password"
            className={`input-field ${
              isPasswordInvalid ? "input-field-red" : ""
            }`}
            value={PasswordValue}
            onChange={handlePasswordChange}
          />
          <label className="input-label">Password</label>
          {isPasswordInvalid && (
            <p className="error-text">
              Password must be at least 8 characters and contain a number
            </p>
          )}
        </div>

        {/* Logo */}
        <div className="input">
          <input
            type="file"
            accept="image/png, image/jpeg"
            className="input-field"
            onChange={logoChecker}
          />
          <label className="input-label">Logo</label>
        </div>

        {/* Description */}
        <div className="input">
          <input
            type="text"
            className={`input-field ${
              isDescriptionInvalid ? "input-field-red" : ""
            }`}
            value={DescriptionValue}
            onChange={descriptionChecker}
          />
          <label className="input-label">Description</label>
          {isDescriptionInvalid && (
            <p className="error-text">Description must be 25–300 characters</p>
          )}
        </div>

        {/* Address */}
        <div className="input">
          <input
            type="text"
            className={`input-field ${
              isAddressInvalid ? "input-field-red" : ""
            }`}
            value={AddressValue}
            onChange={handleAddressChange}
          />
          <label className="input-label">Address</label>
          {isAddressInvalid && (
            <p className="error-text">Address must be at least 5 characters</p>
          )}
        </div>

        {/* City */}
        <div className="input">
          <input
            type="text"
            className={`input-field ${isCityInvalid ? "input-field-red" : ""}`}
            value={CityValue}
            onChange={handleCityChange}
          />
          <label className="input-label">City</label>
          {isCityInvalid && <p className="error-text">City is required</p>}
        </div>

        {/* Postal Code */}
        <div className="input">
          <input
            type="text"
            className={`input-field ${
              isPostalCodeInvalid ? "input-field-red" : ""
            }`}
            value={PostalCodeValue}
            onChange={handlePostalCodeChange}
          />
          <label className="input-label">Postal Code</label>
          {isPostalCodeInvalid && (
            <p className="error-text">Postal code must be 5–10 digits</p>
          )}
        </div>

        {/* Identification Number */}
        <div className="input">
          <input
            type="text"
            className="input-field"
            value={IdentificationNumberValue}
            onChange={handleIdentificationNumberChange}
          />
          <label className="input-label">Identification Number</label>
        </div>

        {/* Organization Type */}
        <div className="input">
          <input
            type="text"
            list="organization-types"
            className={`input-field ${
              isOrganizationTypeInvalid ? "input-field-red" : ""
            }`}
            value={OrganizationTypeValue}
            onChange={handleOrganizationTypeChange}
          />
          <datalist id="organization-types">
            <option value="Association" />
            <option value="Private" />
            <option value="Limited company" />
          </datalist>
          <label className="input-label">Organization Type</label>
          {isOrganizationTypeInvalid && (
            <p className="error-text">Please select organization type</p>
          )}
        </div>

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
