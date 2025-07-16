import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUtensils,
  FaChair,
  FaReceipt,
  FaWifi,
  FaMusic,
  FaLeaf,
  FaPhone,
  FaInstagram,
  FaGift,
  FaStar,
  FaBell,
  FaLightbulb
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const offers = [
  '🎉 Special Coffee Day Offer! 20% off all orders.',
  '🥳 Free drink with table reservation for 4 or more.',
  '🎁 Discount code for first visit: WELCOME10'
];

const blogs = [
  {
    title: '☕ Top 5 Coffee Drinks You Must Try!',
    summary: 'Discover our deliciously crafted coffee options.'
  },
  {
    title: '🍰 Best Dessert to Pair with Coffee',
    summary: 'The right dessert enhances your coffee experience.'
  },
  {
    title: '📖 Our Story: From Beans to Cup',
    summary: 'Learn how we started and what makes us unique.'
  }
];

const fadeUpVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: 'easeOut'
    }
  })
};

export default function UserHome() {
  const [userName, setUserName] = useState('');
  const [offerIndex, setOfferIndex] = useState(0);
  const [countdown, setCountdown] = useState(300);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) setUserName(user.name);
  }, []);

  useEffect(() => {
    const offerTimer = setInterval(() => {
      setOfferIndex((prev) => (prev + 1) % offers.length);
    }, 5000);
    return () => clearInterval(offerTimer);
  }, []);

  useEffect(() => {
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdownTimer);
  }, []);

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3e8d5] to-[#f8f4ee] p-4">
      {[ 
        <div key="offer" className="bg-[#6b4226] text-white text-sm py-2 px-4 text-center font-semibold rounded-md shadow mb-4">
          {offers[offerIndex]}
        </div>,

        <div key="welcome" className="bg-[#6b4226] text-white text-center py-10 px-4 rounded-2xl shadow-lg max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Welcome, {userName || 'Dear Guest'} 👋</h1>
          <p className="text-lg">Get ready for a delicious and cozy experience with our curated menu 🍰☕</p>
        </div>,

        <motion.div
          key="quicklinks"
          custom={3}
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10 max-w-6xl mx-auto"
        >
          {[{
            to: '/menu', icon: <FaUtensils className="text-3xl mb-2 text-white" />, label: 'Browse Menu', color: 'from-[#d2b48c] to-[#b9936c]'
          }, {
            to: '/user/reservations', icon: <FaChair className="text-3xl mb-2 text-white" />, label: 'Reserve a Table', color: 'from-[#c48f65] to-[#a67452]'
          }, {
            to: '/my-orders', icon: <FaReceipt className="text-3xl mb-2 text-white" />, label: 'My Orders', color: 'from-[#a0522d] to-[#843c1c]'
          }].map(({ to, icon, label, color }, i) => (
            <motion.div
              key={label}
              custom={i}
              variants={fadeUpVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}
              className={`bg-gradient-to-br ${color} p-6 rounded-2xl shadow-md flex flex-col items-center transition text-white backdrop-blur-md bg-opacity-70`}
            >
              <Link to={to} className="flex flex-col items-center">
                {icon}
                <span className="text-xl font-semibold">{label}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>,

        <motion.div
          key="quote"
          custom={4}
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mt-10 text-[#6b4226] italic text-lg"
        >
          “Every cup of coffee here starts a new story. Enjoy your day!” ☕
        </motion.div>,

        <div key="promo-cards" className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 max-w-6xl mx-auto">
          {[{
            icon: <FaGift className="text-2xl" />, text: 'Buy 5, Get 6th Free!', color: 'bg-[#8b5e3c]'
          }, {
            icon: <FaStar className="text-2xl" />, text: 'Earn points with each order for rewards!', color: 'bg-[#7b4f2c]'
          }, {
            icon: <FaGift className="text-2xl" />, text: 'First Visit Discount Code: WELCOME10', color: 'bg-[#6b4226]'
          }].map(({ icon, text, color }, i) => (
            <motion.div
              key={text}
              custom={i}
              variants={fadeUpVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
              className={`${color} text-white p-6 rounded-xl shadow-md text-center`}
            >
              {icon}
              <p>{text}</p>
            </motion.div>
          ))}
        </div>,

        <motion.div
          key="timer"
          custom={5}
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-[#fff5e1] mt-10 p-6 rounded-xl shadow-md text-center w-full max-w-md mx-auto"
        >
          <h3 className="text-2xl font-bold text-[#6b4226] mb-2">⏳ Limited Offer</h3>
          <p className="text-[#5e3b1f] text-lg">Get 10% off in the next:</p>
          <div className="text-4xl font-bold text-[#a0522d] mt-2">{formatTime(countdown)}</div>
        </motion.div>,

        <motion.div
          key="about"
          custom={6}
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-14 bg-white rounded-xl shadow-md p-6 max-w-5xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-[#6b4226] mb-3">About Us</h2>
          <p className="text-[#5e3b1f] leading-relaxed">
            Our café blends the flavor of premium coffee with a warm, relaxing atmosphere. We offer high-quality drinks, delicious treats,
            and friendly service to create memorable moments for every guest. We are happy to serve you! ❤️
          </p>
        </motion.div>,

        <motion.div
          key="features"
          custom={7}
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-10 bg-white rounded-xl shadow-md p-6 max-w-5xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-[#6b4226] mb-4">Our Features</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[#5e3b1f] text-lg">
            <li className="flex items-center gap-2"><FaWifi /> Free Wi-Fi</li>
            <li className="flex items-center gap-2"><FaLeaf /> Outdoor Seating</li>
            <li className="flex items-center gap-2"><FaMusic /> Calm Music</li>
            <li className="flex items-center gap-2"><FaChair /> Comfortable Seating</li>
          </ul>
        </motion.div>,

        <motion.div
          key="blogs"
          custom={8}
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {blogs.map(({ title, summary }, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="bg-[#fffaf0] p-6 rounded-xl shadow-md hover:shadow-xl transition"
            >
              <h3 className="text-xl font-bold text-[#6b4226] mb-2">{title}</h3>
              <p className="text-[#5e3b1f]">{summary}</p>
            </motion.div>
          ))}
        </motion.div>,

    
      ].map((section, index) => (
        <motion.div
          key={index}
          custom={index}
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          {section}
        </motion.div>
      ))}
    </div>
  );
}
