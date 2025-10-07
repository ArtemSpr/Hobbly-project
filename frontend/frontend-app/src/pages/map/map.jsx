import { Link, useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markIcon from "../../assets/icons/account-icon.png";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "./map.css";
import { useEffect, useState, useRef } from "react";

const LiveLocationMarker = ({ setPosition }) => {
  const mapRef = useRef();

  const pulsingIcon = L.divIcon({
    className: "pulsing-icon",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
    html: `<div class="inner-icon"></div>`,
  });

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newPos = [latitude, longitude];
        setPosition(newPos);
        mapRef.current?.setView(newPos, 14);
      },
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, [setPosition]);

  return null;
};
const MyPositionButton = ({ position }) => {
  const map = useMap();

  return (
    <button
      className="me-but"
      onClick={() => {
        if (position) {
          map.flyTo(position, 14, { animate: true, duration: 1.5 });
        }
      }}
    >
      My position
    </button>
  );
};

const Map = () => {
  const { state } = useLocation();
  const locations = state?.locations || [];
  const [position, setPosition] = useState(null);

  const pulsingIcon = L.divIcon({
    className: "pulsing-icon",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
    html: `<div class="inner-icon"></div>`,
  });

  const mapRef = useRef();
  return (
    <div className="map">
      <div className="map-cont" style={{ position: "relative" }}>
        <MapContainer
          center={[60.17, 24.93]}
          zoom={12}
          minZoom={11}
          maxZoom={17}
          maxBoundsViscosity={1.0}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
          whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
        >
          <TileLayer
            url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid2VsbG5vdGUiLCJhIjoiY205ODZuODJqMGV4eDJsc2VwZ3hraHAzaSJ9.Ei8toDcIcpyPbVlu6BLkvw"
            attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a>'
            id="mapbox/streets-v11"
            tileSize={512}
            zoomOffset={-1}
          />

          <LiveLocationMarker setPosition={setPosition} />

          {position && (
            <Marker position={position} icon={pulsingIcon}>
              <Popup>You are here</Popup>
            </Marker>
          )}

          <MarkerClusterGroup
            spiderfyOnClick
            showCoverageOnHover
            spiderfyDistanceMultiplier={3}
            maxClusterRadius={70}
          >
            {locations
              .filter((loc) => loc.latitude && loc.longitude)
              .map((loc) => (
                <Marker
                  key={loc.id}
                  position={[loc.latitude, loc.longitude]}
                  icon={L.icon({
                    iconUrl: loc.image || markIcon,
                    iconSize: [64, 64],
                    iconAnchor: [32, 64],
                    popupAnchor: [0, -64],
                    className: "custom-icon",
                  })}
                >
                  <Popup>
                    <div className="marker__popup">
                      <img
                        className="popup--img"
                        src={loc.image || markIcon}
                        alt={loc.name || "location"}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <span className="popup--name">
                        {loc.name || "No name"}
                      </span>
                      <span className="popup--description">
                        {loc.shortDescription || "No description"}
                      </span>
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MarkerClusterGroup>
          <MyPositionButton position={position} />
        </MapContainer>
      </div>

      <div className="but">
        <Link to="/navigation" className="back-button">
          &lt;
        </Link>
      </div>
    </div>
  );
};

export default Map;
