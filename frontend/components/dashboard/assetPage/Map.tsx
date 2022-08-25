import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useSelector } from "react-redux";
import { selectedAssetSelector } from "lib/slices/assetSlice";

export default function Map() {
  const data = useSelector(selectedAssetSelector);

  if (data?.location === undefined) return <></>;

  return (
    <MapContainer
      center={[data.location.lat, data.location.long]}
      zoom={14}
      scrollWheelZoom={false}
      style={{ height: "400px", width: "100%", zIndex: 0 }}
      zoomControl={true}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[data.location.lat, data.location.long]}>
        <Popup>{data.name}</Popup>
      </Marker>
    </MapContainer>
  );
}
