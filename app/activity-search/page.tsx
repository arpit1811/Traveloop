"use client";

import { useState } from "react";
import Link from "next/link";

const mockActivities = [
  { id: 1, cost: 5800, location: "Delhi" },
  { id: 2, cost: 9900, location: "Mumbai" },
  { id: 3, cost: 40700, location: "Paris" },
];

export default function ActivitySearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [groupBy, setGroupBy] = useState("");
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("");

  const filteredActivities = mockActivities.filter(activity =>
    activity.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <div className="bg-[#2E4057] text-white px-6 py-3">
        <span className="text-xl font-semibold text-[#FF6B35]">Traveloop</span>
      </div>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-black mb-6">Activity Search</h1>

        <div className="flex flex-col gap-4 mb-8">
          <input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] bg-white text-black placeholder:text-gray-500"
          />
          <div className="flex gap-2">
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] bg-white text-gray-700"
            >
              <option value="">Group by</option>
              <option value="location">Location</option>
              <option value="type">Type</option>
            </select>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] bg-white text-gray-700"
            >
              <option value="">Filter</option>
              <option value="free">Free</option>
              <option value="under500">Under ₹500</option>
              <option value="under1000">Under ₹1000</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] bg-white text-gray-700"
            >
              <option value="">Sort by</option>
              <option value="price">Price</option>
              <option value="duration">Duration</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white rounded-3xl border border-gray-300 shadow-sm p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-[#2E4057] mb-3 text-lg">{activity.location}</h3>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">Total Expense</p>
                  <p className="text-sm font-bold text-[#FF6B35]">₹{activity.cost.toLocaleString()}</p>
                </div>
                <Link href={`/itinerary-view/${activity.location.toLowerCase()}`} className="block w-full py-2 bg-[#FF6B35] text-white rounded-xl hover:bg-[#e55a2b] transition-colors text-center mt-3">
                  View Details
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              No activities found matching "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}