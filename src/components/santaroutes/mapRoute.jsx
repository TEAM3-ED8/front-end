import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  ZoomControl
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { GiftIcon } from 'lucide-react';
import PropTypes from "prop-types";
import SearchAddress from "./searchAddress";

// Custom Christmas tree icon
const christmasIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function ChangeView({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds);
    }
  }, [bounds, map]);
  return null;
}

ChangeView.propTypes = {
  bounds: PropTypes.instanceOf(L.LatLngBounds),
};

export default function MapRoute({
  currentRoute,
  routeCoordinates,
  northPole,
  onSearch,
  onSave,
}) {
  const mapRef = useRef(null);
  const [mapBounds, setMapBounds] = useState(null);

  useEffect(() => {
    if (mapRef.current) {
      if (currentRoute && currentRoute.lat && currentRoute.lng) {
        const bounds = L.latLngBounds(
          [parseFloat(northPole.lat), parseFloat(northPole.lng)],
          [parseFloat(currentRoute.lat), parseFloat(currentRoute.lng)]
        );
        setMapBounds(bounds);
      } else {
        mapRef.current.setView([parseFloat(northPole.lat), parseFloat(northPole.lng)], 3);
        setMapBounds(null);
      }
    }
  }, [currentRoute, northPole]);

  const routePoints = routeCoordinates && routeCoordinates.length > 0
    ? routeCoordinates.map(coord => [parseFloat(coord[0]), parseFloat(coord[1])])
    : [];

  return (
    <div className="shadow-lg shadow-zinc-500 rounded-xl overflow-hidden relative">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] w-full max-w-md">
        <SearchAddress onSearch={onSearch} onSave={onSave} />
      </div>
      <MapContainer
        center={[parseFloat(northPole.lat), parseFloat(northPole.lng)]}
        zoom={3}
        style={{ height: "75vh", width: "100%", borderRadius: "10px" }}
        ref={mapRef}
        className="rounded-3xl"
        zoomControl={false}
      >
        <ZoomControl position="bottomright" className="block sm:hidden" />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[parseFloat(northPole.lat), parseFloat(northPole.lng)]} icon={christmasIcon}>
          <Popup>{northPole.name} - Santa&apos;s Workshop</Popup>
        </Marker>
        {currentRoute && currentRoute.lat && currentRoute.lng && (
          <Marker
            position={[parseFloat(currentRoute.lat), parseFloat(currentRoute.lng)]}
            icon={christmasIcon}
          >
            <Popup>
              <div className="flex items-center">
                <GiftIcon className="mr-2 text-red-700" />
                {currentRoute.name}
              </div>
            </Popup>
          </Marker>
        )}
        {routePoints.length > 0 && (
          <Polyline
            positions={routePoints}
            color="red"
            weight={3}
            opacity={0.7}
          >
            <Popup>
              Route from {northPole.name} to {currentRoute?.name}
            </Popup>
          </Polyline>
        )}
        {mapBounds && <ChangeView bounds={mapBounds} />}
      </MapContainer>
    </div>
  );
}

MapRoute.propTypes = {
  currentRoute: PropTypes.shape({
    name: PropTypes.string,
    lat: PropTypes.string,
    lng: PropTypes.string,
  }),
  routeCoordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  northPole: PropTypes.shape({
    lat: PropTypes.string,
    lng: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  onSearch: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

