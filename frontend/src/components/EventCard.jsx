import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';

export default function EventCard({ event, onSelect, isSelected }) {
  return (
    <div 
      onClick={() => onSelect && onSelect(event)}
      className={`group flex gap-3.5 p-2.5 bg-white border rounded-xl transition-all duration-300 cursor-pointer ${
        isSelected 
          ? 'border-secondary ring-2 ring-secondary/10 shadow-sm' 
          : 'border-slate-100 hover:border-slate-200 hover:shadow-xs'
      }`}
    >
      {/* Image container */}
      <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-50">
        <img 
          src={event.image} 
          alt={event.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Info Content */}
      <div className="flex flex-col justify-between flex-1 min-w-0">
        <div>
          <div className="flex items-center justify-between gap-1">
            <h4 className="font-semibold text-slate-900 text-sm group-hover:text-secondary transition-colors duration-200 leading-snug truncate">
              {event.name}
            </h4>
            <span className="text-[9px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-bold shrink-0">
              {event.category || 'Live Event'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-brand-secondary mt-1">
            <Calendar className="h-3 w-3 shrink-0" />
            <span>{event.date}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-2 pt-1.5 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-brand-secondary">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate max-w-[100px]">{event.venue}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 shrink-0" />
              <span>{event.time}</span>
            </div>
          </div>
          
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect && onSelect(event);
            }}
            className={`w-full py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all duration-200 cursor-pointer text-center ${
              isSelected
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600'
            }`}
          >
            {isSelected ? 'Added to Itinerary' : 'Add to Itinerary'}
          </button>
        </div>
      </div>
    </div>
  );
}
