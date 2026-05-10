"use client";

import { useAuth } from "@/context/AuthContext";
import { useTrips, Trip } from "@/lib/useTrips";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const regionalDestinations = [
  { id: "asia", name: "Asia", emoji: "🌏", count: 245 },
  { id: "europe", name: "Europe", emoji: "🏰", count: 189 },
  { id: "americas", name: "Americas", emoji: "🗽", count: 156 },
  { id: "africa", name: "Africa", emoji: "🌍", count: 78 },
  { id: "oceania", name: "Oceania", emoji: "🏝️", count: 92 },
  { id: "middle-east", name: "Middle East", emoji: "🏜️", count: 54 },
];

const popularCities = [
  { id: 1, name: "Tokyo", country: "Japan", costIndex: 4, rating: 4.8 },
  { id: 2, name: "Paris", country: "France", costIndex: 4, rating: 4.7 },
  { id: 3, name: "New York", country: "USA", costIndex: 4, rating: 4.6 },
  { id: 4, name: "London", country: "UK", costIndex: 4, rating: 4.5 },
  { id: 5, name: "Dubai", country: "UAE", costIndex: 4, rating: 4.7 },
  { id: 6, name: "Singapore", country: "Singapore", costIndex: 4, rating: 4.8 },
  { id: 7, name: "Bali", country: "Indonesia", costIndex: 2, rating: 4.6 },
  { id: 8, name: "Barcelona", country: "Spain", costIndex: 3, rating: 4.5 },
  { id: 9, name: "Rome", country: "Italy", costIndex: 3, rating: 4.6 },
  { id: 10, name: "Sydney", country: "Australia", costIndex: 4, rating: 4.4 },
];

function TripCard({ trip }: { trip: Trip }) {
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const dateRange = `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

  return (
    <Link
      href={`/trips/${trip.id}`}
      className="block bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-[#FF6B35]"
    >
      <div className="h-32 bg-gradient-to-br from-[#2E4057] to-[#1D976C] flex items-center justify-center">
        <span className="text-5xl">
          {trip.name.includes("Tokyo") ? "🗼" : trip.name.includes("Paris") ? "🗼" : trip.name.includes("Beach") ? "🏖️" : "✈️"}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-1">{trip.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{dateRange}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#FF6B35] font-medium">View Itinerary →</span>
        </div>
      </div>
    </Link>
  );
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { trips, loading: tripsLoading } = useTrips(user);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [groupBy, setGroupBy] = useState("");
  const [filter, setFilter] = useState("");

  if (authLoading || tripsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const filteredTrips = trips.filter(trip =>
    trip.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedTrips = [...filteredTrips].sort((a, b) => {
    if (sortBy === "recent") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === "date") return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  const stats = {
    totalTrips: trips.length,
    upcoming: trips.filter(t => new Date(t.startDate) > new Date()).length,
    completed: trips.filter(t => new Date(t.endDate) < new Date()).length,
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] pb-20">
      <div className="bg-[#2E4057] text-white px-6 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-[#FF6B35]">Traveloop</Link>
        <div className="flex items-center gap-4">
          {user?.photoURL ? (
                <Link href="/profile">
                  <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border-2 border-[#FF6B35]" />
                </Link>
              ) : (
                <Link href="/profile" className="w-8 h-8 rounded-full bg-[#FF6B35] flex items-center justify-center text-white font-medium text-sm">
                  {user?.email?.[0].toUpperCase() || "?"}
                </Link>
              )}
          <div className="w-8 h-8 rounded-full bg-[#FF6B35] flex items-center justify-center text-sm font-medium">
            {user?.email?.[0]?.toUpperCase() || "U"}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-8">
        <div className="bg-gradient-to-r from-[#FF6B35] to-[#e55a2b] rounded-3xl p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Plan Your Next Adventure</h1>
          <p className="text-white/90 mb-6">Discover destinations, build itineraries, and make memories.</p>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="Search trips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-white min-w-[120px]"
            >
              <option value="recent">Recent</option>
              <option value="date">By Date</option>
              <option value="name">By Name</option>
            </select>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="px-4 py-3 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-white min-w-[120px]"
            >
              <option value="">Group by</option>
              <option value="region">Region</option>
              <option value="month">Month</option>
            </select>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-white min-w-[120px]"
            >
              <option value="">Filter</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {regionalDestinations.map((region) => (
            <Link
              key={region.id}
              href={`/search/cities?region=${region.id}`}
              className="bg-white rounded-xl p-4 border border-gray-200 hover:border-[#FF6B35] hover:shadow-md transition-all text-center"
            >
              <span className="text-3xl mb-2 block">{region.emoji}</span>
              <h3 className="font-medium text-gray-800 text-sm">{region.name}</h3>
              <p className="text-xs text-gray-500">{region.count} cities</p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Total Trips</p>
            <p className="text-2xl font-bold text-[#2E4057]">{stats.totalTrips}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Upcoming</p>
            <p className="text-2xl font-bold text-[#1D976C]">{stats.upcoming}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Completed</p>
            <p className="text-2xl font-bold text-[#FF6B35]">{stats.completed}</p>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Your Recent Trips</h2>
          <Link href="/trips" className="text-sm text-[#FF6B35] hover:underline">View All →</Link>
        </div>

        {sortedTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {sortedTrips.slice(0, 6).map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center mb-8">
            <span className="text-5xl mb-4 block">✈️</span>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No trips yet</h3>
            <p className="text-gray-500 mb-4">Start planning your first adventure!</p>
            <Link
              href="/trips/new"
              className="inline-block px-6 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#e55a2b] transition-colors"
            >
              Create Your First Trip
            </Link>
          </div>
        )}

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Popular Destinations</h2>
          <Link href="/search/cities" className="text-sm text-[#FF6B35] hover:underline">See All →</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {popularCities.slice(0, 5).map((city) => (
            <Link
              key={city.id}
              href={`/search/cities?q=${city.name}`}
              className="bg-white rounded-xl p-4 border border-gray-200 hover:border-[#FF6B35] hover:shadow-md transition-all"
            >
              <h3 className="font-medium text-gray-800">{city.name}</h3>
              <p className="text-xs text-gray-500">{city.country}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-[#1D976C]">{'★'.repeat(Math.round(city.rating))}</span>
                <span className="text-xs text-gray-400">{city.rating}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Link
        href="/trips/new"
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#FF6B35] text-white rounded-full shadow-lg flex items-center justify-center text-3xl hover:bg-[#e55a2b] transition-colors z-50"
      >
        +
      </Link>
    </div>
  );
}
