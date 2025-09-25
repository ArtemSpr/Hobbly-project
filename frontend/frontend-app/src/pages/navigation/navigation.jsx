import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, use } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import axios from "axios";

import "./navigation.css";
import AddEvent from "./addEvent/addEvent";

// ---- LOGO ----
import Logo from "../../assets/icons/yellow-big-logo.png";
// ----- SEARCH BAR -----
import SearchGray from "../../assets/icons/search-grey.png";
// ---- ACCOUNT ----
import ProfileImage from "../../assets/image/prof-1.jpg";
import LogOut from "../../assets/icons/logOut-icon.png";
import ArrowLeft from "../../assets/icons/arrow-left-icon.png";
// ---- EVENT IMAGE ----
import ThirdEventImage from "../../assets/image/event-3.webp";
// ---- EVENT ICONS ----
import EventDate from "../../assets/icons/date-icon.png";
import EventCapa from "../../assets/icons/capacity-icon.png";
import EventStart from "../../assets/icons/clock-icon.png";
import EventEnd from "../../assets/icons/clock-icon-close.png";
import EventEmail from "../../assets/icons/email-icon.png";
import EventLink from "../../assets/icons/link-icon.png";
import EventPhone from "../../assets/icons/phone-icon.png";
import EventLocation from "../../assets/icons/location-icon.png";
import EventPrice from "../../assets/icons/price-icon.png";
// ---- FILTER ----
import FilterIcon from "../../assets/icons/filter-icon.png";
// ---- FOOTER ----
import HomeIcon from "../../assets/icons/home-white.svg";
import MapIcon from "../../assets/icons/map-white.svg";
import AccountIcon from "../../assets/icons/account-icon.png";

// #TODO: Active page will be highlighted in yellow
// #TODO: Move filter block to separate component

// #TODO: Organization page
// #TODO:   Adding new events

// #TODO: Admine page
// #TODO:   Dashboard

// #TODO: Server URL protection (користувач не може просто ввести в пошукову строку ендпоінт)
// #TODO: Скопіювати стиль зміни пароля до мобільної версії
// #FIXME: Change filter slider to list in tablets and desktop
// #IDEA: User can like events

function Navigation({ userData }) {
  const [events, setEvents] = useState([]);
  const [apiPage, setApiPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activeEventId, setActiveEventId] = useState(null);
  const [eventLocation, setEventLocation] = useState({
    contactEmail: "",
    contactPhone: "",
    coordinates: {
      latitude: "",
      longitude: "",
    },
    info_url: "",
    address: "",
    muni: "",
    district: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const eventRefs = useRef({});
  const [currentPage, setCurrentPage] = useState(1);
  const [keyWords, setKeyWords] = useState([]);
  const [eventLocations, setEventLocations] = useState([]);
  // ------- FILTER PANEL STATES -------
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [isCentered, setIsCentered] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [filterParams, setFilterParams] = useState([[], [], []]);
  const [apiLink, setApiLink] = useState(
    "https://api.hel.fi/linkedevents/v1/event/"
  );
  // ------- ACCOUNT STATES -------
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
  const [isElOpen, setIsElOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);

  // ======= FILTER PANEL =======

  const applyFilterButton = () => {
    setCurrentPage(1);
    toggleFilterPanel();
  };

  const declineFilterButton = () => {
    setCurrentPage(1);
    clearFilters();
    toggleFilterPanel();
  };

  const toggleFilterPanel = () => {
    if (!showFilterPanel) {
      setIsCentered(true);
      setTimeout(() => {
        setButtonVisible(false);
        setShowFilterPanel(true);
        setIsClosing(false);
      }, 400);
    } else {
      setIsClosing(true);

      setTimeout(() => {
        setShowFilterPanel(false);
        setIsClosing(false);
      }, 400);

      setButtonVisible(true);
      setTimeout(() => {
        setIsCentered(false);
      }, 300);
    }
  };

  // ====== FUNCTION THAT SWITCH PAGE WHEN USER SCROLLS TO BOTTOM ======
  const handleScroll = () => {
    const hasActiveFilters = filterParams.some(
      (paramArray) => paramArray.length > 0
    );

    if (
      window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 10 &&
      !loading &&
      !hasActiveFilters
    ) {
      fetchEvents(apiPage).then((addedNew) => {
        if (!addedNew) {
          setApiPage((prev) => prev + 1);
        } else {
          setApiPage((prev) => prev + 1);
        }
      });
    }
  };

  // ====== FUNCTION THAT FETCHES EVENTS FROM API ======
  const fetchEvents = async (page) => {
    setLoading(true);
    let addedNew = false;

    try {
      let requestUrl;
      if (apiLink.includes("?")) {
        requestUrl = `${apiLink}/&page=${page}`;
      } else {
        requestUrl = `${apiLink}/?page=${page}`;
      }

      console.log("Request URL: " + requestUrl);

      const response = await axios.get(requestUrl);
      const now = new Date();

      if (response.status === 200) {
        const newEvents = response.data.data.filter((event) => {
          const endTime = event.end_time ? new Date(event.end_time) : null;
          return (
            event.super_event === null && (endTime === null || endTime > now)
          );
        });

        setEvents((prev) => {
          const combined = [...prev, ...newEvents];
          const unique = combined.filter(
            (e, index, self) => index === self.findIndex((ev) => ev.id === e.id)
          );
          return unique;
        });
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }

    return addedNew;
  };

  useEffect(() => {
    if (events.length === 0) return;

    events.forEach(async (event) => {
      if (!event.location) return;

      const locationUrl = Array.isArray(event.location)
        ? event.location[0]["@id"]
        : event.location["@id"];

      try {
        const response = await axios.get(locationUrl);
        const coords = response.data.position?.coordinates;

        if (coords) {
          const locationData = {
            id: event.id,
            image:
              event.images && event.images.length > 0
                ? event.images[0].url
                : ThirdEventImage,
            name: event.name?.fi || event.name?.en || "No Name",
            latitude: coords[1],
            longitude: coords[0],
          };

          setEventLocations((prev) => {
            if (prev.some((loc) => loc.id === event.id)) {
              return prev;
            }
            return [...prev, locationData];
          });

          // for check
          console.log("Saved location:", locationData);
        }
      } catch (error) {
        console.error(`Failed to fetch location for event ${event.id}:`, error);
      }
    });
  }, [events]);

  // ====== FETCH EVENTS ON PAGE LOAD ======
  useEffect(() => {
    setApiPage((prev) => prev + 1);
    fetchEvents(apiPage);
  }, [events]);

  // ====== PAGINATION ARROWS SHOW/HIDE ======
  useEffect(() => {
    const pagArrows = document.getElementById("pagination-arrows");
    if (filteredEvents.slice(0, 20).length >= 20) {
      pagArrows.classList.remove("hidden");
    } else {
      pagArrows.classList.add("hidden");
    }
  }, [events]);

  // ====== SCROLL EVENTS HANDLER======
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, apiPage]);

  // ====== INFINITE SCROLL ======
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 10 &&
        !loading
      ) {
        setApiPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  // ====== HEADER HIDE/SHOW ON SCROLL ======
  useEffect(() => {
    let lastScroll = 0;
    const header = document.getElementById("main-header");
    const account = document.querySelector(".nav-account-profile");
    const logOut = document.querySelector(".nav-logOut-cont");
    if (!header || !account || !logOut) return;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll) {
        header.classList.add("hidden");
        account.classList.add("top");
        logOut.classList.add("fix");
      } else {
        header.classList.remove("hidden");
        account.classList.remove("top");
        logOut.classList.remove("fix");
      }
      lastScroll = currentScroll;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ===== SCROLL TO ACTIVE EVENT =====
  useEffect(() => {
    if (activeEventId && eventRefs.current[activeEventId]) {
      eventRefs.current[activeEventId].scrollIntoView({
        block: "start",
      });
    }
  }, [activeEventId]);

  // ===== FETCH EVENT LOCATION DETAILS =====
  const handleEventClick = async (event) => {
    console.log("Event clicked:", event);

    setActiveEventId((prev) => (prev === event.id ? null : event.id));

    const placeApiUrl = event.location["@id"];
    console.log("Place API URL:", placeApiUrl);

    try {
      const response = await axios.get(placeApiUrl);

      const locationData = {
        contactEmail: response.data.email || "",
        contactPhone: response.data.telephone?.fi || "",
        coordinates: {
          latitude: response.data.position.coordinates[0],
          longitude: response.data.position.coordinates[1],
        },
        info_url: response.data.info_url?.fi || "",
        address: response.data.street_address.fi || "",
        muni: response.data.divisions[1].municipality || "",
        district: response.data.divisions[1].name.fi || "",
      };
      console.log(locationData.coordinates);
      setEventLocation(locationData);
    } catch (error) {
      console.error("Failed to fetch location:", error);
    }
  };

  // ===== DATE & TIME SPLITTER =====
  function getDay(dateString) {
    return new Date(dateString).toISOString().split("T")[0];
  }

  function getTime(dateString) {
    return new Date(dateString).toISOString().split("T")[1].slice(0, 5);
  }

  // ===== SEARCH FUNCTIONALITY =====
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredEvents = events.filter((event) => {
    const name =
      typeof event.name.fi === "string"
        ? event.name.fi
        : typeof event.name.sv === "string"
        ? event.name.sv
        : typeof event.name.en === "string"
        ? event.name.en
        : "";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  //====== TRUNCATED TEXT ======
  function getTruncatedText(text, limit, link) {
    if (!text) return "No description available.";

    if (text.length > limit) {
      const words = text.split(" ");
      let truncated = "";
      for (let word of words) {
        if ((truncated + word).length > limit) break;
        truncated += (truncated ? " " : "") + word;
      }

      return truncated;
    }

    return text;
  }

  // ===== PAGINATION =====
  const eventsPerPage = 20;
  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;

  // ===== NEW PAGE SCROLL =====
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPage]);

  // ====== SLIDER SYNCRONIZATION ======

  const titleRef = useRef(null);
  const optionsRef = useRef(null);

  useEffect(() => {
    if (titleRef.current && optionsRef.current) {
      titleRef.current.sync(optionsRef.current.splide);
    }
  }, []);
  // ====================================
  // ========= BIG FILTER LOGIC =========
  // ====================================

  const filterTime = [
    "Uusin ensin",
    "Vanhin ensin",
    "Tännän",
    "Tämä viikko",
    "Tämä kuukausi",
    "Tämä vuonna",
  ];

  const districts = [
    { name: "Helsinki", value: "helsinki" },
    { name: "Espoo", value: "espoo" },
    { name: "Vantaa", value: "vantaa" },
    { name: "Kauniainen", value: "kauniainen" },
    { name: "Pasila", value: "pasila" },
    { name: "Kallio", value: "kallio" },
    { name: "Pitäjänmäki", value: "pitajanmaki" },
    { name: "Taka-Töölö", value: "taka-toolo" },
    { name: "Vartiokylä", value: "vartiokyla" },
    { name: "Vallila", value: "vallila" },
  ];

  const keywords = [
    "Konsertti",
    "Näyttely",
    "Festivaali",
    "Seminaari",
    "Työpaja",
    "Näytelmä",
    "Markkinat",
    "Tapaaminen",
    "Esittely",
    "Juhla",
    "Luento",
    "Workshop",
    "Konferenssi",
    "Elokuvanäytös",
    "Kokous",
    "Urheilutapahtuma",
    "Lastentapahtuma",
  ];

  const filterTimeHandler = (value) => {
    try {
      setFilterParams((prev) => {
        const newParams = [...prev];
        newParams[0] = [];

        switch (value) {
          case "Uusin ensin":
            newParams[0] = ["sort=-start_time"];
            break;

          case "Vanhin ensin":
            newParams[0] = ["sort=start_time"];
            break;

          case "Tännän":
            const today = new Date().toISOString().split("T")[0];
            newParams[0] = [`start=${today}`, `end=${today}`];
            break;

          case "Tämä viikko":
            const startOfWeek = new Date();
            const endOfWeek = new Date();
            endOfWeek.setDate(startOfWeek.getDate() + 7);
            newParams[0] = [
              `start=${startOfWeek.toISOString().split("T")[0]}`,
              `end=${endOfWeek.toISOString().split("T")[0]}`,
            ];
            break;

          case "Tämä kuukausi":
            const startOfMonth = new Date();
            const endOfMonth = new Date();
            endOfMonth.setDate(startOfMonth.getDate() + 30);
            newParams[0] = [
              `start=${startOfMonth.toISOString().split("T")[0]}`,
              `end=${endOfMonth.toISOString().split("T")[0]}`,
            ];
            break;

          case "Tämä vuonna":
            newParams[0] = ["start=2025-01-01", "end=2025-12-31"];
            break;

          default:
            break;
        }

        return newParams;
      });
      console.log("Time filter was successfully added");
    } catch (error) {
      console.log("Something went wrong while time filter adding: " + error);
    }
  };

  const filterPlaceHandler = (districtObj) => {
    try {
      setFilterParams((prev) => {
        const newParams = [...prev];
        const districtValue = districtObj.value || districtObj;

        if (newParams[1].includes(districtValue)) {
          newParams[1] = newParams[1].filter((item) => item !== districtValue);
        } else {
          newParams[1] = [...newParams[1], districtValue];
        }

        console.log("Updated filterParams:", newParams);
        return newParams;
      });
      console.log("Place filter was successfully updated");
    } catch (error) {
      console.log("Something went wrong while place filter updating: " + error);
    }
  };

  const filterKeywordHandler = (value) => {
    try {
      setFilterParams((prev) => {
        const newParams = [...prev];
        const lowerCaseValue = value.toLowerCase();

        if (newParams[2].includes(lowerCaseValue)) {
          newParams[2] = newParams[2].filter((item) => item !== lowerCaseValue);
        } else {
          newParams[2] = [...newParams[2], lowerCaseValue];
        }

        return newParams;
      });
      console.log("Keyword filter was successfully updated");
    } catch (error) {
      console.log(
        "Something went wrong while keyword filter updating: " + error
      );
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    const hasAnyFilters = filterParams.some(
      (paramArray) => paramArray && paramArray.length > 0
    );
    console.log("filterParams changed:", filterParams);

    if (hasAnyFilters) {
      filterLinkSwitching();
    } else {
      const baseUrl = "https://api.hel.fi/linkedevents/v1/event/";
      setApiLink(baseUrl);
      console.log("All filters cleared, reset to base URL");
    }
  }, [filterParams]);

  const filterLinkSwitching = () => {
    try {
      console.log("Current filterParams in filterLinkSwitching:", filterParams);

      const timeFilterArray = filterParams[0] || [];
      const placeFilterArray = (filterParams[1] || []).map(
        (p) => `location=${p}`
      );
      const keywordFilterArray = (filterParams[2] || []).map(
        (k) => `keyword=${k}`
      );

      const allParams = [
        ...timeFilterArray,
        ...placeFilterArray,
        ...keywordFilterArray,
      ].filter((param) => param && param.trim() !== "");

      console.log("All params for URL:", allParams);

      const baseUrl = "https://api.hel.fi/linkedevents/v1/event/";

      if (allParams.length > 0) {
        const queryString = allParams.join("&");
        setApiLink(`${baseUrl}?${queryString}`);
        console.log("New API URL:", `${baseUrl}?${queryString}`);
      } else {
        setApiLink(baseUrl);
        console.log("Reset to base URL:", baseUrl);
      }

      setEvents([]);
      setApiPage(1);
    } catch (error) {
      console.log("Error in filterLinkSwitching: " + error);
    }
  };

  const clearFilters = () => {
    setFilterParams([[], [], []]);
    setApiLink("https://api.hel.fi/linkedevents/v1/event/");
    setEvents([]);
    setApiPage(1);
    setCurrentPage(1);
  };

  // ========= ACCOUNT FUNCTIONS =========

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

  // ------ GUEST ROLE ------
  useEffect(() => {
    const passwordBoard = document.querySelector(".account-passwordChange");
    if (!userData) {
      passwordBoard.classList.add("hidden");
    }
  }, []);
  // ------ ORGANIZER ROLE ------
  useEffect(() => {
    const addEvents = document.querySelector(".add-events-cont");

    if (userData?.role === "organizer") {
      addEvents.classList.add("shown");
    }
  }, []);

  if (isCreateEventOpen) {
    document.documentElement.classList.add("fixed");
  } else {
    document.documentElement.classList.remove("fixed");
  }

  return (
    <div className="navigation">
      {/* ========== NAVIGATION ACCOUNT ==========*/}
      <div className="navigation-account">
        <div className="nav-account-profile">
          <img src={ProfileImage} alt="Profile" />
          <div className="nav-profile-info">
            <span className="profile-name">{userData?.name || "user"} </span>
            <span className="profile-email">
              {userData?.email || "userEmail@gmail.com"}{" "}
            </span>
          </div>
          <div className="profile-role">{userData?.role || "guest"}</div>
        </div>

        {/* --------- PASSWORD CHANGING --------- */}
        <div className="account-passwordChange">
          <div
            className="showHide-block"
            onClick={() => {
              setIsElOpen(!isElOpen);
            }}
          >
            <span>
              {isElOpen ? "Hide password chanage" : "Show password chanage"}
            </span>
            <img
              src={ArrowLeft}
              className={`passwordIcon ${isElOpen ? "rotated" : ""}`}
            ></img>
          </div>
          <form
            className={`password-card-form ${isElOpen ? "show" : "hide"}`}
            onSubmit={handleSubmit}
          >
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
                  <li
                    className={passwordValidations.upper ? "valid" : "invalid"}
                  >
                    Vähintään yksi iso kirjain
                  </li>
                  <li
                    className={passwordValidations.lower ? "valid" : "invalid"}
                  >
                    Vähintään yksi pieni kirjain
                  </li>
                  <li
                    className={passwordValidations.number ? "valid" : "invalid"}
                  >
                    Vähintään yksi numero
                  </li>
                  <li
                    className={
                      passwordValidations.special ? "valid" : "invalid"
                    }
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
        {/* --------- ADDING NEW EVENTS --------- */}
        <div
          className="add-events-cont"
          onClick={() => setIsCreateEventOpen(!isCreateEventOpen)}
        >
          Create own event
        </div>
        <div className="nav-logOut-cont">
          <div className="logOut-el">
            <Link to="/" className={"active"}>
              <img src={LogOut} alt="Home" />
              <span>LogOut</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="navigation-cont">
        {/* ============ HEADER START ============ */}
        <header id="main-header" className="navi-header">
          <div className="navi-logo">
            <img src={Logo} alt="Logo" />
          </div>
          <div
            className={`search-container ${isCreateEventOpen ? "hide" : ""}`}
          >
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Hae tapahtumia..."
                value={searchTerm}
                onChange={(e) => handleSearch(e)}
              />
              <img src={SearchGray} alt="Search" className="search-icon" />
            </div>
          </div>
        </header>

        {/* ============ MAIN START ============ */}
        <main className="main-content" ref={containerRef}>
          <div
            className={`create-event-cont ${isCreateEventOpen ? "" : "hide"}`}
          >
            <AddEvent userData={userData} />
          </div>
          <div
            className={`event-cards-container ${
              isCreateEventOpen ? "hide" : ""
            }`}
          >
            {filteredEvents.slice(startIndex, endIndex).map((event) => (
              <div
                ref={(el) => (eventRefs.current[event.id] = el)}
                className={`event-card ${
                  activeEventId === event.id ? "active" : ""
                }`}
                key={event.id}
                onClick={() =>
                  handleEventClick(event, eventRefs.current[event.id])
                }
              >
                <div className="event-card-image">
                  <img
                    src={
                      event.images && event.images[0]
                        ? event.images[0].url
                        : ThirdEventImage
                    }
                    alt={
                      event.name?.fi ||
                      event.name?.sv ||
                      event.name?.en ||
                      "Event"
                    }
                  />
                </div>
                <div className="event-card-content">
                  <div className="org-name">
                    {event.provider?.fi ||
                      event.provider?.sv ||
                      event.provider?.en ||
                      "Company"}
                  </div>
                  <div className="event-title">
                    {event.name?.fi ||
                      event.name?.sv ||
                      event.name?.en ||
                      "Event title"}
                  </div>

                  <div className="card-detail-info">
                    <div
                      className={`event-time ${
                        activeEventId === event.id ? "shown" : ""
                      }`}
                    >
                      <div className="event-date">
                        <img src={EventDate} alt="Event Date" />
                        <span>{getDay(event.start_time)}</span>{" "}
                      </div>
                      <div className="event-start-time">
                        <img src={EventStart} alt="Start Time" />
                        <span>{getTime(event.start_time)}</span>
                      </div>
                      <div className="event-end-time">
                        <img src={EventEnd} alt="End Time" />
                        <span>{getTime(event.end_time)}</span>
                      </div>
                    </div>

                    <div
                      className={`event-location ${
                        activeEventId === event.id ? "shown" : ""
                      }`}
                    >
                      <div className="event-contact">
                        <div className="event-email">
                          <img src={EventEmail} alt="Event Email" />
                          {eventLocation.contactEmail || "Tuntematon"}
                        </div>
                        <div className="event-phone">
                          <img src={EventPhone} alt="Event Phone" />
                          {eventLocation.contactPhone || "Tuntematon"}
                        </div>
                      </div>
                      <div className="event-bonus-info">
                        <div className="event-address">
                          <img src={EventLocation} alt="Event Address" />
                          {eventLocation.address || "Tuntematon"}
                        </div>

                        <div
                          className={`event-capacity ${
                            activeEventId === event.id ? "shown" : ""
                          }`}
                        >
                          <img src={EventCapa} alt="Event Capacity" />
                          {event.maximum_capacity || "Tuntematon"}
                        </div>
                        <div
                          className={`event-free ${
                            activeEventId === event.id ? "shown" : ""
                          }`}
                        >
                          <img src={EventPrice} alt="Event Free" />
                          {event.is_free ? "Ilmainen" : "Maksullinen"}{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      activeEventId === event.id
                        ? "event-description"
                        : " event-short-description"
                    }
                  >
                    <br />
                    <div
                      dangerouslySetInnerHTML={{
                        __html: getTruncatedText(
                          activeEventId === event.id
                            ? event.description?.fi
                            : event.short_description?.fi,
                          1200,
                          eventLocation.info_url.fi ||
                            eventLocation.info_url.sv ||
                            eventLocation.info_url.en
                        ),
                      }}
                    />

                    {eventLocation.info_url ? (
                      <a
                        href={eventLocation.info_url}
                        target="_blank"
                        className={`read-more-link ${
                          activeEventId === event.id ? "shown" : ""
                        }`}
                      >
                        <img
                          src={EventLink}
                          alt="icon"
                          className={`read-more-icon ${
                            activeEventId === event.id ? "shown" : ""
                          }`}
                        />
                        Lue lisää linkistä
                      </a>
                    ) : (
                      <a
                        href="#"
                        target="_blank"
                        className={`read-more-nolink ${
                          activeEventId === event.id ? "shown" : ""
                        }`}
                      >
                        <img
                          src={EventLink}
                          alt="icon"
                          className={`read-more-icon ${
                            activeEventId === event.id ? "shown" : ""
                          }`}
                        />
                        Linkki lisätään myöhemmin
                      </a>
                    )}

                    {event.offers?.[0]?.info_url?.fi ||
                    event.offers?.[0]?.info_url?.sv ||
                    event.offers?.[0]?.info_url?.en ? (
                      <div className="event-offer">
                        <span
                          className={`or-text ${
                            activeEventId === event.id ? "shown" : ""
                          }`}
                        >
                          Tai
                        </span>
                        <a
                          href={event.offers?.[0]?.info_url.fi}
                          target="_blank"
                          className={`offer-link ${
                            activeEventId === event.id ? "shown" : ""
                          }`}
                        >
                          <img
                            src={EventPrice}
                            alt="Event Price"
                            className={`event-price-icon ${
                              activeEventId === event.id ? "shown" : ""
                            }`}
                          />
                          Ostaa liput tästä
                        </a>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={`filter-wrapper ${isCreateEventOpen ? "hide" : ""}`}>
            {buttonVisible && (
              <div
                className={`filter-button ${isCentered ? "centered" : ""}`}
                onClick={toggleFilterPanel}
              >
                <img src={FilterIcon} alt="Filter" />
              </div>
            )}

            {showFilterPanel && (
              <div
                className={`filter-panel ${
                  showFilterPanel && !isClosing ? "open" : "closing"
                }`}
              >
                <Splide
                  ref={titleRef}
                  className="slider"
                  aria-label="Filter Titles"
                  options={{
                    type: "loop",
                    arrows: false,
                    pagination: false,
                  }}
                >
                  <SplideSlide>
                    <div className="filter-title">Aika</div>
                  </SplideSlide>
                  <SplideSlide>
                    <div className="filter-title">Paikkakunta</div>
                  </SplideSlide>
                  <SplideSlide>
                    <div className="filter-title">Avainsanat</div>
                  </SplideSlide>
                </Splide>
                <div className="filter-rows-container">
                  <Splide
                    ref={optionsRef}
                    aria-label="Filter Options"
                    className="slider"
                    options={{
                      perPage: 1,
                      interval: 3000,
                      arrows: false,
                      pagination: true,
                      speed: 500,
                    }}
                  >
                    <SplideSlide>
                      <div className="filter-row">
                        <div className="filter-version">
                          {filterTime.map((time) => (
                            <div
                              key={time}
                              className="filter-version-item"
                              onClick={() => filterTimeHandler(time)}
                            >
                              {time}
                            </div>
                          ))}
                        </div>
                      </div>
                    </SplideSlide>
                    <SplideSlide>
                      <div className="filter-row">
                        <div className="filter-places-container">
                          {districts.map((district) => (
                            <label
                              key={district.value}
                              onClick={() => filterPlaceHandler(district)}
                            >
                              <input
                                type="checkbox"
                                checked={filterParams[1].includes(
                                  district.value
                                )}
                                readOnly
                              />
                              <span>{district.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </SplideSlide>
                    <SplideSlide>
                      <div className="filter-row">
                        <div className="filter-keywords-container">
                          {keywords.map((keyword) => (
                            <span
                              key={keyword}
                              onClick={() => filterKeywordHandler(keyword)}
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </SplideSlide>
                  </Splide>
                </div>
                <div id="filter-buttons" className="filter-button-container">
                  <div className="discard-button" onClick={declineFilterButton}>
                    Hylkää
                  </div>
                  <div className="apply-button" onClick={applyFilterButton}>
                    Hyväksy
                  </div>
                </div>
              </div>
            )}
          </div>

          <div
            className={`pagination-arrows ${isCreateEventOpen ? "hide" : ""}`}
            id="pagination-arrows"
          >
            <button
              className="prev"
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              &lt; Prev
            </button>
            <button
              className="next"
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next &gt;
            </button>
          </div>
        </main>
        {/* ============ FOOTER START ============ */}
        <footer className="navigation-footer">
          <div className="footer-el">
            <Link to="/navigation" className="active">
              <img src={HomeIcon} alt="Home" />
              <span>Kotisivu</span>
            </Link>
          </div>

          <div className="footer-el">
            <Link
              to="/map"
              state={{ locations: eventLocations }}
              className="active"
            >
              <img src={MapIcon} alt="Map" />
              <span>Kartta</span>
            </Link>
          </div>

          <div className="footer-el">
            <Link to="/account" className="active">
              <img src={AccountIcon} alt="Map" />
              <span>Account</span>
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Navigation;
