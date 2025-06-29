import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Home({ userRole, userName }) {
  const lastOrder = {
    item: 'Latte & Croissant',
    status: 'قيد التحضير',
    table: 5,
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Welcome {userName} to our Café!</h1>
      

      {userRole === 'user' && (
        <div className="flex flex-col items-center justify-center h-screen bg-[#fdf6f0] px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-[#4e342e] mb-2">
            Welcome, {userName}!
          </h1>
          <p className="text-xl md:text-2xl text-[#6d4c41] mb-6">
            to <span className="font-semibold">Coffee Time ☕</span>
          </p>

          <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md border border-[#d7ccc8]">
            <h2 className="text-xl font-semibold text-[#5d4037] mb-4">Your Last Order</h2>
            <p className="mb-2">
              <span className="font-bold text-[#6d4c41]">Order:</span> {lastOrder.item}
            </p>
            <p className="mb-2">
              <span className="font-bold text-[#6d4c41]">Status:</span>{' '}
              <span
                className={`font-semibold ${
                  lastOrder.status === 'قيد التحضير'
                    ? 'text-yellow-600'
                    : 'text-green-600'
                }`}
              >
                {lastOrder.status}
              </span>
            </p>
            <p>
              <span className="font-bold text-[#6d4c41]">Table:</span> Table #{lastOrder.table}
            </p>
          </div>
        </div>
      )}
      {userRole === 'employee' && (
        <div>
          <h2 className="text-xl font-semibold">Employee Dashboard</h2>
          <ul className="mt-4 space-y-2 text-gray-700">
            <li>📦 Pending Orders: 5</li>
            <li>🛒 Low Stock Items: Sugar, Coffee</li>
            <li>🍽️ Active Tables: 3</li>
          </ul>
        </div>
      )}

      {userRole === 'admin' && (
        <div>
          <h2 className="text-xl font-semibold">Admin Overview</h2>
          <ul className="mt-4 space-y-2 text-gray-700">
            <li>📊 Today's Orders: 25</li>
            <li>👥 Staff Members: 7</li>
            <li>💸 Total Sales Today: $350.00</li>
          </ul>
          <NavLink to="/reports" className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            View Reports
          </NavLink>
        </div>
      )}
    </div>
  );
}
