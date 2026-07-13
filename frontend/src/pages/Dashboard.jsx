import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MapView from '../components/MapView';
import RouteInfoCard from '../components/RouteInfoCard';
import SimulationWidget from '../components/SimulationWidget';
import {
  getAttractions,
  getRestaurants,
  getEvents,
  getNavigation
} from '../services/api';
import { X, Calendar, Clock, Coffee, Utensils, Star, Compass, AlertTriangle, CheckCircle2 } from 'lucide-react';

// Default Visakhapatnam center (Siripuram Junction)
const DEFAULT_COORDS = [17.7200, 83.3150];

export default function Dashboard() {
  // Parsing Preferences
  const [preferences, setPreferences] = useState({
    location: 'Visakhapatnam',
    destination: '',
    budget: '2000',
    interests: ['Nature', 'Historical Places'],
    time: 'Full day'
  });

  // App States
  const [currentLocation, setCurrentLocation] = useState(DEFAULT_COORDS);
  const [attractions, setAttractions] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [events, setEvents] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Navigation & Directions Target State
  const [navigationTarget, setNavigationTarget] = useState(null);
  const [selectedTransitMode, setSelectedTransitMode] = useState('Driving');
  const [routeInfo, setRouteInfo] = useState(null);
  const [routePolyline, setRoutePolyline] = useState([]);
  const [isNavigating, setIsNavigating] = useState(false);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simulated Menu & Reservation Modal states
  const [activeMenuRestaurant, setActiveMenuRestaurant] = useState(null);
  const [activeReservationRestaurant, setActiveReservationRestaurant] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingName, setBookingName] = useState('John Doe');
  const [bookingTime, setBookingTime] = useState('01:30 PM');
  const [addedEvents, setAddedEvents] = useState([]);

  // Simulation Engine States
  const [simulatedTraffic, setSimulatedTraffic] = useState('normal'); // 'normal' | 'heavy'
  const [attractionStatus, setAttractionStatus] = useState('open'); // 'open' | 'closed'
  const [restaurantStatus, setRestaurantStatus] = useState('open'); // 'open' | 'full'
  const [activeAlert, setActiveAlert] = useState(null);

  // Parse location and preference parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lat = parseFloat(params.get('lat'));
    const lng = parseFloat(params.get('lng'));
    if (!isNaN(lat) && !isNaN(lng)) {
      setCurrentLocation([lat, lng]);
    } else {
      // Query browser's Geolocation API to get the user's actual physical location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation([latitude, longitude]);
          },
          (error) => {
            console.warn("Browser geolocation failed or denied, using default coords:", error.message);
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      }
    }

    const locationVal = params.get('location') || 'Visakhapatnam';
    const destinationVal = params.get('destination') || '';
    const budgetVal = params.get('budget') || '2000';
    const interestsVal = params.get('interests') ? params.get('interests').split(',') : ['Nature', 'Historical Places'];
    const timeVal = params.get('time') || 'Full day';

    setPreferences({
      location: locationVal,
      destination: destinationVal,
      budget: budgetVal,
      interests: interestsVal,
      time: timeVal
    });
  }, []);

  // Fetch initial data
  useEffect(() => {
    async function loadData() {
      try {
        const [attList, restList, evList] = await Promise.all([
          getAttractions(),
          getRestaurants(),
          getEvents()
        ]);
        setAttractions(attList);
        setRestaurants(restList);
        setEvents(evList);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Helper: Simple Euclidean distance for local sorting
  const getDistance = (c1, c2) => {
    if (!c1 || !c2) return Infinity;
    return Math.sqrt(Math.pow(c1[0] - c2[0], 2) + Math.pow(c1[1] - c2[1], 2));
  };

  // Helper: Haversine distance in km for realistic display
  const getHaversineDistance = (c1, c2) => {
    if (!c1 || !c2) return 0;
    const lat1 = c1[0];
    const lon1 = c1[1];
    const lat2 = c2[0];
    const lon2 = c2[1];
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return parseFloat((R * c).toFixed(1));
  };

  // Route updates when navigation target or transit mode changes
  useEffect(() => {
    if (!navigationTarget) {
      setRouteInfo(null);
      setRoutePolyline([]);
      setIsNavigating(false);
      return;
    }

    async function fetchRoute() {
      try {
        const mode = selectedTransitMode.toLowerCase();
        const navData = await getNavigation(currentLocation, navigationTarget.coords, mode);
        
        // Simulating the traffic detours when simulatedTraffic is set to heavy
        if (simulatedTraffic === 'heavy') {
          const rawMins = parseInt(navData.duration);
          const rawKm = parseFloat(navData.distance);
          setRouteInfo({
            polyline: navData.polyline,
            distance: `${(rawKm + 1.4).toFixed(1)} km`,
            duration: `${rawMins + 12} mins`,
            travelMode: `${selectedTransitMode} (Recalculated Detour 🚧)`
          });
        } else {
          setRouteInfo({
            ...navData,
            travelMode: selectedTransitMode
          });
        }
        setRoutePolyline(navData.polyline);
      } catch (err) {
        console.error("Failed to load navigation route:", err);
      }
    }
    fetchRoute();

    // Close mobile sidebar on selection
    setIsSidebarOpen(false);
  }, [navigationTarget, currentLocation, selectedTransitMode, simulatedTraffic]);

  // Sync navigation target when Selected Attraction changes
  useEffect(() => {
    setNavigationTarget(selectedAttraction);
    // Reset secondary choices if switching primary attraction
    setSelectedRestaurant(null);
    setSelectedEvent(null);
  }, [selectedAttraction]);

  // Handle Start Navigation trigger
  const handleStartNavigation = () => {
    setIsNavigating(!isNavigating);
  };

  // Handle exploring nearby locations relative to reached destination
  const handleExploreNearby = (newCoords, locationName) => {
    setCurrentLocation(newCoords);
    setIsNavigating(false);
    setPreferences(prev => ({
      ...prev,
      location: locationName
    }));
    setNavigationTarget(null);
    setSelectedAttraction(null);
    setSelectedRestaurant(null);
    setSelectedEvent(null);
  };

  // Filter, sort, and inject dynamic distances
  const getFilteredAndSorted = () => {
    // 1. Filter and Rank attractions based on interests
    let filteredAtts = attractions.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Scoring algorithm simulating "Attraction Search Agent" prioritizing selected interests
    filteredAtts = filteredAtts.map(item => {
      let score = 0;
      if (item.interests) {
        score = item.interests.filter(interest => preferences.interests.includes(interest)).length;
      }
      return { ...item, searchScore: score };
    });

    // Rank attractions: match score first (desc), then rating (desc), then distance (asc)
    filteredAtts.sort((a, b) => {
      if (b.searchScore !== a.searchScore) return b.searchScore - a.searchScore;
      if (b.rating !== a.rating) return b.rating - a.rating;
      return getDistance(a.coords, currentLocation) - getDistance(b.coords, currentLocation);
    });

    // 2. Filter restaurants by search query and budget
    let filteredRests = restaurants.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Soft-filter: flag if it fits user budget (meal cost <= budget * 0.4)
    filteredRests = filteredRests.map(item => ({
      ...item,
      fitsBudget: item.budgetCost <= (parseFloat(preferences.budget) * 0.4)
    }));

    // Prioritize budget fits, then sort by rating / distance
    filteredRests.sort((a, b) => {
      if (b.fitsBudget !== a.fitsBudget) return b.fitsBudget ? 1 : -1;
      return b.rating - a.rating;
    });

    // 3. Filter events by search
    let filteredEvs = events.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.venue.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // If an attraction is selected, sort restaurants & events by proximity to it
    if (selectedAttraction) {
      filteredRests = [...filteredRests].sort((a, b) => 
        getDistance(a.coords, selectedAttraction.coords) - getDistance(b.coords, selectedAttraction.coords)
      );
      filteredEvs = [...filteredEvs].sort((a, b) =>
        getDistance(a.coords, selectedAttraction.coords) - getDistance(b.coords, selectedAttraction.coords)
      );
    }

    // Inject dynamic distances relative to currentLocation
    const attsWithDistance = filteredAtts.map(item => ({
      ...item,
      distance: `${getHaversineDistance(currentLocation, item.coords)} km`
    }));

    const restsWithDistance = filteredRests.map(item => ({
      ...item,
      distance: `${getHaversineDistance(selectedAttraction ? selectedAttraction.coords : currentLocation, item.coords)} km`
    }));

    const evsWithDistance = filteredEvs.map(item => ({
      ...item,
      distance: `${getHaversineDistance(selectedAttraction ? selectedAttraction.coords : currentLocation, item.coords)} km`
    }));

    return { 
      filteredAtts: attsWithDistance, 
      filteredRests: restsWithDistance, 
      filteredEvs: evsWithDistance 
    };
  };

  const { filteredAtts, filteredRests, filteredEvs } = getFilteredAndSorted();

  // Helper to generate personalized day plan timeline
  const generateItineraryTimeline = () => {
    if (!selectedAttraction) return [];
    const transit = routeInfo?.travelMode || 'Driving';
    const duration = routeInfo?.duration || '15 mins';

    const timeline = [
      {
        time: '09:00 AM',
        title: currentLocation === DEFAULT_COORDS ? `Depart from ${preferences.location}` : 'Depart from Current Location',
        description: `Starting location. Route planned by Navigation Agent via ${transit} (ETA: ${duration}).`,
        type: 'start'
      },
      {
        time: '09:30 AM',
        title: `Explore ${selectedAttraction.name.split(' (')[0]}`,
        description: `Ranked attraction. Category: ${selectedAttraction.category}. Crowd: ${selectedAttraction.crowdLevel}.`,
        type: 'attraction',
        item: selectedAttraction
      }
    ];

    if (selectedRestaurant) {
      timeline.push({
        time: '01:00 PM',
        title: `Lunch at ${selectedRestaurant.name}`,
        description: `Cuisine: ${selectedRestaurant.cuisine}. Budget tier: ${selectedRestaurant.budgetEstimate}.`,
        type: 'restaurant',
        item: selectedRestaurant
      });
    } else {
      timeline.push({
        time: '01:00 PM',
        title: 'Lunch Break Recommendation',
        description: 'Choose a nearby restaurant from the list to add to your plan.',
        type: 'lunch-placeholder'
      });
    }

    if (selectedEvent) {
      timeline.push({
        time: '05:00 PM',
        title: `Attend ${selectedEvent.name}`,
        description: `Event Agent discovery. Venue: ${selectedEvent.venue} (${selectedEvent.time}).`,
        type: 'event',
        item: selectedEvent
      });
    } else if (addedEvents.length > 0) {
      timeline.push({
        time: '05:00 PM',
        title: `Attend ${addedEvents[0].name}`,
        description: `Event Agent discovery. Venue: ${addedEvents[0].venue} (${addedEvents[0].time}).`,
        type: 'event',
        item: addedEvents[0]
      });
    } else {
      timeline.push({
        time: '05:00 PM',
        title: 'Evening Activities Recommendation',
        description: 'Explore upcoming live events near you and add to plan.',
        type: 'event-placeholder'
      });
    }

    timeline.push({
      time: '08:30 PM',
      title: 'Return to Destination',
      description: `Itinerary completed. Navigation Agent generated optimal return path.`,
      type: 'end'
    });

    return timeline;
  };

  const timelineItems = generateItineraryTimeline();

  // Simulated Agent Triggers
  const triggerTrafficCongestion = () => {
    setSimulatedTraffic('heavy');
    setActiveAlert({
      agentName: 'Navigation Agent',
      message: '🚨 Extreme traffic congestion detected on Siripuram VIP Road. Re-calculating faster route options with minor detours (+12 minutes travel time).',
      onDismiss: () => setActiveAlert(null)
    });
  };

  const triggerAttractionClosed = () => {
    setAttractionStatus('closed');
    const alternativeAttraction = attractions.find(a => a.id === 8); // Tenneti Park
    setActiveAlert({
      agentName: 'Attraction Search Agent',
      message: `⚠️ Selected attraction "${selectedAttraction ? selectedAttraction.name.split(' (')[0] : 'RK Beach'}" is reported as temporarily closed today. Would you like to redirect to Tenneti Park (4.8 km, rating 4.6) instead?`,
      action: {
        text: 'Accept Alternative',
        handler: () => {
          setSelectedAttraction(alternativeAttraction);
          setNavigationTarget(alternativeAttraction);
          setActiveAlert(null);
        }
      },
      onDismiss: () => setActiveAlert(null)
    });
  };

  const triggerRestaurantFull = () => {
    setRestaurantStatus('full');
    const alternativeRestaurant = restaurants.find(r => r.id === 7); // Kamat
    setActiveAlert({
      agentName: 'Restaurant Agent',
      message: `🚫 Table booking unavailable. Paradise Biryani is fully occupied. Would you like to reserve a table at the highly-rated Kamat Restaurant (1.7 km, ₹200 for two) instead?`,
      action: {
        text: 'Reserve Backup',
        handler: () => {
          setSelectedRestaurant(alternativeRestaurant);
          setActiveReservationRestaurant(alternativeRestaurant);
          setBookingConfirmed(false);
          setActiveAlert(null);
        }
      },
      onDismiss: () => setActiveAlert(null)
    });
  };

  const triggerNewEventAlert = () => {
    const foodCarnival = events.find(e => e.id === 2); // Food Carnival
    setActiveAlert({
      agentName: 'Event Recommendation Agent',
      message: `🎉 Exclusive Event Alert: "Vizag Food Carnival" starts today at AU Grounds (4:00 PM - 11:00 PM). It fits your schedule! Add to your personalized day plan?`,
      action: {
        text: 'Add to Itinerary',
        handler: () => {
          setSelectedEvent(foodCarnival);
          setAddedEvents([foodCarnival]);
          setActiveAlert(null);
        }
      },
      onDismiss: () => setActiveAlert(null)
    });
  };

  const handleResetSimulation = () => {
    setSimulatedTraffic('normal');
    setAttractionStatus('open');
    setRestaurantStatus('open');
    setActiveAlert(null);
    setSelectedTransitMode('Driving');
    setAddedEvents([]);
    setSelectedRestaurant(null);
    setSelectedEvent(null);
    if (attractions.length > 0) {
      setSelectedAttraction(attractions[0]);
    }
  };

  // Setup default selection on load
  useEffect(() => {
    if (filteredAtts.length > 0 && !selectedAttraction) {
      setSelectedAttraction(filteredAtts[0]);
    }
  }, [filteredAtts, selectedAttraction]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-55 flex flex-col items-center justify-center text-slate-800">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-slate-500">Loading Vizag Guide...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 text-slate-800">
      {/* Navbar */}
      <Navbar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Left Side: Sidebar (collapsible) */}
        <Sidebar 
          attractions={filteredAtts}
          restaurants={filteredRests}
          events={filteredEvs}
          selectedAttraction={selectedAttraction}
          setSelectedAttraction={(attraction) => {
            setSelectedAttraction(attraction);
          }}
          selectedRestaurant={selectedRestaurant}
          setSelectedRestaurant={setSelectedRestaurant}
          selectedEvent={selectedEvent || (addedEvents.length > 0 ? addedEvents[0] : null)}
          setSelectedEvent={(ev) => {
            setSelectedEvent(ev);
            if (ev) setAddedEvents([ev]);
            else setAddedEvents([]);
          }}
          isOpen={isSidebarOpen}
          // Restaurant Agent Card actions
          onViewMenu={(rest) => setActiveMenuRestaurant(rest)}
          onReserveTable={(rest) => {
            setActiveReservationRestaurant(rest);
            setBookingConfirmed(false);
          }}
          onGetDirections={(rest) => {
            setNavigationTarget(rest);
            setIsNavigating(true);
          }}
          // Day Plan items
          timelineItems={timelineItems}
          preferences={preferences}
        />

        {/* Right Side: Map & Route Info Panel */}
        <main className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto lg:overflow-hidden h-full gap-4 md:gap-5 bg-slate-100">
          
          {/* Top preferences info bar */}
          <div className="bg-white border border-slate-200 px-4 py-3 rounded-xl flex flex-wrap gap-4 items-center justify-between text-xs text-slate-700 shadow-xs shrink-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded font-bold border border-blue-100">Preferences</span>
              <span className="text-slate-500">Budget: <strong>₹{preferences.budget}</strong></span>
              <span className="text-slate-500">| Time: <strong>{preferences.time}</strong></span>
              <span className="hidden sm:inline text-slate-500">| Location: <strong>{preferences.location}</strong></span>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {preferences.interests.map(interest => (
                <span key={interest} className="px-2 py-0.5 bg-blue-50/50 text-blue-600 rounded-[4px] font-semibold border border-blue-100">
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Large Interactive Map */}
          <div className="flex-1 min-h-[300px] lg:min-h-0 relative rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
            <MapView 
              currentLocation={currentLocation}
              selectedAttraction={selectedAttraction}
              selectedRestaurant={selectedRestaurant}
              selectedEvent={selectedEvent || (addedEvents.length > 0 ? addedEvents[0] : null)}
              routePolyline={routePolyline}
            />
          </div>

          {/* Route Information Card */}
          <div className="shrink-0">
            <RouteInfoCard 
              routeInfo={routeInfo}
              selectedAttraction={navigationTarget || selectedAttraction}
              onStartNavigation={handleStartNavigation}
              isNavigating={isNavigating}
              transitMode={selectedTransitMode}
              setTransitMode={setSelectedTransitMode}
              simulatedTraffic={simulatedTraffic}
              onExploreNearby={handleExploreNearby}
            />
          </div>
        </main>

        {/* Mobile Sidebar overlay backdrop */}
        {isSidebarOpen && (
          <div 
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 lg:hidden"
          />
        )}

      </div>

      {/* Floating Simulation Widget */}
      <SimulationWidget 
        onSimulateTraffic={triggerTrafficCongestion}
        onSimulateAttractionClosed={triggerAttractionClosed}
        onSimulateRestaurantFull={triggerRestaurantFull}
        onSimulateNewEvent={triggerNewEventAlert}
        onResetSimulation={handleResetSimulation}
        activeAlert={activeAlert}
      />

      {/* ============================== MODAL: RESTAURANT MENU ============================== */}
      {activeMenuRestaurant && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative text-slate-850">
            <button
              onClick={() => setActiveMenuRestaurant(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <Utensils className="h-5 w-5 text-teal-600" />
              <h3 className="font-bold text-lg text-slate-900">{activeMenuRestaurant.name} Menu</h3>
            </div>
            
            <p className="text-[11px] text-slate-500 mb-4">{activeMenuRestaurant.cuisine} • Rating {activeMenuRestaurant.rating}★</p>
            
            <div className="space-y-3 mb-6">
              {activeMenuRestaurant.menu && activeMenuRestaurant.menu.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                  <span className="font-medium text-slate-800">{item.name}</span>
                  <span className="text-teal-600 font-bold font-mono">{item.price}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveMenuRestaurant(null)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Close Menu
            </button>
          </div>
        </div>
      )}

      {/* ============================== MODAL: TABLE RESERVATION ============================== */}
      {activeReservationRestaurant && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative text-slate-850">
            <button
              onClick={() => setActiveReservationRestaurant(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {!bookingConfirmed ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                setBookingConfirmed(true);
              }} className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Coffee className="h-5 w-5 text-teal-600" />
                  <h3 className="font-bold text-lg text-slate-900">Reserve Table</h3>
                </div>
                <p className="text-xs text-slate-500">Book your table at <strong>{activeReservationRestaurant.name}</strong> near attraction.</p>
                
                <div>
                  <label className="block mb-1 text-xs font-semibold text-slate-600">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                    className="w-full bg-slate-55 border border-slate-200 text-slate-900 rounded-lg p-2 text-xs focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-xs font-semibold text-slate-600">Reservation Time</label>
                  <input
                    type="text"
                    required
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full bg-slate-55 border border-slate-200 text-slate-900 rounded-lg p-2 text-xs focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 outline-hidden"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveReservationRestaurant(null)}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors cursor-pointer border border-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-4 py-4">
                <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Booking Confirmed!</h3>
                  <p className="text-xs text-slate-500 mt-1">Table reserved for <strong>{bookingName}</strong> at <strong>{activeReservationRestaurant.name}</strong>.</p>
                  <p className="text-[10px] text-teal-600 font-mono mt-2 bg-teal-50 border border-teal-100 py-1 px-2 rounded inline-block">Time: {bookingTime} | Booking ID: SGT-{Math.floor(1000 + Math.random() * 9000)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveReservationRestaurant(null)}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Great, thanks!
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
