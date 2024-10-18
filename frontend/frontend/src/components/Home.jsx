import React, { useEffect, useState } from 'react';
// import Navbar from '../Navbar/Navbar';

const Home = () => {
  const current_theme = localStorage.getItem('current_theme');
  const [theme, setTheme] = useState(current_theme ? current_theme : 'light');

  useEffect(() => {
    localStorage.setItem('current_theme', theme);
  }, [theme]);

  return (
    <div className={`container ${theme}`} style={{ paddingTop: '20px',padding:'0' }}> 
      
    </div>
  );
};

export default Home;
