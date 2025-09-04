import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
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

const Navigation = () => {
  const [events, setEvents] = useState([]);
  const [apiPage, setApiPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [seenIds, setSeenIds] = useState(new Set());
  const [apisLength, setApisLength] = useState(0);
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
  });

  const [searchTerm, setSearchTerm] = useState("");

  // ====== FUNCTION THAT SWITCH PAGE WHEN USER SCROLLS TO BOTTOM ======
  const handleScroll = () => {
    if (
      window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 10 &&
      !loading
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
      const response = await axios.get(
        `https://api.hel.fi/linkedevents/v1/event/?page=${page}`
      );
      console.log("Response URL: " + response.config.url);

      if (response.status === 200) {
        const newEvents = response.data.data.filter(
          (event) => event.super_event === null
        );
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

  // ====== SCROLL EVENTS HANDLER======
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, apiPage]);

  useEffect(() => {
    fetchEvents(apiPage);
  }, [apiPage]);

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

  // ---------- URL CHECKING ----------
  // console.log("Response URL: " + response.config.url);
  // ---------- URL CHECKING ----------

  const handleEventClick = async (event) => {
    console.log("Event clicked:", event);

    setActiveEventId((prev) => (prev === event.id ? null : event.id));

    const placeApiUrl = event.location["@id"];
    console.log("Place API URL:", placeApiUrl);

    try {
      const response = await axios.get(placeApiUrl);

      const locationData = {
        contactEmail: response.data.email || "",
        contactPhone: response.data.telephone || "",
        coordinates: {
          latitude: response.data.position.coordinates[0],
          longitude: response.data.position.coordinates[1],
        },
        info_url: response.data.info_url?.fi || "",
        address: response.data.street_address.fi || "",
      };
      setEventLocation(locationData);
    } catch (error) {
      console.error("Failed to fetch location:", error);
    }
  };

  // ===== TIME FORMATER =====
  const formatDateTime = (isoString) => {
    if (!isoString) return "Unknown";
    const date = new Date(isoString);
    return date.toLocaleString("fi-FI", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
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

      if (!link) {
        return (
          truncated +
          `... <a href="${link}" target="_blank" class="read-more-link nolink">
        <img src="${EventLink}" alt="icon" class="read-more-icon" />
        Linkki lisätään myöhemmin
      </a>`
        );
      } else {
        return (
          truncated +
          `... <a href="${link}" target="_blank" class="read-more-link">
        <img src="${EventLink}" alt="icon" class="read-more-icon" />
        lue lisää linkistä
      </a>`
        );
      }
    }

    return text;
  }
  return (
    <div className="navigation">
      {/* ============ HEADER START ============ */}
      <header id="main-header" className="navi-header">
        <div className="navi-logo">
          <img src={Logo} alt="Logo" />
        </div>
        {/* <div className="navi-header-search">
          <img src={SearchIcon} alt="Search" />
        </div> */}
        <div className="search-container">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => handleSearch(e)}
            />
            <img src={SearchGray} alt="Search" className="search-icon" />
          </div>
          <div className="filter-button">
            <img src={FilterIcon} alt="Search" />
          </div>
        </div>
      </header>

      {/* ============ MAIN START ============ */}
      <main className="main-content">
        <div className="event-cards-container">
          {filteredEvents.map((event) => (
            <div
              className={`event-card ${
                activeEventId === event.id ? "active" : ""
              }`}
              key={event.id}
              onClick={() => handleEventClick(event)}
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
                        {eventLocation.email || "Unknown"}
                      </div>
                      <div className="event-phone">
                        <img src={EventPhone} alt="Event Phone" />
                        {eventLocation.phone || "Unknown"}
                      </div>
                      <div className="event-info-url">
                        <img src={EventLink} alt="Event Info" />
                        {eventLocation.info_url ? (
                          <a
                            href={eventLocation.info_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Link
                          </a>
                        ) : (
                          "Unknown"
                        )}
                      </div>
                    </div>
                    <div className="event-bonus-info">
                      <div className="event-address">
                        <img src={EventLocation} alt="Event Address" />
                        {eventLocation.address || "Address is unknown"}
                      </div>

                      <div
                        className={`event-capacity ${
                          activeEventId === event.id ? "shown" : ""
                        }`}
                      >
                        <img src={EventCapa} alt="Event Capacity" />
                        {event.maximum_capacity || "Unknown"}
                      </div>
                      <div
                        className={`event-free ${
                          activeEventId === event.id ? "shown" : ""
                        }`}
                      >
                        <img src={EventPrice} alt="Event Free" />
                        {event.is_free ? "Free" : "Paid"}{" "}
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      {/* ============ FOOTER START ============ */}
      <footer className="navigation-footer">
        <div className="footer-el">
          <Link to="/navigation" className="active">
            <img src={HomeIcon} alt="Home" />
            <span>Home</span>
          </Link>
        </div>
        <div className="footer-el">
          <Link to="/navigation" className="active">
            <img src={SearchIcon} alt="Search" />
            <span>Search</span>
          </Link>
        </div>
        <div className="footer-el">
          <Link to="/navigation" className="active">
            <img src={MapIcon} alt="Map" />
            <span>Map</span>
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Navigation;
