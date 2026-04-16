import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Loader } from '@googlemaps/js-api-loader';

export default function LocationPicker({ onLocationSelect, initialLocation }) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places'],
    });

    loader.load().then(() => {
      const defaultCenter = initialLocation || { lat: 6.7833, lng: -1.4167 }; // Effiduasi

      const mapInstance = new google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      const markerInstance = new google.maps.Marker({
        map: mapInstance,
        position: defaultCenter,
        draggable: true,
      });

      // Get address for initial position
      reverseGeocode(defaultCenter.lat, defaultCenter.lng);

      // Listen for marker drag
      markerInstance.addListener('dragend', () => {
        const position = markerInstance.getPosition();
        const lat = position.lat();
        const lng = position.lng();
        reverseGeocode(lat, lng);
        onLocationSelect({ latitude: lat, longitude: lng, address });
      });

      // Listen for map clicks
      mapInstance.addListener('click', (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        markerInstance.setPosition(e.latLng);
        reverseGeocode(lat, lng);
        onLocationSelect({ latitude: lat, longitude: lng, address });
      });

      setMap(mapInstance);
      setMarker(markerInstance);
      setLoading(false);
    });
  }, []);

  const reverseGeocode = (lat, lng) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const formattedAddress = results[0].formatted_address;
        setAddress(formattedAddress);
        onLocationSelect({ latitude: lat, longitude: lng, address: formattedAddress });
      }
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const newPosition = { lat, lng };
          
          map.setCenter(newPosition);
          marker.setPosition(newPosition);
          reverseGeocode(lat, lng);
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoading(false);
          alert('Unable to get your location. Please select manually on the map.');
        }
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <div className="relative">
        <div
          ref={mapRef}
          className="w-full h-96 rounded-card border border-neutral-300"
        />
        
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-card">
            <div className="spinner" />
          </div>
        )}

        {/* Current Location Button */}
        <button
          onClick={getCurrentLocation}
          className="absolute top-4 right-4 btn btn-secondary shadow-lg"
          disabled={loading}
        >
          <Navigation size={18} />
        </button>
      </div>

      {/* Selected Address */}
      {address && (
        <div className="flex items-start gap-3 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
          <MapPin size={20} className="text-primary-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-900">Selected Location</p>
            <p className="text-sm text-neutral-600 mt-1">{address}</p>
          </div>
        </div>
      )}

      <p className="text-xs text-neutral-500 text-center">
        Drag the marker or click on the map to select your delivery location
      </p>
    </div>
  );
}
