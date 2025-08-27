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
//! TO DO: when user click on event block event details should be shown

const Navigation = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await axios.get(
          "https://api.hel.fi/linkedevents/v1/event/"
        );
        if (response.status === 200) {
          const uniqueEvents = response.data.data.filter(
            (event, index, self) =>
              index === self.findIndex((e) => e.id === event.id)
          );
          setEvents(uniqueEvents);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }

    fetchEvents();
  }, []);

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
            <div className="event-card" key={event.id}>
              <div className="event-card-image">
                <img
                  src={
                    event.images && event.images[0]
                      ? event.images[0].url
                      : ThirdEventImage
                  }
                  alt={event.name?.fi || "Event"}
                />
              </div>
              <div className="event-card-content">
                <div className="org-name">
                  {event.provider?.fi || "Company"}
                </div>
                <div className="event-title">
                  {event.name?.fi || "Event title"}
                </div>
                <div className="event-description">
                  {event.short_description?.fi ||
                    "This is a description of the event."}
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
