"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTrips } from "@/lib/useTrips";
import Link from "next/link";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

const suggestedPlaces = [
  { id: 1, name: "Eiffel Tower", city: "Paris", type: "landmark", emoji: "🗼", cost: 0 },
  { id: 2, name: "Colosseum", city: "Rome", type: "landmark", emoji: "🏟️", cost: 0 },
  { id: 3, name: "Taj Mahal", city: "Agra", type: "landmark", emoji: "🕌", cost: 0 },
  { id: 4, name: "Great Wall", city: "Beijing", type: "landmark", emoji: "🏯", cost: 0 },
  { id: 5, name: "Statue of Liberty", city: "New York", type: "landmark", emoji: "🗽", cost: 0 },
  { id: 6, name: "Sydney Opera", city: "Sydney", type: "landmark", emoji: "🎭", cost: 0 },
];

const suggestedActivities = [
  { id: 7, name: "Street Food Tour", city: "Bangkok", type: "food", emoji: "🍜", cost: 25 },
  { id: 8, name: "Hot Air Balloon", city: "Cappadocia", type: "adventure", emoji: "🎈", cost: 150 },
  { id: 9, name: "Cooking Class", city: "Florence", type: "food", emoji: "🍳", cost: 80 },
  { id: 10, name: "Snorkeling", city: "Bali", type: "water", emoji: "🏊", cost: 40 },
  { id: 11, name: "Wine Tasting", city: "Bordeaux", type: "food", emoji: "🍷", cost: 35 },
  { id: 12, name: "Safari Drive", city: "Kenya", type: "adventure", emoji: "🦁", cost: 100 },
];

export default function CreateTripPage() {
  const { user, loading: authLoading } = useAuth();
  const { createTrip } = useTrips(user);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdTripId, setCreatedTripId] = useState<string | null>(null);
  const [createdTripName, setCreatedTripName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    description: "",
    destination: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError("Please log in to create a trip");
      return;
    }
    if (!formData.name || !formData.startDate || !formData.endDate) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      console.log("Creating trip with data:", {
        userId: user.uid,
        name: formData.name,
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description,
        isPublic: false,
      });

      const tripId = await createTrip({
        userId: user.uid,
        name: formData.name,
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description,
        coverPhoto: "",
        isPublic: false,
      });

      console.log("Trip created with ID:", tripId);
      setCreatedTripId(tripId);
      setCreatedTripName(formData.name);
      setSuccess(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create trip. Please try again.";
      setError(errorMessage);
      console.error("=== CREATE TRIP ERROR ===");
      console.error("Error:", err);
      console.error("User:", user);
      console.error("User UID:", user?.uid);
      console.error("Form data:", formData);
      console.error("=========================");
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Please Log In</h2>
          <p className="text-gray-500 mb-6">You need to be logged in to create a trip.</p>
          <Link href="/login" className="px-6 py-3 bg-[#FF6B35] text-white font-semibold rounded-xl hover:bg-[#e55a2b]">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

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
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-8">
        <div className="mb-6">
          <Link href="/trips" className="text-sm text-[#FF6B35] hover:underline">← Back to My Trips</Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Plan a New Trip</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trip Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Summer in Europe 2026"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  min={today}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  min={formData.startDate || today}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder="e.g., Europe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="What's your trip about?"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cover Photo (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverPhoto(e.target.files?.[0] || null)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-[#FF6B35] file:text-white"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-[#FF6B35] text-white font-semibold rounded-xl hover:bg-[#e55a2b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create Trip"}
              </button>
            </div>
          </form>

          {success && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
                <div className="w-20 h-20 bg-[#1D976C] rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl text-white">✓</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Trip Created!</h2>
                <p className="text-gray-600 mb-6">
                  "{createdTripName}" has been created successfully.
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => router.push(`/trips/${createdTripId}`)}
                    className="w-full px-6 py-3 bg-[#FF6B35] text-white font-semibold rounded-xl hover:bg-[#e55a2b] transition-colors"
                  >
                    View Trip
                  </button>
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setCreatedTripId(null);
                      setCreatedTripName("");
                      setFormData({
                        name: "",
                        startDate: "",
                        endDate: "",
                        description: "",
                        destination: "",
                      });
                      setCoverPhoto(null);
                    }}
                    className="w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Create Another Trip
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Suggestions for Places to Visit</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {suggestedPlaces.map((place) => (
              <div
                key={place.id}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:border-[#FF6B35] hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{place.emoji}</span>
                  <div>
                    <h3 className="font-medium text-gray-800">{place.name}</h3>
                    <p className="text-sm text-gray-500">{place.city}</p>
                    <span className="text-xs text-[#1D976C] capitalize">{place.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Activities to Perform</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {suggestedActivities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:border-[#FF6B35] hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{activity.emoji}</span>
                  <div>
                    <h3 className="font-medium text-gray-800">{activity.name}</h3>
                    <p className="text-sm text-gray-500">{activity.city}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-[#FF6B35] capitalize">{activity.type}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400">${activity.cost}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Link
        href="/"
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#FF6B35] text-white rounded-full shadow-lg flex items-center justify-center text-3xl hover:bg-[#e55a2b] transition-colors z-50"
      >
        +
      </Link>
    </div>
  );
}
