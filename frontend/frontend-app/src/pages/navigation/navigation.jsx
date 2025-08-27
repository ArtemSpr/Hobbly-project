import { Link } from "react-router-dom";
import { useEffect } from "react";
import "./navigation.css";

import Logo from "../../assets/icons/yellow-big-logo.png";
import SearchIcon from "../../assets/icons/search-white.svg";
import HomeIcon from "../../assets/icons/home-white.svg";
import MapIcon from "../../assets/icons/map-white.svg";
import EventImage from "../../assets/image/event.avif";
import SecEventImage from "../../assets/image/event-2.webp";
import ThirdEventImage from "../../assets/image/event-3.webp";

//! TO DO: header must hide on scroll
//! TO DO: footer icon and text must be in the same line
//! TO DO: active page should be yellow in footer
//! TO DO: create all other page

const Navigation = () => {
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
      <header id="main-header" className="navi-header">
        <div className="navi-logo">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="navi-header-search">
          <img src={SearchIcon} alt="Search" />
        </div>
      </header>
      <main className="main-content">
        <div className="event-cards-container">
          <div className="event-card">
            <div className="event-card-image">
              <img src={EventImage} alt="Event" />
            </div>
            <div className="event-card-content">
              <div className="org-name">Company</div>
              <div className="event-title">Event title</div>
              <div className="event-description">
                This is a description of the event.
              </div>
            </div>
          </div>
          <div className="event-card">
            <div className="event-card-image">
              <img src={SecEventImage} alt="Event" />
            </div>
            <div className="event-card-content">
              <div className="org-name">Company</div>
              <div className="event-title">Event title</div>
              <div className="event-description">
                This is a description of the event.
              </div>
            </div>
          </div>
          <div className="event-card">
            <div className="event-card-image">
              <img src={ThirdEventImage} alt="Event" />
            </div>
            <div className="event-card-content">
              <div className="org-name">Company</div>
              <div className="event-title">Event title</div>
              <div className="event-description">
                This is a description of the event.
              </div>
            </div>
          </div>
        </div>
      </main>
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
            <span>Home</span>
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Navigation;
