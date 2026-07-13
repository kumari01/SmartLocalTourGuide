import React, { useState } from 'react';
import AttractionCard from './AttractionCard';
import RestaurantCard from './RestaurantCard';
import EventCard from './EventCard';
import { Compass, Utensils, Calendar, MapPin, Route, Clock, ChevronRight } from 'lucide-react';

export default function Sidebar({
  attractions,
  restaurants,
  events,
  selectedAttraction,
  setSelectedAttraction,
  selectedRestaurant,
  setSelectedRestaurant,
  selectedEvent,
  setSelectedEvent,
  isOpen,
  onViewMenu,
  onReserveTable,
  onGetDirections,
  timelineItems,
  preferences
}) {
  const [activeTab, setActiveTab] = useState('attractions'); // 'attractions' | 'food-events' | 'itinerary'

  return (
    <aside 
      className={`
        /* Mobile layout: fixed drawer */
        fixed inset-y-16 left-0 z-40 w-full sm:w-[380px] bg-slate-50 border-r border-slate-200/60 flex flex-col transition-transform duration-300
        
        /* Tablet layout: horizontal card section above map */
        md:static md:w-full md:h-80 md:translate-x-0 md:border-r-0 md:border-b
        
        /* Desktop layout: vertical side panel */
        lg:static lg:w-[420px] lg:h-[calc(100vh-4rem)] lg:border-r lg:border-b-0
        
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
    >
      {/* Tab Navigation Headers */}
      <div className="flex bg-white border-b border-slate-200/60 shrink-0 text-slate-500">
        <button
          onClick={() => setActiveTab('attractions')}
          className={`flex-1 py-3.5 flex flex-col items-center gap-1 text-[11px] font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'attractions'
              ? 'text-blue-600 border-blue-600 bg-slate-50/50 font-extrabold'
              : 'border-transparent hover:text-slate-900 hover:bg-slate-50/20'
          }`}
        >
          <Compass className="h-4.5 w-4.5" />
          <span>Attractions</span>
        </button>
        <button
          onClick={() => setActiveTab('food-events')}
          className={`flex-1 py-3.5 flex flex-col items-center gap-1 text-[11px] font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'food-events'
              ? 'text-teal-600 border-teal-600 bg-slate-50/50 font-extrabold'
              : 'border-transparent hover:text-slate-900 hover:bg-slate-50/20'
          }`}
        >
          <Utensils className="h-4.5 w-4.5" />
          <span>Food & Events</span>
        </button>
        <button
          onClick={() => setActiveTab('itinerary')}
          className={`flex-1 py-3.5 flex flex-col items-center gap-1 text-[11px] font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'itinerary'
              ? 'text-indigo-600 border-indigo-600 bg-slate-50/50 font-extrabold'
              : 'border-transparent hover:text-slate-900 hover:bg-slate-50/20'
          }`}
        >
          <Route className="h-4.5 w-4.5" />
          <span>Day Plan</span>
        </button>
      </div>

      {/* Main Sidebar scrollable container */}
      <div 
        className="
          flex-1 overflow-y-auto px-4 py-4 space-y-6 scroll-smooth bg-slate-50
          md:flex md:flex-row md:space-y-0 md:gap-6 md:overflow-y-auto
          lg:flex-col lg:space-y-6 lg:overflow-y-auto lg:h-full
        "
      >
        {/* ============================== TAB 1: ATTRACTIONS ============================== */}
        {activeTab === 'attractions' && (
          <div className="w-full">
            <div className="flex items-center gap-2 mb-3.5 sticky top-0 bg-slate-55 py-1.5 z-10 border-b border-slate-200/60">
              <Compass className="h-4.5 w-4.5 text-blue-600" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Attraction Search Agent</h2>
              <span className="ml-auto text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {attractions.length} found
              </span>
            </div>
            <div className="space-y-3.5">
              {attractions.length > 0 ? (
                attractions.map(attraction => (
                  <AttractionCard
                    key={attraction.id}
                    attraction={attraction}
                    onSelect={(att) => {
                      setSelectedAttraction(att);
                      setActiveTab('food-events'); // Advance flow to dining & events!
                    }}
                    isSelected={selectedAttraction?.id === attraction.id}
                  />
                ))
              ) : (
                <div className="p-6 bg-white border border-slate-200/60 rounded-xl text-center animate-pulse">
                  <p className="text-xs text-slate-550">No attractions match query.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================== TAB 2: FOOD & EVENTS ============================== */}
        {activeTab === 'food-events' && (
          <div className="w-full space-y-6">
            
            {/* Header context */}
            {selectedAttraction ? (
              <div className="p-3 bg-teal-50 border border-teal-200/60 rounded-xl mb-2 text-xs">
                <span className="text-[10px] text-teal-600 font-bold uppercase">Proximity Recommendations</span>
                <p className="text-slate-700 mt-1 font-medium">Showing options near <strong>{selectedAttraction.name.split(' (')[0]}</strong>.</p>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mb-2 text-xs text-amber-600 font-medium">
                <p>Select an attraction first to sort recommendations by proximity.</p>
              </div>
            )}

            {/* Restaurant Section */}
            <div>
              <div className="flex items-center gap-2 mb-3 sticky top-0 bg-slate-50 py-1.5 z-10 border-b border-slate-200/60">
                <Utensils className="h-4 w-4 text-teal-600" />
                <h2 className="text-xs font-bold text-slate-850 uppercase tracking-wider">Restaurant Agent</h2>
                <span className="ml-auto text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                  {restaurants.length} nearby
                </span>
              </div>
              <div className="space-y-3">
                {restaurants.length > 0 ? (
                  restaurants.slice(0, 4).map(restaurant => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                      onSelect={setSelectedRestaurant}
                      isSelected={selectedRestaurant?.id === restaurant.id}
                      onViewMenu={onViewMenu}
                      onReserveTable={onReserveTable}
                      onGetDirections={onGetDirections}
                    />
                  ))
                ) : (
                  <div className="p-6 bg-white border border-slate-200/60 rounded-xl text-center">
                    <p className="text-xs text-slate-500">No restaurants match.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Events Section */}
            <div>
              <div className="flex items-center gap-2 mb-3 sticky top-0 bg-slate-50 py-1.5 z-10 border-b border-slate-200/60">
                <Calendar className="h-4 w-4 text-indigo-600" />
                <h2 className="text-xs font-bold text-slate-850 uppercase tracking-wider">Event Agent</h2>
                <span className="ml-auto text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  {events.length} upcoming
                </span>
              </div>
              <div className="space-y-3">
                {events.length > 0 ? (
                  events.slice(0, 3).map(event => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onSelect={(ev) => {
                        setSelectedEvent(ev);
                        // Toggle add / redirect to day plan
                        setActiveTab('itinerary');
                      }}
                      isSelected={selectedEvent?.id === event.id}
                    />
                  ))
                ) : (
                  <div className="p-6 bg-white border border-slate-200/60 rounded-xl text-center">
                    <p className="text-xs text-slate-500">No live events match.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* ============================== TAB 3: PERSONALIZED DAY PLAN ============================== */}
        {activeTab === 'itinerary' && (
          <div className="w-full">
            <div className="flex items-center gap-2 mb-4 sticky top-0 bg-slate-50 py-1.5 z-10 border-b border-slate-200/60">
              <Route className="h-4.5 w-4.5 text-indigo-600" />
              <h2 className="text-xs font-bold text-slate-850 uppercase tracking-wider">Personalized Day Plan</h2>
              <button 
                onClick={() => setSelectedAttraction(null)} 
                className="ml-auto text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded hover:bg-rose-100 cursor-pointer"
              >
                Clear Plan
              </button>
            </div>

            {timelineItems.length > 0 ? (
              <div className="relative pl-6 border-l border-slate-200 space-y-6 ml-3 py-1">
                {timelineItems.map((item, index) => {
                  let badgeColor = 'bg-slate-400';
                  if (item.type === 'start' || item.type === 'end') badgeColor = 'bg-indigo-600';
                  else if (item.type === 'attraction') badgeColor = 'bg-blue-500';
                  else if (item.type === 'restaurant') badgeColor = 'bg-teal-500';
                  else if (item.type === 'event') badgeColor = 'bg-indigo-500';

                  return (
                    <div key={index} className="relative group animate-fade-in text-slate-700">
                      {/* Timeline dot */}
                      <span className={`absolute -left-[31px] top-1 h-4.5 w-4.5 rounded-full border-4 border-slate-50 flex items-center justify-center ${badgeColor} text-[8px] font-bold shadow-xs`}></span>
                      
                      {/* Timeline content */}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-indigo-600 font-mono flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {item.time}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 mt-0.5">{item.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{item.description}</p>
                        
                        {/* Placeholder interactive cues */}
                        {item.type === 'lunch-placeholder' && (
                          <button
                            onClick={() => setActiveTab('food-events')}
                            className="mt-2 text-[10px] font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer transition-all border border-teal-200"
                          >
                            Find Restaurants <ChevronRight className="h-3 w-3" />
                          </button>
                        )}
                        {item.type === 'event-placeholder' && (
                          <button
                            onClick={() => setActiveTab('food-events')}
                            className="mt-2 text-[10px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer transition-all border border-indigo-100"
                          >
                            Add Live Events <ChevronRight className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 bg-white border border-slate-200/60 rounded-2xl text-center space-y-3">
                <Compass className="h-10 w-10 text-slate-400 mx-auto animate-bounce" style={{ animationDuration: '3s' }} />
                <h4 className="font-bold text-sm text-slate-800">Generate Your Trip Plan</h4>
                <p className="text-xs text-slate-500 max-w-[220px] mx-auto leading-relaxed">
                  Go to the <strong>Attractions</strong> tab and select a destination to assemble your day's itinerary.
                </p>
                <button
                  onClick={() => setActiveTab('attractions')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer mt-1"
                >
                  View Attractions List
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
