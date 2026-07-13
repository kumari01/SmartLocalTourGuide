import React from 'react';
import SearchBar from './SearchBar';
import { Menu, MapPin, Compass } from 'lucide-react';

export default function Navbar({ searchQuery, setSearchQuery, toggleSidebar }) {
  return (
    <header className="sticky top-0 z-[999] w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md shadow-xs text-slate-950">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSidebar}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus:outline-none lg:hidden cursor-pointer"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 font-bold text-base sm:text-lg tracking-tight select-none">
              <Compass className="h-5 w-5 text-blue-600 animate-pulse" />
              <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                Smart Local Tour Guide
              </span>
            </div>
          </div>

          {/* Center: Search Bar (Desktop only) */}
          <div className="hidden md:flex flex-1 justify-center max-w-md">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>

          {/* Right: Current Location */}
          <div className="flex items-center">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-full text-xs font-bold shadow-xs">
              <MapPin className="h-3.5 w-3.5 animate-bounce" style={{ animationDuration: '3s' }} />
              <span>Visakhapatnam</span>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="md:hidden pb-3">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
      </div>
    </header>
  );
}
