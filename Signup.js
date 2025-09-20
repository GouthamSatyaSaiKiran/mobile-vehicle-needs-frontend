import React, { useState } from "react";
import { FaUser, FaPhone, FaEnvelope, FaLock, FaUserTie, FaAddressCard, FaHome, FaRegAddressCard, FaUsers } from "react-icons/fa";
import axios from "axios";  // <-- make sure you import axios
import './SignUp.css';
import { Link } from "react-router-dom";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    role: ""
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // to store success message from backend

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // ✅ localStorage-based logic
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = existingUsers.some((user) => user.email === form.email);

    if (userExists) {
      setError("Account already exists.");
    } else {
      const newUser = {
        name: form.name,
        mobile: form.mobile,
        email: form.email,
        password: form.password,
        address: form.address,
        role: form.role
      };

      localStorage.setItem("users", JSON.stringify([...existingUsers, newUser]));
    }

    try {
      const response = await axios.post("http://localhost:8080/auth/register", form);
      setMessage(response.data); // adjust if backend sends { message: "..." }
    } catch (err) {
      setError(err.response?.data || "Registration failed");
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSignup}>
        <h2>Register</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}

        <div className="input-group">
          <FaUser className="icon" />
          <input type="text" name="name" placeholder="Enter your full name" required onChange={handleChange} />
        </div>

        <div className="input-group">
          <FaPhone className="icon" />
          <input type="tel" name="mobile" placeholder="Enter valid 10-digit phone no." pattern="[0-9]{10}" required onChange={handleChange} />
        </div>

        <div className="input-group">
          <FaEnvelope className="icon" />
          <input type="email" name="email" placeholder="Enter your email" required onChange={handleChange} />
        </div>

        <div className="input-group">
          <FaLock className="icon" />
          <input type="password" name="password" placeholder="Enter your password" required onChange={handleChange} />
        </div>

        <div className="input-group">
          <FaLock className="icon" />
          <input type="password" name="confirmPassword" placeholder="Confirm your password" required onChange={handleChange} />
        </div>

        <div className="input-group">
          <FaRegAddressCard className="icon" />
          <input type="address" name="address" placeholder="Enter your address" required onChange={handleChange} />
        </div>

        <div className="input-group">
          <FaUsers className="icon" />
          <select name="role" required onChange={handleChange}>
            <option value="">Select your role</option>
            <option value="FuelOwner">Fuel Owner</option>
            <option value="Mechanic">Mechanic</option>
            <option value="VehicleOwner">Vehicle Owner</option>
          </select>
        </div>

        <button className="signup-button" type="submit">
          Create Account
        </button>
      </form>
      <div style={{ textAlign: "center", marginTop: "15px" }}>
        Already have an account?{" "}
      <Link to="/login" style={{ marginLeft: "5px", textDecoration: "none", color: "#007bff" }}>
        Login
      </Link>
      </div>
    </div>
  );
};

export default SignUp;
