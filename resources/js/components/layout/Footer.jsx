import React from 'react';
import { FaPhone, FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';


export default function Footer() {
  return <>
    <footer className="bg-[#3e2723] text-white py-10">
      <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Logo & About */}
        <div>
          <h2 className="text-2xl font-bold mb-2">Coffee Corner ☕</h2>
          <p className="text-sm leading-relaxed">
            Where every cup tells a story. Join us for delicious coffee and warm moments!
          </p>
        </div>

        {/* Working Hours */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Working Hours</h3>
          <ul className="text-sm space-y-1">
            <li>Sunday - Thursday: 8 AM - 10 PM</li>
            <li>Friday: 1 PM - 11 PM</li>
            <li>Saturday: 10 AM - 11 PM</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Contact Us</h3>
          <ul className="text-sm space-y-2">
            <li className="flex items-center gap-2">
              <FaPhone /> 01000000000
            </li>
            <li className="flex items-center gap-2">
              <FaInstagram />
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
                Instagram
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FaFacebook />
              <a href="#" className="hover:underline">Facebook</a>
            </li>
            <li className="flex items-center gap-2">
              <FaTwitter />
              <a href="#" className="hover:underline">Twitter</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center text-xs mt-8 border-t border-[#5d4037] pt-4">
        &copy; {new Date().getFullYear()} Coffee Corner. All rights reserved.
      </div>
    </footer>
  </>
}
