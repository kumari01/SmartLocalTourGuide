import React, { useState, useEffect } from 'react';
import { Clock, Navigation, MapPin, Compass, CheckCircle2, Car, Footprints, Bike, Bus, AlertTriangle } from 'lucide-react';

export default function RouteInfoCard({ 
  routeInfo, 
  selectedAttraction, 
  onStartNavigation, 
  isNavigating,
  transitMode,
  setTransitMode,
  simulatedTraffic,
  onExploreNearby
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Generate different navigation steps depending on the selected transit mode
  const getSteps = () => {
    if (!selectedAttraction) return [];
    const name = selectedAttraction.name.split(' (')[0];
    
    switch (transitMode) {
      case 'Walking':
        return [
          { text: "Walk East from Siripuram Junction toward VIP Road", dist: "150m" },
          { text: "Turn right onto VIP Road pedestrian pathway", dist: "800m" },
          { text: "Walk along the RK Beach promenade walkway", dist: "700m" },
          { text: `Arrived at ${name} via the beach boardwalk entrance.`, dist: "0m" }
        ];
      case 'Bicycling':
        return [
          { text: "Ride East on Siripuram bike lane toward VIP Road", dist: "200m" },
          { text: "Turn right onto VIP Road cycle track", dist: "1.0 km" },
          { text: "Merge onto Beach Road cycle lane", dist: "600m" },
          { text: `Arrived at ${name} bicycle rack.`, dist: "0m" }
        ];
      case 'Transit':
        return [
          { text: "Walk 100m to Siripuram Junction Bus Stop", dist: "100m" },
          { text: "Take Bus 10A (RTC) toward RK Beach Stage", dist: "1.8 km (4 stops)" },
          { text: "Get off at Beach Road roundabout stop", dist: "150m" },
          { text: `Arrived at ${name} main gates.`, dist: "0m" }
        ];
      case 'Driving':
      default:
        if (simulatedTraffic === 'heavy') {
          return [
            { text: "Head East on Siripuram Junction road toward VIP Road", dist: "300m" },
            { text: "⚠️ Traffic Congestion on VIP Road! Navigation Agent routing detour via Pandurangapuram lanes", dist: "1.5 km" },
            { text: "Turn right onto Beach Road from Pandurangapuram bypass", dist: "1.1 km" },
            { text: `Arrived at ${name}.`, dist: "0m" }
          ];
        }
        return [
          { text: "Head East on Siripuram Junction road toward VIP Road", dist: "300m" },
          { text: "Turn right onto VIP Road at the crossroads", dist: "1.2 km" },
          { text: "Merge onto Beach Road (Rama Krishna Beach Road)", dist: "800m" },
          { text: `Turn left at the roundabout toward ${name}`, dist: "400m" },
          { text: `Arrived at ${name} on the right.`, dist: "0m" }
        ];
    }
  };

  const steps = getSteps();

  // Reset steps when attraction or mode changes
  useEffect(() => {
    setCurrentStepIndex(0);
  }, [selectedAttraction, transitMode]);

  // Simulate progress through navigation steps when active
  useEffect(() => {
    let interval;
    if (isNavigating && selectedAttraction) {
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          }
          return prev; // stay at last step (Arrived)
        });
      }, 3500); // Progress to next step every 3.5 seconds
    }
    return () => clearInterval(interval);
  }, [isNavigating, selectedAttraction, steps.length]);

  if (!selectedAttraction) {
    return (
      <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm text-center">
        <p className="text-sm text-slate-500">
          Select an attraction from the list to map route and configure navigation.
        </p>
      </div>
    );
  }

  const currentStep = steps[currentStepIndex];

  return (
    <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm transition-all duration-300 flex flex-col gap-4 text-slate-800">
      
      {/* Transit Mode Tabs */}
      <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200/60 shrink-0">
        {[
          { name: 'Driving', icon: Car },
          { name: 'Walking', icon: Footprints },
          { name: 'Bicycling', icon: Bike },
          { name: 'Transit', icon: Bus }
        ].map((mode) => {
          const IconComponent = mode.icon;
          const isSelected = transitMode === mode.name;
          return (
            <button
              key={mode.name}
              onClick={() => setTransitMode(mode.name)}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/40'
              }`}
            >
              <IconComponent className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">{mode.name}</span>
            </button>
          );
        })}
      </div>

      {/* Traffic Congestion Alert Banner */}
      {simulatedTraffic === 'heavy' && transitMode === 'Driving' && (
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-2.5 text-xs text-amber-600">
          <AlertTriangle className="h-4.5 w-4.5 mt-0.5 shrink-0" />
          <div>
            <strong>Traffic congestion detected on route!</strong>
            <p className="text-[10px] text-amber-650 mt-0.5 font-medium">Navigation Agent applied a Pandurangapuram detour (+1.2 km, +12 mins).</p>
          </div>
        </div>
      )}

      {/* Route Info Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
          {/* Route Source & Destination */}
          <div className="col-span-2 md:col-span-1 flex flex-col justify-center">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Navigation Route</span>
            <div className="flex items-center gap-1.5 mt-1 font-semibold text-slate-800 text-xs sm:text-sm">
              <span className="truncate max-w-[100px]">Visakhapatnam</span>
              <span className="text-slate-400 font-normal">→</span>
              <span className="truncate max-w-[120px] text-blue-600">{selectedAttraction.name.split(' (')[0]}</span>
            </div>
          </div>

          {/* Distance */}
          <div className="flex flex-col justify-center">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Distance</span>
            <span className="mt-1 font-bold text-slate-850 text-xs sm:text-sm">
              {routeInfo?.distance || 'Calculating...'}
            </span>
          </div>

          {/* Time */}
          <div className="flex flex-col justify-center">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Estimated Time</span>
            <div className="mt-1 font-bold text-slate-850 text-xs sm:text-sm flex items-center gap-1">
              <Clock className="h-4 w-4 text-slate-500 shrink-0" />
              <span>{routeInfo?.duration || 'Calculating...'}</span>
            </div>
          </div>

          {/* Travel Mode */}
          <div className="flex flex-col justify-center">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Transit Option</span>
            <div className="mt-1 font-semibold text-slate-700 text-xs sm:text-sm flex items-center gap-1">
              <Navigation className="h-3.5 w-3.5 rotate-45 text-blue-600 shrink-0" />
              <span>{routeInfo?.travelMode || 'Driving'}</span>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="shrink-0 flex items-center">
          <button
            onClick={onStartNavigation}
            className={`w-full md:w-auto px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all duration-300 shadow-xs border cursor-pointer ${
              isNavigating
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
                : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-blue-100'
            }`}
          >
            {isNavigating ? 'Stop Navigation' : 'Start Navigation'}
          </button>
        </div>
      </div>

      {/* Interactive Navigation Step Bar */}
      {isNavigating && currentStep && (
        <div className="flex flex-col gap-3">
          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex items-start sm:items-center gap-3 animate-fade-in transition-all duration-300 text-slate-800">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600 shrink-0">
              {currentStepIndex === steps.length - 1 ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : (
                <Compass className="h-5 w-5 animate-spin text-blue-600" style={{ animationDuration: '6s' }} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[9px] font-bold text-slate-450 uppercase tracking-wider">
                {currentStepIndex === steps.length - 1 ? 'Destination Reached' : 'Active Navigation Instructions'}
              </div>
              <div className="text-xs font-semibold text-slate-750 mt-0.5">
                {currentStep.text}
              </div>
            </div>
            {currentStep.dist !== "0m" && (
              <div className="text-right shrink-0 bg-white border border-slate-200 px-2.5 py-1 rounded-md text-[10px] font-semibold text-slate-600">
                {currentStep.dist}
              </div>
            )}
          </div>

          {currentStepIndex === steps.length - 1 && onExploreNearby && (
            <button
              onClick={() => onExploreNearby(selectedAttraction.coords, selectedAttraction.name.split(' (')[0])}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl border border-emerald-600 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg animate-pulse"
            >
              🔍 Explore locations near {selectedAttraction.name.split(' (')[0]}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
