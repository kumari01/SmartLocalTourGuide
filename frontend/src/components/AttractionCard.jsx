import React from 'react';
import { Star, MapPin, Navigation } from 'lucide-react';

export default function AttractionCard({ attraction, onSelect, isSelected }) {
  return (
    <div 
      className={`group flex flex-col sm:flex-row gap-4 p-3 bg-white border rounded-xl transition-all duration-300 ${
        isSelected 
          ? 'border-blue-500 ring-2 ring-blue-500/10 shadow-sm' 
          : 'border-slate-100 hover:border-slate-200 hover:shadow-xs'
      }`}
    >
      {/* Image container */}
      <div className="relative w-full sm:w-28 h-24 rounded-lg overflow-hidden shrink-0 bg-slate-50">
        <img 
          src={attraction.image} 
          alt={attraction.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[9px] font-medium rounded-full">
          {attraction.category}
        </div>
      </div>

      {/* Info Content */}
      <div className="flex flex-col justify-between flex-1 min-w-0">
        <div>
          <div className="flex items-center justify-between gap-1.5">
            <h3 className="font-semibold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-blue-600 transition-colors duration-200 truncate">
              {attraction.name}
            </h3>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium shrink-0">
              {attraction.popularity} Pop
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
            {attraction.description}
          </p>
          
          {/* Rich Agent Parameters */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[10px] text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
              Hrs: {attraction.openingHours}
            </span>
            <span className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${
                attraction.crowdLevel === 'High' || attraction.crowdLevel === 'Busy'
                  ? 'bg-rose-500'
                  : attraction.crowdLevel === 'Moderate'
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}></span>
              Crowd: {attraction.crowdLevel}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0.5 text-amber-500 text-xs font-semibold">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span>{attraction.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500 text-xs">
              <MapPin className="h-3 w-3" />
              <span>{attraction.distance}</span>
            </div>
          </div>

          <button
            onClick={() => onSelect(attraction)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              isSelected 
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20 border-blue-600' 
                : 'bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200'
            }`}
          >
            <Navigation className="h-3 w-3" />
            <span>Select</span>
          </button>
        </div>
      </div>
    </div>
  );
}
