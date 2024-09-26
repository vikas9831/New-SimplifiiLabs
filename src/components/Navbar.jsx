import React, { useState } from 'react';
import './navbar.css';

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.className = isDarkMode ? 'light-theme' : 'dark-theme';
  };

  return (
    <nav className={`p-4 bg-gray-900 text-white ${isDarkMode ? 'dark' : 'light'} transition-colors`}>
      <div className="flex justify-between items-center w-full">

        <h1 className="text-2xl font-bold text-orange-400"> Image Uploader App</h1>
        
        <div onClick={toggleTheme} className="cursor-pointer text-2xl mr-10">
          {isDarkMode ? '☀️' : '🌙'}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
