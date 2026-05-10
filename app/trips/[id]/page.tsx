"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface TripData {
  id: string;
  userId: string;
  name: string;
  destination?: string;
  startDate: string;
  endDate: string;
  description: string;
  coverPhoto?: string;
  isPublic: boolean;
  createdAt: string;
}

export default function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useAuth();
  const router = useRouter();
  const resolvedParams = use(params);
  const [trip, setTrip] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchTrip = async () => {
      if (!user) return;
      
      try {
        const tripDoc = await getDoc(doc(db, "trips", resolvedParams.id));
        if (tripDoc.exists()) {
          const data = tripDoc.data() as Omit<TripData, "id">;
          if (data.userId !== user.uid) {
            router.push("/");
            return;
          }
          setTrip({ id: tripDoc.id, ...data });
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching trip:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [user, resolvedParams.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading trip...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return null;
  }

  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-[#F7F9FC] pb-20">
      <div className="bg-[#2E4057] text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-bold text-[#FF6B35]">Traveloop</Link>
          <span className="text-gray-400">/</span>
          <Link href="/" className="text-sm hover:text-gray-300">My Trips</Link>
        </div>
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
          <Link href="/" className="text-sm text-[#FF6B35] hover:underline">← Back to My Trips</Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
          {trip.coverPhoto ? (
            <div 
              className="h-64 bg-cover bg-center"
              style={{ backgroundImage: `url(${trip.coverPhoto})` }}
            />
          ) : (
            <div className="h-64 bg-gradient-to-br from-[#2E4057] to-[#1D976C] flex items-center justify-center">
              <span className="text-6xl">✈️</span>
            </div>
          )}
          
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{trip.name}</h1>
                {trip.destination && (
                  <p className="text-lg text-gray-500 flex items-center gap-2">
                    📍 {trip.destination}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-[#FF6B35] text-white rounded-lg font-medium hover:bg-[#e55a2b]">
                  Edit Trip
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">📅</span>
                <span>
                  {startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">⏱️</span>
                <span>{duration} days</span>
              </div>
            </div>

            {trip.description && (
              <p className="text-gray-600">{trip.description}</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {["overview", "itinerary", "activities", "packing", "notes"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 px-6 text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? "text-[#FF6B35] border-b-2 border-[#FF6B35]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🗺️</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Trip Overview</h3>
                <p className="text-gray-500 mb-6">Start planning your adventure!</p>
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={() => setActiveTab("itinerary")}
                    className="px-6 py-3 bg-[#2E4057] text-white rounded-xl font-medium hover:bg-[#1D976C]"
                  >
                    Add Stops
                  </button>
                  <button 
                    onClick={() => setActiveTab("activities")}
                    className="px-6 py-3 bg-[#FF6B35] text-white rounded-xl font-medium hover:bg-[#e55a2b]"
                  >
                    Find Activities
                  </button>
                </div>
              </div>
            )}

            {activeTab === "itinerary" && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛤️</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Itinerary</h3>
                <p className="text-gray-500 mb-6">Plan your stops and schedule</p>
                <Link 
                  href={`/itinerary-view/${trip.destination || "default"}`}
                  className="inline-block px-6 py-3 bg-[#2E4057] text-white rounded-xl font-medium hover:bg-[#1D976C]"
                >
                  Open Itinerary Builder
                </Link>
              </div>
            )}

            {activeTab === "activities" && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Activities</h3>
                <p className="text-gray-500 mb-6">Find and add activities to your trip</p>
                <Link 
                  href="/activity-search"
                  className="inline-block px-6 py-3 bg-[#FF6B35] text-white rounded-xl font-medium hover:bg-[#e55a2b]"
                >
                  Search Activities
                </Link>
              </div>
            )}

            {activeTab === "packing" && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎒</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Packing List</h3>
                <p className="text-gray-500 mb-6">Keep track of what to pack</p>
                <button className="px-6 py-3 bg-[#2E4057] text-white rounded-xl font-medium hover:bg-[#1D976C]">
                  Create Packing List
                </button>
              </div>
            )}

            {activeTab === "notes" && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Trip Notes</h3>
                <p className="text-gray-500 mb-6">Add notes and important information</p>
                <button className="px-6 py-3 bg-[#2E4057] text-white rounded-xl font-medium hover:bg-[#1D976C]">
                  Add Notes
                </button>
              </div>
            )}
          </div>
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