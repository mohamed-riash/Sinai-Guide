import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { Button } from './Button';

// Custom SVG Pin Icon for Leaflet
const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-leaflet-pin',
    html: `<div style="background-color: var(--color-digital-blue-500); color: white; border-radius: 50%; width: 36px; height: 36px; display: flex; items-center: justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid white;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  });
};

export const MapSection = ({ locationName, address, coordinates }) => {
  const hasCoordinates = Number.isFinite(coordinates?.lat) && Number.isFinite(coordinates?.lng);
  const position = hasCoordinates ? [coordinates.lat, coordinates.lng] : null;

  const mapUrl = hasCoordinates
    ? `https://maps.google.com/?q=${coordinates.lat},${coordinates.lng}`
    : `https://maps.google.com/?q=${encodeURIComponent(address || locationName)}`;

  return (
    <div className="w-full glass-panel overflow-hidden relative flex flex-col gap-4 p-4 border border-white/20">
      <div className="flex flex-wrap items-center justify-between gap-3 px-2">
        <div className="flex min-w-0 items-center gap-2">
          <MapPin className="w-5 h-5 text-[var(--color-digital-blue-500)]" />
          <h4 className="min-w-0 break-words text-base font-bold font-display text-slate-900 dark:text-white">{locationName || 'موقع المكان'}</h4>
        </div>

        <a href={mapUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="glass" size="sm" icon={ExternalLink}>
            فتح في الخرائط الخارجية
          </Button>
        </a>
      </div>

      {hasCoordinates ? (
        <div className="w-full h-[280px] rounded-2xl overflow-hidden shadow-inner border border-white/10 relative z-0">
          <MapContainer center={position} zoom={13} scrollWheelZoom={false} className="w-full h-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} icon={createCustomIcon()}>
              <Popup>
                <div className="text-right p-1 font-sans">
                  <strong className="block font-bold text-sm text-[var(--color-digital-blue-700)]">{locationName}</strong>
                  <span className="text-xs text-slate-600 block mt-0.5">{address}</span>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      ) : (
        <div className="min-h-28 rounded-2xl border border-dashed border-[var(--color-border-light)] flex items-center justify-center p-5 text-center text-sm text-[var(--color-text-secondary)]">
          لم يتم تحديد إحداثيات هذا المكان بعد.
        </div>
      )}

      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 px-2">
        <Navigation className="w-3.5 h-3.5 text-digital-blue-400 shrink-0" />
        <span className="min-w-0 break-words">{address}</span>
      </p>
    </div>
  );
};
