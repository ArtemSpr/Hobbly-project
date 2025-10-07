import { useEffect, useState, useRef } from "react";
import ThirdEventImage from "../../../assets/image/event-3.webp";
import axios from "axios";
import EventDate from "../../../assets/icons/date-icon.png";
import EventStart from "../../../assets/icons/clock-icon.png";
import EventEnd from "../../../assets/icons/clock-icon-close.png";
import EventEmail from "../../../assets/icons/email-icon.png";
import EventPhone from "../../../assets/icons/phone-icon.png";
import EventLocation from "../../../assets/icons/location-icon.png";
import EventCapa from "../../../assets/icons/capacity-icon.png";
import EventPrice from "../../../assets/icons/price-icon.png";
import EventLink from "../../../assets/icons/link-icon.png";

import "./ownEvents.css";

const OwnEvents = ({ newEvents, setNewEvents, newEventImage }) => {
  const [activeEventId, setActiveEventId] = useState(null);
  //const [newEvents, setNewEvents] = useState([]);
  const eventRefs = useRef({});

  // useEffect(() => {
  //   const fetchDBEvents = async () => {
  //     try {
  //       const responseDB = await axios.get("/api/events");
  //       setNewEvents(responseDB.data);
  //       console.log("Actual newEvents array:", responseDB.data);
  //     } catch (error) {
  //       console.error("Error getting data:", error);
  //     }
  //   };

  //   fetchDBEvents();
  // }, []);

  const getDay = (date) => {
    return date || "TBD";
  };

  const getTime = (time) => {
    return time || "TBD";
  };

  const getTruncatedText = (text, limit) => {
    if (!text) return "No description available.";

    if (text.length > limit) {
      const words = text.split(" ");
      let truncated = "";
      for (let word of words) {
        if ((truncated + word).length > limit) break;
        truncated += (truncated ? " " : "") + word;
      }
      return truncated + "...";
    }

    return text;
  };

  const handleEventClick = (event) => {
    setActiveEventId((prev) => (prev === event.id ? null : event.id));
  };

  return (
    <div className="own-events-content">
      {newEvents.map((event, index) => (
        <div
          ref={(el) => (eventRefs.current[event.id || index] = el)}
          className={`event-card ${
            activeEventId === (event.id || index) ? "active" : ""
          }`}
          key={event.id || index}
          onClick={() => handleEventClick({ ...event, id: event.id || index })}
        >
          <div className="event-card-image">
            <img
              src={newEventImage?.url || ThirdEventImage}
              alt={newEventImage?.name || "Event"}
            />
          </div>
          <div className="event-card-content">
            <div className="org-name">{event.companyName || "Company"}</div>
            <div className="event-title">{event.title || "Event title"}</div>

            <div className="card-detail-info">
              <div
                className={`event-time ${
                  activeEventId === (event.id || index) ? "shown" : ""
                }`}
              >
                <div className="event-date">
                  <img src={EventDate} alt="Event Date" />
                  <span>{getDay(event.date)}</span>
                </div>
                <div className="event-start-time">
                  <img src={EventStart} alt="Start Time" />
                  <span>{getTime(event.startTime)}</span>
                </div>
                <div className="event-end-time">
                  <img src={EventEnd} alt="End Time" />
                  <span>{getTime(event.endTime)}</span>
                </div>
              </div>

              <div
                className={`event-location ${
                  activeEventId === (event.id || index) ? "shown" : ""
                }`}
              >
                <div className="event-contact">
                  <div className="event-email">
                    <img src={EventEmail} alt="Event Email" />
                    {event.email || "Not provided"}
                  </div>
                  <div className="event-phone">
                    <img src={EventPhone} alt="Event Phone" />
                    {event.phone || "Not provided"}
                  </div>
                </div>
                <div className="event-bonus-info">
                  <div className="event-address">
                    <img src={EventLocation} alt="Event Address" />
                    {event.address || "Not provided"}
                  </div>

                  <div
                    className={`event-capacity ${
                      activeEventId === (event.id || index) ? "shown" : ""
                    }`}
                  >
                    <img src={EventCapa} alt="Event Capacity" />
                    {event.maxCapacity || "Not specified"}
                  </div>
                  <div
                    className={`event-free ${
                      activeEventId === (event.id || index) ? "shown" : ""
                    }`}
                  >
                    <img src={EventPrice} alt="Event Type" />
                    {event.eventType === "free" ? "Ilmainen" : "Maksullinen"}
                  </div>
                </div>
              </div>
            </div>

            <div
              className={
                activeEventId === (event.id || index)
                  ? "event-description"
                  : "event-short-description"
              }
            >
              <br />
              <div>
                {getTruncatedText(
                  event.description,
                  activeEventId === (event.id || index) ? 1200 : 150
                )}
              </div>

              {event.website ? (
                <a
                  href={event.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`read-more-link ${
                    activeEventId === (event.id || index) ? "shown" : ""
                  }`}
                >
                  <img
                    src={EventLink}
                    alt="icon"
                    className={`read-more-icon ${
                      activeEventId === (event.id || index) ? "shown" : ""
                    }`}
                  />
                  Lue lisää linkistä
                </a>
              ) : (
                <div
                  className={`read-more-nolink ${
                    activeEventId === (event.id || index) ? "shown" : ""
                  }`}
                >
                  <img
                    src={EventLink}
                    alt="icon"
                    className={`read-more-icon ${
                      activeEventId === (event.id || index) ? "shown" : ""
                    }`}
                  />
                  Linkki lisätään myöhemmin
                </div>
              )}

              {event.ticketUrl && (
                <div className="event-offer">
                  <span
                    className={`or-text ${
                      activeEventId === (event.id || index) ? "shown" : ""
                    }`}
                  >
                    Tai
                  </span>
                  <a
                    href={event.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`offer-link ${
                      activeEventId === (event.id || index) ? "shown" : ""
                    }`}
                  >
                    <img
                      src={EventPrice}
                      alt="Event Price"
                      className={`event-price-icon ${
                        activeEventId === (event.id || index) ? "shown" : ""
                      }`}
                    />
                    Ostaa liput tästä
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OwnEvents;
