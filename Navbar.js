import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

function Navbar({ isLoggedIn, setIsLoggedIn, userRole }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    navigate('/');
  };

  const getDashboardPath = () => {
    if (userRole === 'VehicleOwner') return '/vehicleowner';
    if (userRole === 'FuelOwner') return '/fuelownerdashboard';
    if (userRole === 'Mechanic') return '/mechanicownerdashboard';
    return null;
  };

  const isHomePage = location.pathname === '/';

  return (
    <>
      {/* ----------- NAVBAR ----------- */}
      <nav id='home'>
        <div className="logo-container">
          <img src="/img.jpg" alt="Logo" className="logo" id="img" />
        </div>
        <div id='txt'>
          <h1 style={{ marginLeft: "10px" }}>Mobile Vehicle Needs</h1>
        </div>
        <div id='t'>
          <Link to="/">HOME</Link>
          <HashLink smooth to="/#about">ABOUT</HashLink>
          <HashLink smooth to="/#services">SERVICES</HashLink>
          {isLoggedIn ? (
            <>
              {getDashboardPath() && <Link to={getDashboardPath()}>REQUESTS</Link>}
              <button onClick={handleLogout}>LOGOUT</button>
            </>
          ) : (
            <>
              <Link to="/login">LOGIN</Link>
              <Link to="/signup">
                <button>SIGNUP</button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ----------- SHOW CAROUSEL ONLY ON HOME PAGE ----------- */}
      {isHomePage && (
        <div className="carousel-container">
          <Carousel
            autoPlay
            infiniteLoop
            showThumbs={false}
            showStatus={false}
            interval={3000}
            transitionTime={800}
          >
            <div>
              <img
                src="fuelserviceimage.jpg"
                alt="Fuel Delivery"
              />
              <p className="legend">Fuel Delivery at Your Location</p>
            </div>
            <div>
              <img
                src="MechanicService.jpg"
                alt="Mechanic Assistance"
              />
              <p className="legend">Quick Mechanic Assistance</p>
            </div>
          </Carousel>
        </div>
      )}
    </>
  );
}

export default Navbar;