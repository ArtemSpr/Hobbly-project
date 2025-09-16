import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Map = () => {
  return (
    <div className="map" style={{ height: "100vh", width: "100%" }}>
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
        // there is map style
        ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
        <TileLayer
          url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=YOUR_MAPBOX_ACCESS_TOKEN"
          attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a>'
          id="mapbox/streets-v11"
          tileSize={512}
          zoomOffset={-1}
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>There will be an events card</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
