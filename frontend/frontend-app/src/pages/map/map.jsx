import { Link, useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markIcon from "../../assets/icons/yellow-logo.png";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "./map.css";

const iconMark = L.icon({
  iconUrl: markIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const Map = () => {
  const { state } = useLocation();
  const locations = state?.locations || [];
  console.log("Got locations:", locations);
  return (
    <div className="map">
      <div className="map-cont">
        <MapContainer
          center={[60.17, 24.93]} // Helsinki
          zoom={12} // default zoom level
          minZoom={11} // minimum zoom level
          maxZoom={17} // maximum zoom level
          maxBounds={[
            [59.8, 24.4],
            [60.5, 25.5],
          ]} // bounding box for the map
          maxBoundsViscosity={1.0} // "stickiness" to bounds
          scrollWheelZoom={true} // zoom with mouse wheel
          doubleClickZoom={true} // zoom with double-click
          dragging={true} // drag the map
          zoomControl={true} // show zoom control buttons
          touchZoom={true} // zoom on touch devices
          preferCanvas={true} // performance optimization for many markers
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid2VsbG5vdGUiLCJhIjoiY205ODZuODJqMGV4eDJsc2VwZ3hraHAzaSJ9.Ei8toDcIcpyPbVlu6BLkvw"
            attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a>'
            id="mapbox/streets-v11"
            tileSize={512}
            zoomOffset={-1}
          />
          <MarkerClusterGroup spiderfyOnClick showCoverageOnHover>
            {locations
              .filter((loc) => loc.latitude && loc.longitude)
              .map((loc) => (
                <Marker
                  key={loc.id}
                  position={[loc.latitude, loc.longitude]}
                  icon={iconMark}
                >
                  <Popup>{loc.name}</Popup>
                </Marker>
              ))}
          </MarkerClusterGroup>
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
