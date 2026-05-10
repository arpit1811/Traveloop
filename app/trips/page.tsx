"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTrips, Trip } from "@/lib/useTrips";

export default function TripsPage() {
  const { user, loading: authLoading } = useAuth();
  const { trips, loading: tripsLoading, deleteTrip } = useTrips(user || null);
  const [editingTrip, setEditingTrip] = useState<string | null>(null);
  const [tripForm, setTripForm] = useState({ name: "", startDate: "", endDate: "", description: "" });

  if (authLoading || tripsLoading) {
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
          <p className="text-gray-500 mb-4">Please login to view your trips</p>
        </div>
      </div>
    );
  }

  const handleEditTrip = (trip: Trip) => {
    setTripForm({
      name: trip.name,
      startDate: trip.startDate,
      endDate: trip.endDate,
      description: trip.description
    });
    setEditingTrip(trip.id);
  };

  const handleDeleteTrip = async (tripId: string) => {
    if (confirm("Are you sure you want to delete this trip?")) {
      await deleteTrip(tripId);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const ongoingTrips = trips.filter(trip => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    return start <= today && end >= today;
  });

  const upcomingTrips = trips.filter(trip => {
    const start = new Date(trip.startDate);
    return start > today;
  });

  const completedTrips = trips.filter(trip => {
    const end = new Date(trip.endDate);
    return end < today;
  });

  const renderTripSection = (title: string, tripList: Trip[], bgColor: string) => (
    <div className="mb-8">
      <h3 className={`text-lg font-semibold mb-4 ${bgColor}`}>{title}</h3>
      {tripList.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {tripList.map((trip) => (
            <TripCard 
              key={trip.id} 
              trip={trip}
              isEditing={editingTrip === trip.id}
              tripForm={tripForm}
              setTripForm={setTripForm}
              onEdit={() => handleEditTrip(trip)}
              onDelete={() => handleDeleteTrip(trip.id)}
              onSave={() => setEditingTrip(null)}
              onCancel={() => setEditingTrip(null)}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4 bg-white rounded-2xl border border-gray-300">No trips</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-black">My Trips</h1>
          <button className="px-4 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#e55a2b] font-medium">
            + Create New Trip
          </button>
        </div>

        {trips.length > 0 ? (
          <>
            {renderTripSection("Ongoing Trips", ongoingTrips, "text-[#1D976C]")}
            {renderTripSection("Upcoming Trips", upcomingTrips, "text-[#FF6B35]")}
            {renderTripSection("Completed Trips", completedTrips, "text-[#2E4057]")}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-300">
            <p className="text-gray-500 text-lg mb-4">No trips found</p>
            <p className="text-gray-400">Create your first trip to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TripCard({ trip, isEditing, tripForm, setTripForm, onEdit, onDelete, onSave, onCancel }: any) {
  const destinationCount = 3;

  return (
    <div className="bg-white rounded-2xl border border-gray-300 p-5 hover:shadow-md transition-shadow">
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={tripForm.name}
            onChange={(e) => setTripForm({ ...tripForm, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Trip Name"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={tripForm.startDate}
              onChange={(e) => setTripForm({ ...tripForm, startDate: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <input
              type="date"
              value={tripForm.endDate}
              onChange={(e) => setTripForm({ ...tripForm, endDate: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <textarea
            value={tripForm.description}
            onChange={(e) => setTripForm({ ...tripForm, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            placeholder="Description"
            rows={2}
          />
          <div className="flex gap-2">
            <button onClick={onSave} className="px-4 py-2 bg-[#FF6B35] text-white rounded-lg text-sm hover:bg-[#e55a2b]">Save</button>
            <button onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-[#2E4057]">{trip.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {trip.startDate} - {trip.endDate}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {destinationCount} destination(s)
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-[#2E4057] text-white rounded-lg text-sm hover:bg-[#1a2a3d]">
              View
            </button>
            <button onClick={onEdit} className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300">
              Edit
            </button>
            <button onClick={onDelete} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600">
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}