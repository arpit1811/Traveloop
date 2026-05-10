"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTrips, Trip } from "@/lib/useTrips";
import { useUserProfile } from "@/lib/useUserProfile";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { trips, loading: tripsLoading } = useTrips(user);
  const { profile, loading: profileLoading } = useUserProfile(user?.uid || null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [editingProfile, setEditingProfile] = useState({
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    phone: profile?.phone || "",
    city: profile?.city || "",
    country: profile?.country || "",
  });

  useState(() => {
    if (profile) {
      setEditingProfile({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phone: profile.phone || "",
        city: profile.city || "",
        country: profile.country || "",
      });
    }
  });

  if (authLoading || tripsLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Please login to view your profile</p>
        </div>
      </div>
    );
  }

  const preplannedTrips = trips.filter((trip: Trip) => new Date(trip.startDate) >= new Date());
  const previousTrips = trips.filter((trip: Trip) => new Date(trip.endDate) < new Date());

  const handleSaveProfile = async () => {
    if (!user?.uid) return;
    
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        firstName: editingProfile.firstName,
        lastName: editingProfile.lastName,
        phone: editingProfile.phone,
        city: editingProfile.city,
        country: editingProfile.country,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const displayName = profile?.firstName || profile?.lastName 
    ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim() 
    : user.displayName || user.email?.split("@")[0] || "User";

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Profile Box */}
        <div className="bg-white rounded-3xl border border-gray-300 p-6 mb-6">
          <div className="flex items-start gap-6">
            {/* Left - User Image */}
            <div className="w-28 h-28 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-4xl text-gray-500">👤</span>
              )}
            </div>

            {/* Right - User Details */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-gray-500">First Name</label>
                      <input
                        type="text"
                        value={editingProfile.firstName}
                        onChange={(e) => setEditingProfile({ ...editingProfile, firstName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Last Name</label>
                      <input
                        type="text"
                        value={editingProfile.lastName}
                        onChange={(e) => setEditingProfile({ ...editingProfile, lastName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Phone</label>
                    <input
                      type="text"
                      value={editingProfile.phone}
                      onChange={(e) => setEditingProfile({ ...editingProfile, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-gray-500">City</label>
                      <input
                        type="text"
                        value={editingProfile.city}
                        onChange={(e) => setEditingProfile({ ...editingProfile, city: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Country</label>
                      <input
                        type="text"
                        value={editingProfile.country}
                        onChange={(e) => setEditingProfile({ ...editingProfile, country: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-[#FF6B35] text-white rounded-lg text-sm hover:bg-[#e55a2b]"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-xl font-semibold text-[#2E4057]">{displayName}</h2>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-sm text-[#FF6B35] hover:underline font-medium"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <p>📱 {profile?.phone || "Not set"}</p>
                    <p>📧 {user.email}</p>
                    <p>🏙️ {profile?.city || "Not set"}</p>
                    <p>🌍 {profile?.country || "Not set"}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preplanned Trips */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-[#2E4057] mb-4">My Trips</h3>
          {trips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trips.map((trip: Trip) => (
                <div key={trip.id} className="bg-white rounded-2xl border border-gray-300 p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-[#2E4057] mb-1">{trip.name}</h4>
                  <p className="text-xs text-gray-500 mb-2">
                    {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-400 mb-3">{trip.destination || "No destination"}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8 bg-white rounded-2xl border border-gray-300">No trips yet</p>
          )}
        </div>

        {/* Previous Trips */}
        {previousTrips.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-[#2E4057] mb-4">Previous Trips</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {previousTrips.map((trip: Trip) => (
                <div key={trip.id} className="bg-white rounded-2xl border border-gray-300 p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-[#2E4057] mb-1">{trip.name}</h4>
                  <p className="text-xs text-gray-500 mb-2">
                    {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}