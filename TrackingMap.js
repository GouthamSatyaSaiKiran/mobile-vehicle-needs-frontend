import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const deliveryIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/854/854878.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

function TrackingMap({ deliveryLocation }) {
  if (!deliveryLocation) return null;
  const { lat, lng } = deliveryLocation;

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      style={{ height: '300px', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[lat, lng]} icon={deliveryIcon}>
        <Popup>Delivery Person is Here</Popup>
      </Marker>
    </MapContainer>
  );
}

export default TrackingMap;