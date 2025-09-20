import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import TrackingMap from './TrackingMap';

function VehicleOwner({ requests, setRequests }) {
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    service: '',
    fuelType: '',
    quantity: '',
    issue: '',
    location: '',
  });

  // Load previous requests from localStorage when component mounts
  useEffect(() => {
    const savedRequests = localStorage.getItem('vehicleRequests');
    if (savedRequests) {
      setRequests(JSON.parse(savedRequests));
    }
  }, [setRequests]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newRequest = {
      ...form,
      id: Date.now(),
      status: 'Pending',
    };

    const updatedRequests = [...requests, newRequest];
    setRequests(updatedRequests);
    localStorage.setItem('vehicleRequests', JSON.stringify(updatedRequests)); // Save to localStorage

    try {
      if (form.service === 'Fuel Delivery') {
        // Call FuelController endpoint
        await axios.post('http://localhost:8080/fuel/request', {
          name: form.name,
          mobile: form.mobile,
          fuelType: form.fuelType,
          quantity: form.quantity,
          location: form.location,
          status: 'Pending',
        });
        console.log('Fuel request saved to DB!');
      } else if (form.service === 'Mechanic Help') {
        // Call MechanicController endpoint
        await axios.post('http://localhost:8080/mechanic/request', {
          name: form.name,
          mobile: form.mobile,
          issue: form.issue,
          location: form.location,
          status: 'Pending',
        });
        console.log('Mechanic request saved to DB!');
      }
    } catch (error) {
      console.error('Error saving request to DB:', error);
    }

    // Reset form
    setForm({
      name: '',
      mobile: '',
      service: '',
      fuelType: '',
      quantity: '',
      issue: '',
      location: '',
    });
  };

  return (
    <div className="container" style={{ display: 'flex', gap: '20px', padding: '20px', marginTop: '50px' }}>
      {/* Left side - Request Form */}
      <div className="left" style={{ flex: 1 }}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Request Card</h1>

        <form onSubmit={handleSubmit}>
          <label>Your Name</label>
          <input name="name" value={form.name} onChange={handleChange} required />

          <label>Mobile Number</label>
          <input name="mobile" value={form.mobile} onChange={handleChange} pattern="[0-9]{10}" required />

          <label>Service Needed</label>
          <select name="service" value={form.service} onChange={handleChange} required>
            <option value="">-- Select Service --</option>
            <option value="Fuel Delivery">Fuel Delivery</option>
            <option value="Mechanic Help">Mechanic Help</option>
          </select>

          {/* Fuel section */}
          {form.service === 'Fuel Delivery' && (
            <>
              <label>Fuel Type</label>
              <select name="fuelType" value={form.fuelType} onChange={handleChange} required>
                <option value="">-- Select Fuel Type --</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
              </select>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label>Quantity Required</label>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  name="quantity"
                  type="number"
                  value={form.quantity}
                  onChange={handleChange}
                  min="1"
                  step="0.25"
                  style={{ width: "100px" }}
                  required
                />
                <span>Litres</span>
                </div>
              </div>
            </>
          )}

          {/* Mechanic section */}
          {form.service === 'Mechanic Help' && (
            <>
              <label>Describe Issue</label>
              <textarea name="issue" value={form.issue} onChange={handleChange} required />
            </>
          )}

          <label>Your Location</label>
          <textarea name="location" value={form.location} onChange={handleChange} required />

          <button
            type="submit"
            style={{
              backgroundColor: '#000',
              color: '#fff',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px',
            }}
          >
            Submit Request
          </button>
        </form>
      </div>

      {/* Right side - Submitted Requests */}
      <div className="right" style={{ flex: 1 }}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Fuel/Mechanic Requests</h1>

        {requests.length === 0 && <p>No requests yet.</p>}

        {requests.map((req) => (
          <div
            key={req.id}
            style={{
              marginBottom: '20px',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#fff',
            }}
          >
            <h3>{req.service}</h3>
            <p><strong>Name:</strong> {req.name}</p>
            <p><strong>Phone:</strong> {req.mobile}</p>
            <p><strong>Status:</strong> {req.status}</p>
            {req.fuelType && <p><strong>Fuel Type:</strong> {req.fuelType}</p>}
            {req.quantity && <p><strong>Quantity:</strong> {req.quantity} Litres</p>}
            {req.issue && <p><strong>Issue:</strong> {req.issue}</p>}
            <p><strong>Location:</strong> {req.location}</p>

            {req.status === 'Accepted' && (
              <>
                {req.eta && <p><strong>ETA:</strong> {req.eta} Minutes</p>}
                {req.deliveryLocation && <TrackingMap deliveryLocation={req.deliveryLocation} />}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default VehicleOwner;
