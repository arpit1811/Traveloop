"use client";

import { use } from "react";
import Link from "next/link";

const cityData: Record<string, { name: string; itinerary: { day: string; activities: { name: string; time: string; cost: number }[] }[] }> = {
  delhi: {
    name: "Delhi",
    itinerary: [
      {
        day: "Day 1",
        activities: [
          { name: "Arrival at Delhi", time: "09:00 AM", cost: 800 },
          { name: "Check-in Hotel", time: "11:00 AM", cost: 2500 },
          { name: "Lunch", time: "01:00 PM", cost: 400 },
          { name: "India Gate Visit", time: "04:00 PM", cost: 100 },
        ],
      },
      {
        day: "Day 2",
        activities: [
          { name: "Red Fort Tour", time: "10:00 AM", cost: 250 },
          { name: "Jama Masjid", time: "01:00 PM", cost: 100 },
          { name: "Chandni Chowk", time: "03:00 PM", cost: 500 },
          { name: "Dinner", time: "07:00 PM", cost: 600 },
        ],
      },
      {
        day: "Day 3",
        activities: [
          { name: "Qutub Minar", time: "09:00 AM", cost: 200 },
          { name: "Lotus Temple", time: "12:00 PM", cost: 50 },
          { name: "Akshardham", time: "03:00 PM", cost: 300 },
          { name: "Packing", time: "08:00 PM", cost: 0 },
        ],
      },
    ],
  },
  mumbai: {
    name: "Mumbai",
    itinerary: [
      {
        day: "Day 1",
        activities: [
          { name: "Arrival at Mumbai", time: "09:00 AM", cost: 1200 },
          { name: "Check-in Hotel", time: "11:00 AM", cost: 4000 },
          { name: "Lunch", time: "01:00 PM", cost: 500 },
          { name: "Gateway of India", time: "04:00 PM", cost: 200 },
        ],
      },
      {
        day: "Day 2",
        activities: [
          { name: "Marine Drive", time: "08:00 AM", cost: 150 },
          { name: "Juhu Beach", time: "11:00 AM", cost: 100 },
          { name: "Elephanta Caves", time: "02:00 PM", cost: 400 },
          { name: "Dinner at Marine Drive", time: "07:00 PM", cost: 800 },
        ],
      },
      {
        day: "Day 3",
        activities: [
          { name: "Bandstand", time: "09:00 AM", cost: 200 },
          { name: "Sanjay Gandhi National Park", time: "11:00 AM", cost: 350 },
          { name: "Shopping at Linking Road", time: "04:00 PM", cost: 2000 },
          { name: "Packing", time: "08:00 PM", cost: 0 },
        ],
      },
    ],
  },
  paris: {
    name: "Paris",
    itinerary: [
      {
        day: "Day 1",
        activities: [
          { name: "Arrival at Paris", time: "09:00 AM", cost: 20000 },
          { name: "Check-in Hotel", time: "11:00 AM", cost: 8000 },
          { name: "Lunch at Cafe", time: "01:00 PM", cost: 1500 },
          { name: "Eiffel Tower Visit", time: "03:00 PM", cost: 1200 },
        ],
      },
      {
        day: "Day 2",
        activities: [
          { name: "Louvre Museum Tour", time: "10:00 AM", cost: 1400 },
          { name: "Walking Tour", time: "01:00 PM", cost: 0 },
          { name: "Seine River Cruise", time: "05:00 PM", cost: 1800 },
          { name: "Dinner at Bistro", time: "07:00 PM", cost: 2000 },
        ],
      },
      {
        day: "Day 3",
        activities: [
          { name: "Breakfast", time: "08:00 AM", cost: 800 },
          { name: "Versailles Day Trip", time: "09:00 AM", cost: 3500 },
          { name: "Return to Hotel", time: "06:00 PM", cost: 500 },
          { name: "Packing", time: "08:00 PM", cost: 0 },
        ],
      },
    ],
  },
};

export default function ItineraryPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = use(params);
  const cityInfo = cityData[city.toLowerCase()];
  
  if (!cityInfo) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center">
        <p>City not found</p>
      </div>
    );
  }

  const totalExpenses = cityInfo.itinerary.reduce((acc, day) => {
    return acc + day.activities.reduce((sum, act) => sum + act.cost, 0);
  }, 0);

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <div className="bg-[#2E4057] text-white px-6 py-3">
        <span className="text-xl font-semibold text-[#FF6B35]">Traveloop</span>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-4xl font-bold text-black">Itinerary - {cityInfo.name}</h1>
          <Link href="/activity-search" className="text-lg text-[#2E4057] w-fit hover:underline">← Back</Link>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {cityInfo.itinerary.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className="bg-white rounded-3xl border border-gray-300 shadow-sm overflow-hidden"
            >
              <div className="bg-[#2E4057] text-white px-6 py-3">
                <span className="font-semibold">{day.day}</span>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-[#2E4057] mb-3">Activities & Expenses</h3>
                <div className="space-y-2">
                  {day.activities.map((activity, actIndex) => (
                    <div key={actIndex} className="flex justify-between items-center text-base">
                      <div>
                        <p className="text-gray-700 font-medium">{activity.name}</p>
                        <p className="text-gray-500 text-sm">{activity.time}</p>
                      </div>
                      <span className="text-gray-900 font-semibold text-lg">₹{activity.cost.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t-2 border-[#FF6B35] pt-3 mt-3 flex justify-between font-bold text-lg">
                    <span className="text-[#FF6B35]">Day Total</span>
                    <span className="text-[#FF6B35]">₹{day.activities.reduce((sum, a) => sum + a.cost, 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-white rounded-3xl border border-gray-300 shadow-sm p-4">
          <div className="flex justify-between items-center">
            <span className="text-xl font-semibold text-[#2E4057]">Total Trip Expenses</span>
            <span className="text-xl font-bold text-[#FF6B35]">₹{totalExpenses.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}