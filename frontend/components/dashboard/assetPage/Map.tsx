import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

export default function Map({ location, name }: any) {
  return (
    <MapContainer
      center={[location.long, location.lat]}
      zoom={14}
      scrollWheelZoom={false}
      style={{ height: "400px", width: "100%", zIndex: 0 }}
      zoomControl={true}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[location.long, location.lat]}>
        <Popup>{name}</Popup>
      </Marker>
    </MapContainer>
  );
}
