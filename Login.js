import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login({ setIsLoggedIn, setUserRole }) {
  const [form, setForm] = useState({ username: '', password: '', role: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if the user exists and credentials match
    const matchedUser = users.find(
      (user) =>
        user.email === form.username &&
        user.password === form.password &&
        user.role === form.role
    );

    if (!matchedUser) {
      setError('Invalid user or credentials. Please sign up.');
      return;
    }

    // Store role and mark as logged in
    localStorage.setItem('userRole', form.role);
    setIsLoggedIn(true);
    setUserRole(form.role);

    // Navigate based on role
    if (form.role === 'VehicleOwner') {
      navigate('/vehicleowner');
    } else if (form.role === 'FuelOwner') {
      navigate('/fuelownerdashboard');
    } else if (form.role === 'Mechanic') {
      navigate('/mechanicownerdashboard');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <input
          type="text"
          name="username"
          placeholder="Email"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <select name="role" value={form.role} onChange={handleChange} required>
          <option value="">Select Role</option>
          <option value="VehicleOwner">Vehicle Owner</option>
          <option value="FuelOwner">Fuel Owner</option>
          <option value="Mechanic">Mechanic</option>
        </select>
        <button type="submit">Login</button>
        <div style={{ textAlign: "center", marginTop: "10px" }}>
        <Link to="/forgot" style={{ fontSize: "14px", color: "#007bff", textDecoration: "none" }}>
          Forgot Password?
        </Link>
        </div>
      </form>
      <div style={{ textAlign: "center", marginTop: "15px" }}>
        Don't have an account?{" "}
        <Link to="/signup" style={{ marginLeft: "5px", textDecoration: "none", color: "#007bff" }}>
          Signup
        </Link>
      </div>
    </div>
  );
}

export default Login;
