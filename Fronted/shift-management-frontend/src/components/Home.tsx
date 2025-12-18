import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ShiftForm from './ShiftForm';
import ShiftList from './ShiftList';
import './Home.css';

const Home: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleShiftCreated = () => {
    // Trigger refresh of shift list
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>מערכת ניהול משמרות</h1>
        <button onClick={handleLogout} className="logout-button">
          התנתק
        </button>
      </header>

      <main className="home-main">
        <div className="content-wrapper">
          <ShiftForm onShiftCreated={handleShiftCreated} />
          <ShiftList refreshTrigger={refreshTrigger} />
        </div>
      </main>

      <footer className="home-footer">
        <p>כל הזכויות שמורות © 2023</p>
      </footer>
    </div>
  );
};

export default Home;