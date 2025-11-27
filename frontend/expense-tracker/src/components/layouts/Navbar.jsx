// src/components/layouts/Navbar.jsx
import React from "react";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = ({ activeMenu, openSideMenu, setOpenSideMenu }) => {
  return (
    <div className="navbar-container flex items-center justify-between px-8 py-4 bg-gradient-to-r from-indigo-900 via-purple-900 to-gray-900 text-white shadow-xl">
      <button
        className="menu-toggle-btn p-3 bg-white/10 hover:bg-white/20 rounded-full shadow-lg border border-white/20 focus:outline-none transition-all duration-200"
        onClick={() => setOpenSideMenu(!openSideMenu)}
      >
        {openSideMenu ? (
          <FiX className="menu-icon text-3xl text-violet-300 transition-all duration-200" />
        ) : (
          <FiMenu className="menu-icon text-3xl text-violet-300 transition-all duration-200" />
        )}
      </button>

      <h2 className="navbar-title text-3xl font-bold tracking-wide bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg select-none">
        Expense Tracker
      </h2>
    </div>
  );
};

export default Navbar;
