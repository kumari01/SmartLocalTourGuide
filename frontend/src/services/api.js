import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

// High quality images of Vizag or general corresponding travel categories
const mockAttractions = [
  {
    id: 1,
    name: "RK Beach (Ramakrishna Beach)",
    category: "Beach & Scenic",
    interests: ["Nature", "Adventure"],
    rating: 4.6,
    distance: "1.8 km",
    coords: [17.7144, 83.3235],
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80",
    description: "One of the most popular beach destinations in Vizag, known for its beautiful sunsets, golden sands, and cultural energy.",
    popularity: "Very High",
    openingHours: "Open 24 Hours",
    crowdLevel: "Moderate"
  },
  {
    id: 2,
    name: "Kailasagiri",
    category: "Hill Park & Viewpoint",
    interests: ["Nature", "Historical Places"],
    rating: 4.7,
    distance: "5.5 km",
    coords: [17.7492, 83.3423],
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    description: "A scenic hilltop park offering panoramic views of the city and the Bay of Bengal, featuring iconic massive Shiva-Parvati statues.",
    popularity: "High",
    openingHours: "6:00 AM - 8:00 PM",
    crowdLevel: "Low"
  },
  {
    id: 3,
    name: "Rushikonda Beach",
    category: "Beach & Adventure",
    interests: ["Nature", "Adventure"],
    rating: 4.8,
    distance: "11.0 km",
    coords: [17.7816, 83.3852],
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=600&q=80",
    description: "Renowned for its clean shores, watersports, surfing, and the stunning green hillocks framing the bay.",
    popularity: "High",
    openingHours: "Open 24 Hours",
    crowdLevel: "High"
  },
  {
    id: 4,
    name: "Yarada Beach",
    category: "Beach & Nature",
    interests: ["Nature"],
    rating: 4.7,
    distance: "15.0 km",
    coords: [17.6543, 83.2690],
    image: "https://images.unsplash.com/photo-1473116763269-25541579ffb7?auto=format&fit=crop&w=600&q=80",
    description: "A peaceful and secluded beach surrounded by lush green hills, offering a tranquil escape from the city.",
    popularity: "Medium",
    openingHours: "6:00 AM - 7:00 PM",
    crowdLevel: "Low"
  },
  {
    id: 5,
    name: "Dolphin's Nose Lighthouse",
    category: "Landmark & Viewpoint",
    interests: ["Historical Places", "Nature"],
    rating: 4.5,
    distance: "12.0 km",
    coords: [17.6767, 83.2917],
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    description: "A colossal rocky headland shaped like a dolphin's nose, offering majestic views of the harbor and ocean.",
    popularity: "Medium",
    openingHours: "3:00 PM - 5:00 PM",
    crowdLevel: "Moderate"
  },
  {
    id: 6,
    name: "INS Kurusura Submarine Museum",
    category: "Museum & History",
    interests: ["Historical Places", "Shopping"],
    rating: 4.8,
    distance: "2.4 km",
    coords: [17.7176, 83.3303],
    image: "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?auto=format&fit=crop&w=600&q=80",
    description: "A real decommissioned Russian-built submarine parked on the sands of RK Beach, showcasing marine warfare history.",
    popularity: "Very High",
    openingHours: "2:00 PM - 8:30 PM",
    crowdLevel: "Busy"
  },
  {
    id: 7,
    name: "TU-142 Aircraft Museum",
    category: "Museum & Aviation",
    interests: ["Historical Places"],
    rating: 4.7,
    distance: "2.5 km",
    coords: [17.7180, 83.3308],
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80",
    description: "Located opposite the Submarine Museum, this museum houses a preserved naval maritime reconnaissance aircraft.",
    popularity: "High",
    openingHours: "2:00 PM - 8:30 PM",
    crowdLevel: "Moderate"
  },
  {
    id: 8,
    name: "Tenneti Park",
    category: "Park & Scenic",
    interests: ["Nature", "Nightlife"],
    rating: 4.6,
    distance: "4.8 km",
    coords: [17.7444, 83.3444],
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80",
    description: "An urban park perched on a cliff edge, overlooking the sea and a cargo ship grounded nearby.",
    popularity: "High",
    openingHours: "6:00 AM - 9:00 PM",
    crowdLevel: "Moderate"
  },
  {
    id: 9,
    name: "Simhachalam Temple",
    category: "Temple & Heritage",
    interests: ["Historical Places"],
    rating: 4.8,
    distance: "12.5 km",
    coords: [17.7664, 83.2505],
    image: "https://images.unsplash.com/photo-1609137144813-9794014d5e86?auto=format&fit=crop&w=600&q=80",
    description: "An ancient 11th-century hilltop temple dedicated to the Varaha Lakshmi Narasimha avatar of Vishnu.",
    popularity: "Very High",
    openingHours: "7:00 AM - 8:30 PM",
    crowdLevel: "High"
  },
  {
    id: 10,
    name: "Borra Caves",
    category: "Caves & Adventure",
    interests: ["Adventure", "Nature"],
    rating: 4.6,
    distance: "88.0 km",
    coords: [18.2801, 83.0385],
    image: "https://images.unsplash.com/photo-1507163519048-d36c5e27a14f?auto=format&fit=crop&w=600&q=80",
    description: "Million-year-old limestone caves containing unique stalactite and stalagmite formations, located in the scenic Ananthagiri hills.",
    popularity: "High",
    openingHours: "10:00 AM - 5:00 PM",
    crowdLevel: "Moderate"
  }
];

const mockRestaurants = [
  {
    id: 1,
    name: "Paradise Biryani",
    cuisine: "Hyderabadi Biryani & Mughlai",
    rating: 4.2,
    distance: "1.2 km",
    coords: [17.7203, 83.3085],
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80",
    budgetCost: 350,
    budgetEstimate: "₹350 for two",
    isVeg: false,
    openingStatus: "Open Now",
    menu: [
      { name: "Special Chicken Biryani", price: "₹290" },
      { name: "Mutton Biryani", price: "₹340" },
      { name: "Double ka Meetha", price: "₹90" }
    ]
  },
  {
    id: 2,
    name: "Dharani Restaurant",
    cuisine: "Traditional South Indian Veg",
    rating: 4.4,
    distance: "1.1 km",
    coords: [17.7196, 83.3101],
    image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=400&q=80",
    budgetCost: 250,
    budgetEstimate: "₹250 for two",
    isVeg: true,
    openingStatus: "Open Now",
    menu: [
      { name: "South Indian Thali", price: "₹180" },
      { name: "Special Ghee Roast Dosa", price: "₹90" },
      { name: "Filter Coffee", price: "₹40" }
    ]
  },
  {
    id: 3,
    name: "Upland Bistro",
    cuisine: "Continental & Gourmet Cafe",
    rating: 4.5,
    distance: "0.4 km",
    coords: [17.7231, 83.3150],
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80",
    budgetCost: 600,
    budgetEstimate: "₹600 for two",
    isVeg: false,
    openingStatus: "Open Now",
    menu: [
      { name: "Avocado Sourdough Toast", price: "₹240" },
      { name: "Grilled Chicken Steak", price: "₹380" },
      { name: "Mocha Frappe", price: "₹160" }
    ]
  },
  {
    id: 4,
    name: "Vista Restaurant",
    cuisine: "Multi-Cuisine & Sea View",
    rating: 4.3,
    distance: "1.8 km",
    coords: [17.7153, 83.3248],
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80",
    budgetCost: 800,
    budgetEstimate: "₹800 for two",
    isVeg: false,
    openingStatus: "Open Now",
    menu: [
      { name: "Tandoori Platter", price: "₹450" },
      { name: "Butter Garlic Prawns", price: "₹390" },
      { name: "Virgin Mojito", price: "₹120" }
    ]
  },
  {
    id: 5,
    name: "Mekong",
    cuisine: "Pan-Asian & Chinese",
    rating: 4.6,
    distance: "1.6 km",
    coords: [17.7210, 83.3280],
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=400&q=80",
    budgetCost: 1000,
    budgetEstimate: "₹1000 for two",
    isVeg: false,
    openingStatus: "Open Now",
    menu: [
      { name: "Dim Sum Basket", price: "₹280" },
      { name: "Hakka Noodles", price: "₹220" },
      { name: "Thai Green Curry Veg", price: "₹310" }
    ]
  },
  {
    id: 6,
    name: "Barbeque Nation",
    cuisine: "Barbeque Buffets & Grills",
    rating: 4.4,
    distance: "0.5 km",
    coords: [17.7185, 83.3180],
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&q=80",
    budgetCost: 1400,
    budgetEstimate: "₹1400 for two",
    isVeg: false,
    openingStatus: "Open Now",
    menu: [
      { name: "Non-Veg Dinner Buffet", price: "₹750" },
      { name: "Veg Dinner Buffet", price: "₹650" }
    ]
  },
  {
    id: 7,
    name: "Kamat Restaurant",
    cuisine: "South Indian Vegetarian Meals",
    rating: 4.1,
    distance: "1.7 km",
    coords: [17.7120, 83.3235],
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80",
    budgetCost: 200,
    budgetEstimate: "₹200 for two",
    isVeg: true,
    openingStatus: "Open Now",
    menu: [
      { name: "Andhra Veg Meals", price: "₹120" },
      { name: "Idli Sambar", price: "₹50" },
      { name: "Upma", price: "₹60" }
    ]
  }
];

const mockEvents = [
  {
    id: 1,
    name: "RK Beach Cultural Festival",
    date: "Dec 25 - Dec 27",
    venue: "RK Beach Stage",
    time: "5:00 PM - 10:00 PM",
    coords: [17.7144, 83.3235],
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80",
    category: "Cultural Events"
  },
  {
    id: 2,
    name: "Vizag Food Carnival",
    date: "Jan 5 - Jan 8",
    venue: "AU Grounds, Siripuram",
    time: "4:00 PM - 11:00 PM",
    coords: [17.7210, 83.3190],
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80",
    category: "Food Festivals"
  },
  {
    id: 3,
    name: "Live Music Night",
    date: "Every Friday",
    venue: "Upland Bistro",
    time: "8:00 PM - 11:00 PM",
    coords: [17.7231, 83.3150],
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80",
    category: "Music Concerts"
  },
  {
    id: 4,
    name: "Beach Marathon",
    date: "Feb 15",
    venue: "RK Beach Road",
    time: "5:00 AM - 9:00 AM",
    coords: [17.7144, 83.3235],
    image: "https://images.unsplash.com/photo-1502224562085-639556652f33?auto=format&fit=crop&w=400&q=80",
    category: "Exhibitions"
  },
  {
    id: 5,
    name: "Local Art Exhibition",
    date: "Mar 10 - Mar 15",
    venue: "Visakha Museum",
    time: "10:00 AM - 7:00 PM",
    coords: [17.7180, 83.3308],
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=400&q=80",
    category: "Exhibitions"
  }
];

// Helper to generate a polyline route between two points
const generatePolyline = (start, end) => {
  // Return a realistic route with some intermediate bends to look like real roads
  const mid1 = [start[0] + (end[0] - start[0]) * 0.3 + 0.002, start[1] + (end[1] - start[1]) * 0.2 - 0.001];
  const mid2 = [start[0] + (end[0] - start[0]) * 0.7 - 0.001, start[1] + (end[1] - start[1]) * 0.8 + 0.002];
  return [start, mid1, mid2, end];
};

export const getAttractions = async () => {
  try {
    const response = await api.get('/attractions');
    return response.data;
  } catch (error) {
    console.warn("FastAPI backend not found. Using local mock data for attractions.");
    return mockAttractions;
  }
};

export const getRestaurants = async () => {
  try {
    const response = await api.get('/restaurants');
    return response.data;
  } catch (error) {
    console.warn("FastAPI backend not found. Using local mock data for restaurants.");
    return mockRestaurants;
  }
};

export const getEvents = async () => {
  try {
    const response = await api.get('/events');
    return response.data;
  } catch (error) {
    console.warn("FastAPI backend not found. Using local mock data for events.");
    return mockEvents;
  }
};

export const getNavigation = async (startCoords, endCoords, mode = 'driving') => {
  try {
    const sourceStr = startCoords.join(',');
    const destStr = endCoords.join(',');

    const response = await api.get('/navigation', {
      params: {
        source: sourceStr,
        destination: destStr
      }
    });

    const data = response.data;
    if (data && data.status === 'success') {
      // Map GeoJSON coordinate arrays [lon, lat] back to Leaflet [lat, lon]
      const leafletRoute = data.route.map(coord => [coord[1], coord[0]]);
      return {
        polyline: leafletRoute,
        distance: `${data.distance_km} km`,
        duration: `${Math.round(data.duration_minutes)} mins`,
        travelMode: data.travel_mode
      };
    } else {
      throw new Error(data.error || 'Failed to query navigation route from agent');
    }
  } catch (error) {
    console.warn("FastAPI Navigation agent query failed, trying public OSRM street-by-street routing fallback. Error:", error.message);
    
    try {
      // Query OSRM driving service for actual street-by-street road routing
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startCoords[1]},${startCoords[0]};${endCoords[1]},${endCoords[0]}?overview=full&geometries=geojson`;
      const osrmRes = await axios.get(osrmUrl);
      const osrmData = osrmRes.data;
      
      if (osrmData && osrmData.code === 'Ok' && osrmData.routes && osrmData.routes.length > 0) {
        const route = osrmData.routes[0];
        // OSRM returns coordinates as [lon, lat], map to [lat, lon] for Leaflet/Google Maps
        const leafletRoute = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
        const distanceVal = (route.distance / 1000).toFixed(1);
        const durationVal = Math.round(route.duration / 60);
        
        return {
          polyline: leafletRoute,
          distance: `${distanceVal} km`,
          duration: `${durationVal} mins`,
          travelMode: mode.charAt(0).toUpperCase() + mode.slice(1)
        };
      }
    } catch (osrmError) {
      console.warn("OSRM routing fallback failed, falling back to simulated straight line. Error:", osrmError.message);
    }
    
    // Fallback: Calculate a realistic distance using simple coordinate math (Haversine formula approximation)
    const lat1 = startCoords[0];
    const lon1 = startCoords[1];
    const lat2 = endCoords[0];
    const lon2 = endCoords[1];
    
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const rawDist = R * c;
    const distanceVal = parseFloat(rawDist.toFixed(1));
    
    // Estimate travel time: average speed of 30 km/h in Indian traffic plus some buffer
    const speed = 25; // km/h
    const rawTime = (rawDist / speed) * 60; // in minutes
    const timeVal = Math.max(Math.round(rawTime), 2); // minimum 2 mins
    
    return {
      polyline: generatePolyline(startCoords, endCoords),
      distance: `${distanceVal} km`,
      duration: `${timeVal} mins`,
      travelMode: mode.charAt(0).toUpperCase() + mode.slice(1)
    };
  }
};
