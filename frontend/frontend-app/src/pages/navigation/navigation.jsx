import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./navigation.css";
import Logo from "../../assets/icons/yellow-big-logo.png";
import SearchIcon from "../../assets/icons/search-white.svg";
import HomeIcon from "../../assets/icons/home-white.svg";
import MapIcon from "../../assets/icons/map-white.svg";
import ThirdEventImage from "../../assets/image/event-3.webp";

//! TO DO: active page should be yellow in footer
//! TO DO: create all other page
//! TO DO: when user click on event block event description broke a block

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

      console.log("Location Data:", locationData);
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

  return (
    <div className="navigation">
      {/* ============ HEADER START ============ */}
      <header id="main-header" className="navi-header">
        <div className="navi-logo">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="navi-header-search">
          <img src={SearchIcon} alt="Search" />
        </div>
      </header>
      {/* ============ MAIN START ============ */}
      <main className="main-content">
        <div className="event-cards-container">
          {events.map((event) => (
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
                <div
                  className={
                    activeEventId === event.id
                      ? "event-description"
                      : " event-short-description"
                  }
                >
                  {" "}
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        activeEventId === event.id
                          ? event.description?.fi || "No description available."
                          : event.short_description?.fi ||
                            "This is a description of the event.",
                    }}
                  />
                </div>
                <div
                  className={`event-time ${
                    activeEventId === event.id ? "shown" : ""
                  }`}
                >
                  {formatDateTime(event.start_time)}
                  <br />
                  {formatDateTime(event.end_time)}
                </div>

                <div
                  className={`event-location ${
                    activeEventId === event.id ? "shown" : ""
                  }`}
                >
                  {eventLocation.address || "Event address is unknown"}
                  <br />
                  {eventLocation.email || "Event email is unknown"}
                  <br />
                  {eventLocation.phone || "Event phone is unknown"}
                  <br />
                  {eventLocation.info_url ? (
                    <a
                      href={eventLocation.info_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {eventLocation.info_url}
                    </a>
                  ) : (
                    "Event info URL is unknown"
                  )}
                </div>

                <div
                  className={`event-capacity ${
                    activeEventId === event.id ? "shown" : ""
                  }`}
                >
                  {" "}
                  {event.maximum_capacity || "Event capacity is unknown"}{" "}
                </div>
                <div
                  className={`event-free ${
                    activeEventId === event.id ? "shown" : ""
                  }`}
                >
                  {" "}
                  {event.is_free ? "Free" : "Paid"}{" "}
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
