import { Link } from "react-router-dom";
import { useEffect, useState, useRef, use } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import axios from "axios";
import "./navigation.css";

import Logo from "../../assets/icons/yellow-big-logo.png";
import SearchIcon from "../../assets/icons/search-white.svg";
import HomeIcon from "../../assets/icons/home-white.svg";
import MapIcon from "../../assets/icons/map-white.svg";
import ThirdEventImage from "../../assets/image/event-3.webp";

import EventDate from "../../assets/icons/date-icon.png";
import EventCapa from "../../assets/icons/capacity-icon.png";
import EventStart from "../../assets/icons/clock-icon.png";
import EventEnd from "../../assets/icons/clock-icon-close.png";
import EventEmail from "../../assets/icons/email-icon.png";
import EventLink from "../../assets/icons/link-icon.png";
import EventPhone from "../../assets/icons/phone-icon.png";
import EventLocation from "../../assets/icons/location-icon.png";
import EventPrice from "../../assets/icons/price-icon.png";
import FilterIcon from "../../assets/icons/filter-icon.png";
import SearchGray from "../../assets/icons/search-grey.png";

//! TO DO: active page should be yellow in footer
//! TO DO: create all other page
//! TO DO: user can filter events by time, location, keywords, text, language, age

function Navigation() {
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
  // ------- FILTER PANEL STATES -------
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [isCentered, setIsCentered] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [filterParams, setFilterParams] = useState([[], [], []]);
  const [apiLink, setApiLink] = useState(
    "https://api.hel.fi/linkedevents/v1/event/"
  );

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
          if (unique.length > prev.length) addedNew = true;
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
    if (!header) return;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll) {
        header.classList.add("hidden");
      } else {
        header.classList.remove("hidden");
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
        const districtValue = districtObj.value || districtObj; // підтримка і старого і нового формату

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

  return (
    <div className="navigation">
      {/* ============ HEADER START ============ */}
      <header id="main-header" className="navi-header">
        <div className="navi-logo">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="search-container">
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
        <div className="event-cards-container">
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

        <div className="filter-wrapper">
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
                              checked={filterParams[1].includes(district.value)}
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

        <div className="pagination-arrows" id="pagination-arrows">
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
          <Link to="/navigation" className="active">
            <img src={SearchIcon} alt="Search" />
            <span>Haku</span>
          </Link>
        </div>
        <div className="footer-el">
          <Link to="/navigation" className="active">
            <img src={MapIcon} alt="Map" />
            <span>Kartta</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default Navigation;
