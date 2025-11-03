import React from "react";
import { Link } from "react-router-dom";

export default function Account() {
  // Dummy user data — replace with real auth/user API later
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    joined: "2024-08-15",
    address: "123 Main St, Bengaluru, KA",
    phone: "+91 98765 43210",
  };

  const recentOrders = [
    { id: 101, date: "2025-10-30", total: 1299.99, status: "Delivered" },
    { id: 102, date: "2025-09-12", total: 399.0, status: "Delivered" },
  ];

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-2xl p-8">
      <h1 className="text-3xl font-bold mb-6">Account</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 text-sm">Name</p>
            <p className="font-medium">{user.name}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Phone</p>
            <p className="font-medium">{user.phone}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Joined</p>
            <p className="font-medium">{new Date(user.joined).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-gray-600 text-sm">Address</p>
          <p className="font-medium">{user.address}</p>
        </div>

        <div className="mt-6">
          <Link to="/" className="text-indigo-600 hover:text-indigo-800">
            Edit Profile
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <p className="text-gray-500">No recent orders.</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((o) => (
              <div key={o.id} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Order #{o.id}</p>
                  <p className="text-sm text-gray-500">Placed on {new Date(o.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{o.total.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{o.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
