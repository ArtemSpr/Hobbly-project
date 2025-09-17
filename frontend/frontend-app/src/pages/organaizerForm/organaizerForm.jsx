import { useState, useNavigate } from "react";
import { Link } from "react-router-dom";
import "./organaizerForm.css";

import eyeIcon from "../../assets/icons/icons8-eye-48.png";
import eyeSlashIcon from "../../assets/icons/icons8-closed-eye-24.png";
import axios from "axios";

// ! TO DO : add space checker for description

const OrganaizerForm = () => {
  const navigate = useNavigate();
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

  const getStarted = async (e) => {
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

    try {
      const response = await axios.post(`/api/auth/register/org`, {
        NameValue,
        EmailValue,
        PasswordValue,
        LogoValue,
        DescriptionValue,
        AddressValue,
        CityValue,
        PostalCodeValue,
        IdentificationNumberValue,
        OrganizationTypeValue,
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
    <div className="card-org">
      <div className="card-image">
        <div className="back-button">
          <Link to="/signUp" className="back-link">
            ←
          </Link>
        </div>
        <h2 className="card-heading">
          Aloita
          <small>Luo järjestäjätilisi</small>
        </h2>
      </div>

      <form className="card-form" onSubmit={getStarted}>
        {/* Name */}
        <div className="userForm-input">
          <input
            type="text"
            placeholder="Organisaation koko nimi"
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
            <li>Nimen on oltava vähintään 3 merkkiä pitkä</li>
          </ul>
        )}

        {/* Email */}
        <div className="userForm-input">
          <input
            type="email"
            placeholder="Sähköposti"
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
            <li>Anna voimassa oleva sähköpostiosoite</li>
          </ul>
        )}

        {/* Password */}
        <div className="password-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Salasana"
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
              alt="Näytä tai piilota salasana"
            />
          </span>
        </div>
        {PasswordValue && (
          <ul className="password-checklist">
            <li className={PasswordValue.length >= 8 ? "valid" : ""}>
              Vähintään 8 merkkiä
            </li>
            <li className={/\d/.test(PasswordValue) ? "valid" : ""}>
              Vähintään yksi numero
            </li>
          </ul>
        )}

        {/* Description */}
        <div className="userForm-input">
          <input
            type="text"
            placeholder="Kuvaus"
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
            <li>Kuvauksen on oltava 25–300 merkkiä pitkä</li>
          </ul>
        )}

        {/* Address */}
        <div className="userForm-input">
          <input
            type="text"
            placeholder="Osoite"
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
            <li>Osoitteen on oltava vähintään 5 merkkiä pitkä</li>
          </ul>
        )}

        {/* City */}
        <div className="userForm-input">
          <input
            type="text"
            placeholder="Kaupunki"
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
            <li>Kaupunki on pakollinen tieto</li>
          </ul>
        )}

        {/* Postal Code */}
        <div className="userForm-input">
          <input
            type="text"
            placeholder="Postinumero"
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
            <li>Postinumeron on oltava 5–10 numeroa</li>
          </ul>
        )}

        {/* Identification Number */}
        <div className="userForm-input">
          <input
            type="text"
            placeholder="Tunnistenumero"
            value={IdentificationNumberValue}
            onChange={handleIdentificationNumberChange}
          />
        </div>

        {/* Organization Type */}
        <div className="userForm-input">
          <input
            type="text"
            list="organization-types"
            placeholder="Organisaation tyyppi"
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
            <option value="Yhdistys" />
            <option value="Yksityinen" />
            <option value="Osakeyhtiö" />
          </datalist>
        </div>
        {isOrganizationTypeInvalid && isOrganizationTypeTouched && (
          <ul className="password-checklist">
            <li>Valitse organisaation tyyppi</li>
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

export default OrganaizerForm;
