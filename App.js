import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Login from './Login';
import ForgotPassword from './ForgotPassword';
import Signup from './Signup';
import VehicleOwner from './VehicleOwner';
import FuelOwnerDashboard from './FuelOwnerDashboard';
import MechanicOwnerDashboard from './MechanicOwnerDashboard';
import Home from './Home';
import About from './About';
import Services from './Services';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('vehicleRequests');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role) {
      setIsLoggedIn(true);
      setUserRole(role);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('vehicleRequests', JSON.stringify(requests));
  }, [requests]);

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userRole={userRole} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        {/* <Footer /> */}

        {/* Role-based routing */}
        <Route
          path="/vehicleowner"
          element={
            userRole === 'VehicleOwner' ? (
              <VehicleOwner requests={requests} setRequests={setRequests} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/fuelownerdashboard"
          element={
            userRole === 'FuelOwner' ? (
              <FuelOwnerDashboard requests={requests} setRequests={setRequests} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/mechanicownerdashboard"
          element={
            userRole === 'Mechanic' ? (
              <MechanicOwnerDashboard requests={requests} setRequests={setRequests} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>

  );
}

export default App;
