import { Link, useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markIcon from "../../assets/icons/yellow-logo.png";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "./map.css";



// const iconUrl = () => {};

// const iconMark = L.icon({
//   iconUrl: loc.image || markIcon,
//   iconSize: [32, 32],
//   iconAnchor: [16, 32],
//   popupAnchor: [0, -32],
// });

const Map = () => {
  const { state } = useLocation();
  const locations = state?.locations || [];
  console.log("Got locations:", locations);

  return (
    <div className="map">
      <div className="map-cont">
        <MapContainer
          center={[60.17, 24.93]} // Helsinki
          zoom={12}
          minZoom={11}
          maxZoom={17}
          maxBounds={[
            [59.8, 24.4],
            [60.5, 25.5],
          ]}
          maxBoundsViscosity={1.0}
          scrollWheelZoom
          doubleClickZoom
          dragging
          zoomControl
          touchZoom
          preferCanvas
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid2VsbG5vdGUiLCJhIjoiY205ODZuODJqMGV4eDJsc2VwZ3hraHAzaSJ9.Ei8toDcIcpyPbVlu6BLkvw"
            attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a>'
            id="mapbox/streets-v11"
            tileSize={512}
            zoomOffset={-1}
          />
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
                    <div>
                      <img
                        src={loc.image || markIcon}
                        alt={loc.name || "location"}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                        }}
                      />
                      <span>{loc.name || "No name"}</span>
                    </div>
                  </Popup>
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
