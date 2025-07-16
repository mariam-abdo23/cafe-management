import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fff3e0] text-center p-8">
      <h1 className="text-5xl font-bold text-[#a0522d] mb-4">404</h1>
      <p className="text-xl text-[#6d4c41] mb-6">Oops! Page not found.</p>
      <Link
        to="/"
        className="px-6 py-2 bg-[#a0522d] text-white rounded-full hover:bg-[#8b4513] transition"
      >
        Go to Home
      </Link>
    </div>
  );
}
