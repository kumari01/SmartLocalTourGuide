import React from 'react';
import { Star, MapPin, Utensils, Compass } from 'lucide-react';

export default function RestaurantCard({ 
  restaurant, 
  onSelect, 
  isSelected,
  onViewMenu,
  onReserveTable,
  onGetDirections
}) {
  return (
    <div 
      className={`group flex flex-col gap-3 p-3 bg-white border rounded-xl transition-all duration-300 ${
        isSelected 
          ? 'border-teal-500 ring-2 ring-teal-500/10 shadow-sm' 
          : 'border-slate-100 hover:border-slate-200 hover:shadow-xs'
      }`}
    >
      <div 
        onClick={() => onSelect(restaurant)}
        className="flex items-start gap-3.5 cursor-pointer"
      >
        {/* Image container */}
        <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-50">
          <img 
            src={restaurant.image} 
            alt={restaurant.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Info Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-semibold text-slate-900 text-sm group-hover:text-teal-600 transition-colors duration-200 truncate">
              {restaurant.name}
            </h4>
            <div className="flex items-center gap-0.5 text-amber-500 text-xs font-semibold shrink-0">
              <Star className="h-3 w-3 fill-current" />
              <span>{restaurant.rating}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
            <Utensils className="h-3 w-3 shrink-0" />
            <span className="truncate">{restaurant.cuisine}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-1.5 font-medium">
            <span className="text-[10px] text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
              {restaurant.budgetEstimate}
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${
              restaurant.isVeg 
                ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' 
                : 'text-rose-700 bg-rose-50 border border-rose-100'
            }`}>
              {restaurant.isVeg ? 'Veg' : 'Non-Veg'}
            </span>
            <span className="text-[10px] text-emerald-600">
              ● {restaurant.openingStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Restaurant Agent Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewMenu && onViewMenu(restaurant);
          }}
          className="flex-1 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-[10px] rounded-lg transition-colors text-center cursor-pointer border border-slate-200"
        >
          View Menu
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onReserveTable && onReserveTable(restaurant);
          }}
          className="flex-1 py-1.5 px-2 bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 font-bold text-[10px] rounded-lg transition-colors text-center cursor-pointer border border-teal-500/20"
        >
          Reserve Table
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onGetDirections && onGetDirections(restaurant);
          }}
          className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-blue-600 hover:bg-blue-600 hover:text-white font-bold text-[10px] rounded-lg transition-colors text-center flex items-center justify-center gap-1 cursor-pointer border border-slate-200"
          title="Get Directions"
        >
          <Compass className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
