"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useUsers } from "@/lib/useUsers";

type TabType = "users" | "cities" | "activities" | "trends";

const COLORS = ['#FF6B35', '#2E4057', '#1D976C', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function AdminPage() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("users");
  const { users, loading: usersLoading } = useUsers();

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push("/dashboard");
    }
  }, [user, authLoading, isAdmin, router]);

  const popularCitiesData = [
    { name: "Tokyo", value: 4500 },
    { name: "Paris", value: 3800 },
    { name: "New York", value: 3200 },
    { name: "London", value: 2900 },
    { name: "Bali", value: 2500 },
  ];

  const popularActivitiesData = [
    { name: "City Tours", value: 3200 },
    { name: "Food Experiences", value: 2800 },
    { name: "Adventure Sports", value: 1900 },
    { name: "Museum Visits", value: 1500 },
    { name: "Beach Activities", value: 1200 },
  ];

  const userTrendsData = [
    { month: 'Jan', users: 120, bookings: 85, trips: 45 },
    { month: 'Feb', users: 145, bookings: 95, trips: 52 },
    { month: 'Mar', users: 180, bookings: 120, trips: 68 },
    { month: 'Apr', users: 210, bookings: 145, trips: 82 },
    { month: 'May', users: 250, bookings: 180, trips: 95 },
    { month: 'Jun', users: 320, bookings: 220, trips: 120 },
  ];

  const statsData = [
    { name: 'Jan', users: 400, active: 240 },
    { name: 'Feb', users: 300, active: 139 },
    { name: 'Mar', users: 550, active: 380 },
    { name: 'Apr', users: 450, active: 290 },
    { name: 'May', users: 380, active: 200 },
  ];

  const getUserDisplayName = (u: any): string => {
    if (u.firstName && u.lastName) {
      return `${u.firstName} ${u.lastName}`;
    }
    if (u.firstName) {
      return u.firstName;
    }
    return u.email?.split("@")[0] || "User";
  };

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#2E4057]">Manage Users</h3>
            {usersLoading ? (
              <p className="text-gray-500">Loading users...</p>
            ) : users.length === 0 ? (
              <p className="text-gray-500">No users found. Users will appear here after registration.</p>
            ) : (
              users.map((u: any) => (
                <div key={u.id} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200">
                  <div className="w-10 h-10 rounded-full bg-[#FF6B35] flex items-center justify-center text-white font-medium">
                    {getUserDisplayName(u).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{getUserDisplayName(u)}</p>
                    <p className="text-sm text-gray-500">{u.email}</p>
                    {u.city && <p className="text-xs text-gray-400">{u.city}, {u.country}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    {u.isAdmin && (
                      <span className="px-2 py-1 text-xs bg-[#FF6B35] text-white rounded-full">Admin</span>
                    )}
                  </div>
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Edit</button>
                  <button className="px-3 py-1 text-sm text-red-500 border border-red-300 rounded-lg hover:bg-red-50">Suspend</button>
                </div>
              ))
            )}
            <p className="text-sm text-gray-500 mt-4">Total Users: {users.length}</p>
          </div>
        );
      case "cities":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[#2E4057]">Popular Cities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h4 className="font-medium text-gray-700 mb-4">City Popularity</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={popularCitiesData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#8884d8" paddingAngle={5} dataKey="value" label={({name, value}) => `${name}: ${value}`}>
                      {popularCitiesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h4 className="font-medium text-gray-700 mb-4">Top Destinations</h4>
                <div className="space-y-3">
                  {popularCitiesData.map((city, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-gray-700">{city.name}</span>
                      <span className="text-[#FF6B35] font-medium">{city.value.toLocaleString()} visits</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case "activities":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[#2E4057]">Popular Activities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h4 className="font-medium text-gray-700 mb-4">Activity Distribution</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={popularActivitiesData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#8884d8" paddingAngle={5} dataKey="value">
                      {popularActivitiesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h4 className="font-medium text-gray-700 mb-4">Top Activities</h4>
                <div className="space-y-3">
                  {popularActivitiesData.map((activity, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-gray-700">{activity.name}</span>
                      <span className="text-[#1D976C] font-medium">{activity.value.toLocaleString()} bookings</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case "trends":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[#2E4057]">User Trends and Analytics</h3>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h4 className="font-medium text-gray-700 mb-4">User Engagement & Booking Trends</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#FF6B35" strokeWidth={2} />
                  <Line type="monotone" dataKey="bookings" stroke="#2E4057" strokeWidth={2} />
                  <Line type="monotone" dataKey="trips" stroke="#1D976C" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h4 className="font-medium text-gray-700 mb-4">Monthly Statistics</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={statsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#FF6B35" />
                  <Bar dataKey="active" fill="#2E4057" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <header className="w-full bg-[#2E4057] text-white px-6 py-3 flex items-center justify-between">
        <span className="text-xl font-semibold text-[#FF6B35]">TravelLoop</span>
        <div className="w-8 h-8 rounded-full bg-gray-400 overflow-hidden">
          {user.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-sm font-medium">
              {user.email?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex gap-3 mb-8">
          {(["users", "cities", "activities", "trends"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full border font-medium transition ${
                activeTab === tab
                  ? "bg-[#FF6B35] text-white border-[#FF6B35]"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {tab === "users" && "Manage Users"}
              {tab === "cities" && "Popular Cities"}
              {tab === "activities" && "Popular Activities"}
              {tab === "trends" && "User Trends and Analytics"}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}