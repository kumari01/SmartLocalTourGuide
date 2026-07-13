import React, { useEffect, useRef, useState } from 'react';

// Get API Key from environment or fallback
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyD5IlFfYT9GKMpiacvbeCMqp021aNCjjPw';

const loadGoogleMapsScript = (apiKey, callback) => {
  if (window.google && window.google.maps && window.google.maps.OverlayView) {
    callback();
    return;
  }
  
  if (!window.googleMapsCallbacks) {
    window.googleMapsCallbacks = [];
  }
  window.googleMapsCallbacks.push(callback);

  window.googleMapsCallback = () => {
    if (window.googleMapsCallbacks) {
      window.googleMapsCallbacks.forEach(cb => cb());
      window.googleMapsCallbacks = [];
    }
  };

  const existingScript = document.getElementById('google-maps-script');
  if (existingScript) {
    return;
  }

  const script = document.createElement('script');
  script.id = 'google-maps-script';
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async&callback=googleMapsCallback`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
};

// Premium minimalist light map styling (mimicking CartoDB Positron)
const premiumMapStyles = [
  {
    featureType: 'all',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#4b5563' }] // Slate-600
  },
  {
    featureType: 'administrative',
    elementType: 'all',
    stylers: [{ visibility: 'on' }]
  },
  {
    featureType: 'landscape',
    elementType: 'all',
    stylers: [{ color: '#f8fafc' }] // Slate-50
  },
  {
    featureType: 'poi',
    elementType: 'all',
    stylers: [{ visibility: 'off' }] // Hide default points of interest for clean look
  },
  {
    featureType: 'road',
    elementType: 'all',
    stylers: [{ saturation: -100 }, { lightness: 45 }]
  },
  {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ffffff' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'all',
    stylers: [{ visibility: 'simplified' }]
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'transit',
    elementType: 'all',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'water',
    elementType: 'all',
    stylers: [{ color: '#cbd5e1' }, { visibility: 'on' }] // Slate-300
  }
];

export default function MapView({
  currentLocation,
  selectedAttraction,
  selectedRestaurant,
  selectedEvent,
  routePolyline
}) {
  const mapContainerRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);

  const defaultCenter = { lat: 17.7200, lng: 83.3150 }; // Siripuram, Vizag
  const defaultZoom = 13;

  // Refs for tracking Google Maps overlay/marker instances and info windows
  const markersRef = useRef({
    currentLocation: null,
    attraction: null,
    restaurant: null,
    event: null
  });
  const polylineRef = useRef(null);
  const infoWindowRef = useRef(null);
  const directionsServiceRef = useRef(null);
  const directionsRendererRef = useRef(null);

  // Load Google Maps SDK
  useEffect(() => {
    loadGoogleMapsScript(API_KEY, () => {
      setMapLoaded(true);
    });
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapLoaded || !mapContainerRef.current || mapInstance) return;

    // Create custom HTMLMarker class extending OverlayView once window.google is loaded
    if (!window.HTMLMarker) {
      class HTMLMarker extends window.google.maps.OverlayView {
        constructor(position, htmlContent, onClick, map, anchorType = 'bottom') {
          super();
          this.position = position;
          this.htmlContent = htmlContent;
          this.onClick = onClick;
          this.anchorType = anchorType;
          this.div = null;
          this.setMap(map);
        }

        onAdd() {
          const div = document.createElement('div');
          div.style.position = 'absolute';
          div.style.cursor = 'pointer';
          div.innerHTML = this.htmlContent;

          if (this.onClick) {
            div.addEventListener('click', (e) => {
              e.stopPropagation();
              this.onClick();
            });
          }

          this.div = div;
          const panes = this.getPanes();
          panes.overlayMouseTarget.appendChild(div);
        }

        draw() {
          if (!this.div) return;
          const projection = this.getProjection();
          const position = projection.fromLatLngToDivPixel(this.position);

          if (position) {
            this.div.style.left = `${position.x}px`;
            this.div.style.top = `${position.y}px`;
            if (this.anchorType === 'center') {
              this.div.style.transform = 'translate(-50%, -50%)';
            } else {
              this.div.style.transform = 'translate(-50%, -100%)';
            }
          }
        }

        onRemove() {
          if (this.div) {
            if (this.div.parentNode) {
              this.div.parentNode.removeChild(this.div);
            }
            this.div = null;
          }
        }
      }
      window.HTMLMarker = HTMLMarker;
    }

    const map = new window.google.maps.Map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: defaultZoom,
      styles: premiumMapStyles,
      disableDefaultUI: true,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false
    });

    infoWindowRef.current = new window.google.maps.InfoWindow();

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      map: map,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#2563EB',
        strokeOpacity: 0.8,
        strokeWeight: 5
      }
    });

    directionsServiceRef.current = directionsService;
    directionsRendererRef.current = directionsRenderer;

    setMapInstance(map);

    return () => {
      // Cleanup on unmount
      if (markersRef.current.currentLocation) markersRef.current.currentLocation.setMap(null);
      if (markersRef.current.attraction) markersRef.current.attraction.setMap(null);
      if (markersRef.current.restaurant) markersRef.current.restaurant.setMap(null);
      if (markersRef.current.event) markersRef.current.event.setMap(null);
      if (polylineRef.current) polylineRef.current.setMap(null);
      if (infoWindowRef.current) infoWindowRef.current.close();
      if (directionsRendererRef.current) directionsRendererRef.current.setMap(null);
    };
  }, [mapLoaded]);

  // Handle markers updates
  useEffect(() => {
    if (!mapInstance) return;

    // 1. Current Location Marker
    if (markersRef.current.currentLocation) {
      markersRef.current.currentLocation.setMap(null);
      markersRef.current.currentLocation = null;
    }
    if (currentLocation && Array.isArray(currentLocation) && currentLocation.length === 2) {
      const pos = { lat: currentLocation[0], lng: currentLocation[1] };
      markersRef.current.currentLocation = new window.HTMLMarker(
        pos,
        `
        <div class="relative flex items-center justify-center h-6 w-6">
          <div class="absolute h-6 w-6 rounded-full bg-blue-500/30 animate-ping"></div>
          <div class="h-3.5 w-3.5 rounded-full bg-blue-650 border-2 border-white shadow-md"></div>
        </div>
        `,
        () => {
          if (infoWindowRef.current) {
            infoWindowRef.current.setContent(`
              <div class="p-1 font-semibold text-xs text-blue-655">Your Location</div>
            `);
            infoWindowRef.current.setPosition(pos);
            infoWindowRef.current.open(mapInstance);
          }
        },
        mapInstance,
        'center'
      );
    }

    // 2. Selected Attraction Marker
    if (markersRef.current.attraction) {
      markersRef.current.attraction.setMap(null);
      markersRef.current.attraction = null;
    }
    if (selectedAttraction && selectedAttraction.coords) {
      const pos = { lat: selectedAttraction.coords[0], lng: selectedAttraction.coords[1] };
      markersRef.current.attraction = new window.HTMLMarker(
        pos,
        `
        <div class="flex items-center justify-center text-blue-600 filter drop-shadow">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">
            <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.702 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
          </svg>
        </div>
        `,
        () => {
          if (infoWindowRef.current) {
            infoWindowRef.current.setContent(`
              <div class="p-1">
                <div class="font-semibold text-sm text-slate-900">${selectedAttraction.name}</div>
                <div class="text-[10px] text-blue-600 font-medium mt-0.5">${selectedAttraction.category}</div>
                <div class="text-xs text-slate-500 mt-1 line-clamp-2">${selectedAttraction.description}</div>
              </div>
            `);
            infoWindowRef.current.setPosition(pos);
            infoWindowRef.current.open(mapInstance);
          }
        },
        mapInstance,
        'bottom'
      );
    }

    // 3. Selected Restaurant Marker
    if (markersRef.current.restaurant) {
      markersRef.current.restaurant.setMap(null);
      markersRef.current.restaurant = null;
    }
    if (selectedRestaurant && selectedRestaurant.coords) {
      const pos = { lat: selectedRestaurant.coords[0], lng: selectedRestaurant.coords[1] };
      markersRef.current.restaurant = new window.HTMLMarker(
        pos,
        `
        <div class="flex items-center justify-center text-emerald-600 filter drop-shadow">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">
            <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.702 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
          </svg>
        </div>
        `,
        () => {
          if (infoWindowRef.current) {
            infoWindowRef.current.setContent(`
              <div class="p-1">
                <div class="font-semibold text-sm text-slate-900">${selectedRestaurant.name}</div>
                <div class="text-[10px] text-emerald-600 font-medium mt-0.5">${selectedRestaurant.cuisine || 'Restaurant'}</div>
              </div>
            `);
            infoWindowRef.current.setPosition(pos);
            infoWindowRef.current.open(mapInstance);
          }
        },
        mapInstance,
        'bottom'
      );
    }

    // 4. Selected Event Marker
    if (markersRef.current.event) {
      markersRef.current.event.setMap(null);
      markersRef.current.event = null;
    }
    if (selectedEvent && selectedEvent.coords) {
      const pos = { lat: selectedEvent.coords[0], lng: selectedEvent.coords[1] };
      markersRef.current.event = new window.HTMLMarker(
        pos,
        `
        <div class="flex items-center justify-center text-indigo-500 filter drop-shadow">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">
            <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.702 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
          </svg>
        </div>
        `,
        () => {
          if (infoWindowRef.current) {
            infoWindowRef.current.setContent(`
              <div class="p-1">
                <div class="font-semibold text-sm text-slate-900">${selectedEvent.name}</div>
                <div class="text-[10px] text-indigo-500 font-medium mt-0.5">${selectedEvent.venue || 'Event Venue'}</div>
              </div>
            `);
            infoWindowRef.current.setPosition(pos);
            infoWindowRef.current.open(mapInstance);
          }
        },
        mapInstance,
        'bottom'
      );
    }
  }, [mapInstance, currentLocation, selectedAttraction, selectedRestaurant, selectedEvent]);

  // Handle route polyline drawing
  useEffect(() => {
    if (!mapInstance) return;

    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    if (routePolyline && Array.isArray(routePolyline) && routePolyline.length > 0) {
      const path = routePolyline.map(coord => ({ lat: coord[0], lng: coord[1] }));
      polylineRef.current = new window.google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: '#2563EB',
        strokeOpacity: 0.8,
        strokeWeight: 5,
        map: mapInstance
      });
    }
  }, [mapInstance, routePolyline]);

  // Handle client-side turn-by-turn road routing via Directions Service
  useEffect(() => {
    if (!mapInstance || !directionsServiceRef.current || !directionsRendererRef.current) return;

    if (currentLocation && selectedAttraction && selectedAttraction.coords) {
      const origin = { lat: currentLocation[0], lng: currentLocation[1] };
      const destination = { lat: selectedAttraction.coords[0], lng: selectedAttraction.coords[1] };

      directionsServiceRef.current.route(
        {
          origin: origin,
          destination: destination,
          travelMode: window.google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            directionsRendererRef.current.setDirections(result);
            // Hide static polyline if directions succeed
            if (polylineRef.current) {
              polylineRef.current.setMap(null);
            }
          } else {
            console.warn("Client-side Directions Service failed:", status);
            // Fall back to showing static simulated polyline
            directionsRendererRef.current.setDirections({ routes: [] });
            if (routePolyline && routePolyline.length > 0 && polylineRef.current) {
              polylineRef.current.setMap(mapInstance);
            }
          }
        }
      );
    } else {
      directionsRendererRef.current.setDirections({ routes: [] });
    }
  }, [mapInstance, currentLocation, selectedAttraction, routePolyline]);

  // Adjust center and bounds on active elements change
  useEffect(() => {
    if (!mapInstance) return;

    let bounds = null;

    if (routePolyline && Array.isArray(routePolyline) && routePolyline.length > 0) {
      bounds = routePolyline;
    } else if (selectedAttraction && selectedAttraction.coords && currentLocation) {
      bounds = [currentLocation, selectedAttraction.coords];
    }

    if (bounds && bounds.length > 0) {
      const gBounds = new window.google.maps.LatLngBounds();
      bounds.forEach(coord => {
        gBounds.extend({ lat: coord[0], lng: coord[1] });
      });
      mapInstance.fitBounds(gBounds);

      // Prevent extreme zoom when fitting narrow bounds
      const listener = window.google.maps.event.addListener(mapInstance, 'idle', () => {
        if (mapInstance.getZoom() > 15) {
          mapInstance.setZoom(15);
        }
        window.google.maps.event.removeListener(listener);
      });
    } else {
      let center = defaultCenter;
      let zoom = defaultZoom;

      if (selectedAttraction && selectedAttraction.coords) {
        center = { lat: selectedAttraction.coords[0], lng: selectedAttraction.coords[1] };
        zoom = 14;
      }

      mapInstance.panTo(center);
      mapInstance.setZoom(zoom);
    }
  }, [mapInstance, currentLocation, selectedAttraction, selectedRestaurant, selectedEvent, routePolyline]);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-inner border border-slate-100 relative">
      {!mapLoaded && (
        <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center z-10 gap-3">
          <div className="h-8 w-8 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin"></div>
          <p className="text-slate-400 text-xs font-medium">Loading premium maps...</p>
        </div>
      )}
      <div ref={mapContainerRef} className="google-map-container" />
    </div>
  );
}
