import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const PropertyMap = ({ properties = [] }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    
    if (!mapboxToken) {
      console.warn('Mapbox access token not found');
      return;
    }

    console.log('Initializing Mapbox map...');
    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [77.2090, 28.6139], // Default to Delhi, India
      zoom: 10
    });

    map.current.on('load', () => {
      console.log('Map loaded successfully');
      setMapLoaded(true);
    });

    map.current.on('error', (e) => {
      console.error('Map error:', e);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || !mapLoaded || properties.length === 0) return;

    console.log('Adding markers for properties:', properties);

    // Clear existing markers
    const markers = document.querySelectorAll('.mapboxgl-marker');
    markers.forEach(marker => marker.remove());

    // Add markers for each property
    properties.forEach((property, index) => {
      console.log(`Property ${index + 1}:`, {
        name: property.propertyName,
        district: property.district,
        state: property.state,
        country: property.country,
        price: property.pricePerNight,
        lat: property.latitude,
        lng: property.longitude,
        propertyAddress: property.propertyAddress
      });
      
      if (property.latitude && property.longitude) {
        // Create a custom marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'property-marker';
        markerElement.style.cssText = `
          width: 30px;
          height: 30px;
          background-color: #F68241;
          border: 2px solid white;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        `;
        markerElement.textContent = index + 1;

        // Create popup content with proper fallbacks
        const getLocationString = (property) => {
          const parts = [];
          
          if (property.district) parts.push(property.district);
          if (property.state) parts.push(property.state);
          if (property.country && property.country !== 'India') parts.push(property.country);
          
          return parts.length > 0 ? parts.join(', ') : 'Location not specified';
        };
        
        const location = getLocationString(property);
        
        const popupContent = `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold;">${property.propertyName || 'Property'}</h3>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${location}</p>
            <p style="margin: 0; font-size: 12px; color: #F68241; font-weight: bold;">₹${property.pricePerNight || 'N/A'}/night</p>
          </div>
        `;

        // Add marker to map
        new mapboxgl.Marker(markerElement)
          .setLngLat([property.longitude, property.latitude])
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent))
          .addTo(map.current);
      }
    });

    // Fit map to show all properties
    if (properties.length > 0) {
      const coordinates = properties
        .filter(property => property.latitude && property.longitude)
        .map(property => [property.longitude, property.latitude]);

      if (coordinates.length > 0) {
        if (coordinates.length === 1) {
          // For single property, center on it with appropriate zoom
          map.current.setCenter(coordinates[0]);
          map.current.setZoom(14);
        } else {
          // For multiple properties, fit bounds
          const bounds = coordinates.reduce((bounds, coord) => {
            return bounds.extend(coord);
          }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

          map.current.fitBounds(bounds, {
            padding: 50,
            maxZoom: 15
          });
        }
      }
    }
  }, [properties, mapLoaded]);

  if (!import.meta.env.VITE_MAPBOX_ACCESS_TOKEN) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Map not available - Mapbox token missing</p>
      </div>
    );
  }

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
      <div 
        ref={mapContainer} 
        className="w-full h-full"
        style={{ minHeight: '384px' }}
      />
    </div>
  );
};

export default PropertyMap;
