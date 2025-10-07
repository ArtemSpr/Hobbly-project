import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import "./addEvent.css";

// #TODO: Add this page to mobile version
// #TODO: Add response

const AddEvent = ({ userData, onData }) => {
  const [image, setImage] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    companyName: "",
    phone: "+358",
    title: "",
    address: "",
    eventType: "free", // 'free' or 'paid'
    maxCapacity: "",
    email: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const navigate = useNavigate();

  const MAX_DESCRIPTION_LENGTH = 750;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage({
        name: file.name,
        url: URL.createObjectURL(file),
      });
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case "date":
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today ? "" : "Date cannot be in the past";

      case "startTime":
      case "endTime":
        return value ? "" : "Time is required";

      case "companyName":
        return value.length >= 2
          ? ""
          : "Company name must be at least 2 characters";

      case "phone":
        const phoneRegex = /^\+358\d{7,10}$/;
        return phoneRegex.test(value)
          ? ""
          : "Phone must start with +358 and contain 7-10 digits";

      case "title":
        return value.length >= 3 ? "" : "Title must be at least 3 characters";

      case "address":
        return value.length >= 5 ? "" : "Address must be at least 5 characters";

      case "maxCapacity":
        const capacity = parseInt(value);
        return capacity > 0 ? "" : "Capacity must be greater than 0";

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value)
          ? ""
          : "Please enter a valid email address";

      case "description":
        return value.length <= MAX_DESCRIPTION_LENGTH
          ? ""
          : `Description exceeds ${MAX_DESCRIPTION_LENGTH} characters`;

      default:
        return "";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "phone") {
      if (value === "") {
        newValue = "+358";
      } else if (value.startsWith("+358")) {
        const digits = value.slice(4).replace(/\D/g, "");
        newValue = "+358" + digits;
      } else {
        // Don't update if trying to remove +358
        return;
      }
    }

    if (name === "maxCapacity") {
      if (value !== "" && !/^\d+$/.test(value)) {
        return;
      }
      newValue = value;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    const error = validateField(name, newValue);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleTimeValidation = () => {
    if (formData.startTime && formData.endTime) {
      const start = `2000-01-01T${formData.startTime}`;
      const end = `2000-01-01T${formData.endTime}`;

      if (start >= end) {
        setErrors((prev) => ({
          ...prev,
          endTime: "End time must be after start time",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          endTime: validateField("endTime", formData.endTime),
        }));
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    setTouched(
      Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    if (Object.keys(newErrors).length > 0) return;

    const dataToSend = {
      ...formData,
      imageUrl: image?.url || "",
      organizer: userData._id,
    };

    try {
      const response = await axios.post(`/api/events`, dataToSend);

      if (response.status === 200) {
        navigate("/navigation");
      }
    } catch (error) {
      if (error.response) {
        console.error(error.response?.data?.error || "Server error");
      } else if (error.request) {
        console.error("No response from server, please try again later");
      } else {
        console.error("An unexpected error occurred");
      }
    }

    onData(dataToSend, image);
  };

  return (
    <form className="addEvent-form" onSubmit={handleSubmit}>
      <div className="form-top">
        <div className="form-image-preview">
          <div className="image-block">
            {image && <img key={image.name} src={image.url} alt={image.name} />}
            <span className={`image-block-text ${image ? "hidden" : ""}`}>
              Image not selected yet
            </span>
          </div>
          <label htmlFor="fileInput" className="custom-upload">
            {image ? "Change image" : "Enter image"}
          </label>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>

        <div className="form-inputs">
          {/* Date Input */}
          <div className="input-group">
            <label htmlFor="date">Event Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`form-input ${
                errors.date && touched.date ? "error" : ""
              }`}
              required
            />
            {errors.date && touched.date && (
              <span className="error-message">{errors.date}</span>
            )}
          </div>

          {/* Start Time Input */}
          <div className="input-group">
            <label htmlFor="startTime">Start Time</label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              onBlur={(e) => {
                handleBlur(e);
                handleTimeValidation();
              }}
              className={`form-input ${
                errors.startTime && touched.startTime ? "error" : ""
              }`}
              required
            />
            {errors.startTime && touched.startTime && (
              <span className="error-message">{errors.startTime}</span>
            )}
          </div>

          {/* End Time Input */}
          <div className="input-group">
            <label htmlFor="endTime">End Time</label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              onBlur={(e) => {
                handleBlur(e);
                handleTimeValidation();
              }}
              className={`form-input ${
                errors.endTime && touched.endTime ? "error" : ""
              }`}
              required
            />
            {errors.endTime && touched.endTime && (
              <span className="error-message">{errors.endTime}</span>
            )}
          </div>

          {/* Company Name Input */}
          <div className="input-group">
            <label htmlFor="companyName">Company Name</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Enter company name"
              className={`form-input ${
                errors.companyName && touched.companyName ? "error" : ""
              }`}
              required
            />
            {errors.companyName && touched.companyName && (
              <span className="error-message">{errors.companyName}</span>
            )}
          </div>

          {/* Phone Input */}
          <div className="input-group">
            <label htmlFor="phone">Phone Number 🇫🇮</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="+358XXXXXXX"
              className={`form-input ${
                errors.phone && touched.phone ? "error" : ""
              }`}
              required
            />
            {errors.phone && touched.phone && (
              <span className="error-message">{errors.phone}</span>
            )}
          </div>

          {/* Title Input */}
          <div className="input-group">
            <label htmlFor="title">Event Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Enter event title"
              className={`form-input ${
                errors.title && touched.title ? "error" : ""
              }`}
              required
            />
            {errors.title && touched.title && (
              <span className="error-message">{errors.title}</span>
            )}
          </div>

          {/* Address Input */}
          <div className="input-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Enter event address"
              className={`form-input ${
                errors.address && touched.address ? "error" : ""
              }`}
              required
            />
            {errors.address && touched.address && (
              <span className="error-message">{errors.address}</span>
            )}
          </div>

          {/* Event Type Selection */}
          <div className="input-group">
            <label htmlFor="eventType">Event Type</label>
            <select
              id="eventType"
              name="eventType"
              value={formData.eventType}
              onChange={handleInputChange}
              className="form-input"
              required
            >
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          {/* Max Capacity Input */}
          <div className="input-group">
            <label htmlFor="maxCapacity">Maximum Capacity</label>
            <input
              type="text"
              id="maxCapacity"
              name="maxCapacity"
              value={formData.maxCapacity}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Enter maximum capacity"
              className={`form-input ${
                errors.maxCapacity && touched.maxCapacity ? "error" : ""
              }`}
              required
            />
            {errors.maxCapacity && touched.maxCapacity && (
              <span className="error-message">{errors.maxCapacity}</span>
            )}
          </div>

          {/* Email Input */}
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Enter email address"
              className={`form-input ${
                errors.email && touched.email ? "error" : ""
              }`}
              required
            />
            {errors.email && touched.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>
        </div>
      </div>

      <div className="form-bottom">
        {/* Description Input */}
        <div className="input-group description-group">
          <label htmlFor="description">Event Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Enter event description..."
            className={`form-textarea ${errors.description ? "error" : ""}`}
            rows="6"
            required
          />
          <div className="character-count">
            {formData.description.length}/{MAX_DESCRIPTION_LENGTH}
          </div>
          {errors.description && (
            <span className="error-message">{errors.description}</span>
          )}
        </div>

        {/* Submit Button */}
        <div className="submit-button-container">
          <button type="submit" className="publish-button">
            Publish Event
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddEvent;
