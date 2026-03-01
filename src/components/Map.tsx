import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

interface MapProps {
  lat: number;
  lng: number;
  popupText?: string;
}

const Map = ({ lat, lng, popupText }: MapProps) => {
  
  useEffect(() => {
    // Fix leaflet icon issue in Next.js/Webpack
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  if (!lat || !lng) return null;

  return (
    <MapContainer 
      center={[lat, lng]} 
      zoom={9} 
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%', minHeight: '300px', zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]}>
        {popupText && <Popup>{popupText}</Popup>}
      </Marker>
    </MapContainer>
  );
};

export default Map;
