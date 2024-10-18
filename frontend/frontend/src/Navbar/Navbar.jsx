import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo_light from '../assets/thdc-black.jpg';
import logo_dark from '../assets/thdc-color.jpg';
import search_icon_light from '../assets/search-w.png';
import search_icon_dark from '../assets/search-b.png';
import toggle_light from '../assets/night.png';
import toggle_dark from '../assets/day.png';

const Navbar = ({ theme, setTheme, setIsAuthenticated }) => {
  const navigate = useNavigate();

  // Retrieve user role from localStorage
  const userRole = localStorage.getItem('userRole');

  const toggle_mode = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('userRole'); // Clear user role from localStorage on logout
    localStorage.removeItem('employeeId'); // Clear employee ID from localStorage on logout
    navigate('/'); // Redirect to Login page
  };

  return (
    <div className='navbar'>
      <img src={theme === 'light' ? logo_light : logo_dark} alt="logo" className='logo' />
      <ul>
        {/* <li onClick={() => navigate('/home')}>Home</li> */}
        {/* Conditional rendering based on userRole */}
        {userRole === 'Reporting Officer' && (
          <>
            <li onClick={() => navigate('/givetask')}>Give Task</li>
            <li onClick={() => navigate('/registeredusers')}>Registered Users</li>
          </>
        )}
        {/* {userRole === 'Employee' && ( */}
          <li onClick={() => navigate('/viewtask')}>View Task</li>
        {/* )} */}
        {/* <li onClick={() => navigate('/about')}>About</li> */}
        <li onClick={handleLogout}>Logout</li>
      </ul>
      <img onClick={toggle_mode} src={theme === 'light' ? toggle_light : toggle_dark} alt="toggle icon" className='toggle-icon' />
    </div>
  );
};

export default Navbar;
