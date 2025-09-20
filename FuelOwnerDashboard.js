import React, { useEffect, useState } from 'react';
import { parseISO, isToday, isThisWeek, isThisMonth } from 'date-fns';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00c49f'];

function FuelOwnerDashboard() {
  const [requests, setRequests] = useState([]);
  const [completedStats, setCompletedStats] = useState([]);
  const [timeFilter, setTimeFilter] = useState('today');

  // Load fuelCompletedStats and requests from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('fuelCompletedStats');
    if (savedStats) {
      setCompletedStats(JSON.parse(savedStats));
    }

    const savedRequests = localStorage.getItem('vehicleRequests');
    if (savedRequests) {
      setRequests(JSON.parse(savedRequests));
    }
  }, []);

  const updateStats = (fuelType, liters) => {
    const newEntry = {
      fuelType,
      liters: parseFloat(liters),
      date: new Date().toISOString(),
    };
    const updated = [...completedStats, newEntry];
    localStorage.setItem('fuelCompletedStats', JSON.stringify(updated));
    setCompletedStats(updated);
  };

  const updateRequests = (updated) => {
    setRequests(updated);
    localStorage.setItem('vehicleRequests', JSON.stringify(updated));
  };

  const handleAccept = (id) => {
    const updated = requests.map(req => {
      if (req.id === id) {
        updateStats(req.fuelType, req.fuelLiters);
        return {
          ...req,
          status: 'Accepted',
          eta: 20,
          deliveryLocation: { lat: 17.481465, lng: 78.3934546 },
        };
      }
      return req;
    });
    updateRequests(updated);
  };

  const handleReject = (id) => {
    const updated = requests.map(req =>
      req.id === id ? { ...req, status: 'Rejected' } : req
    );
    updateRequests(updated);
  };

  const filterFunctions = {
    today: isToday,
    week: isThisWeek,
    month: isThisMonth,
  };

  const getFuelTypeData = () => {
    const filterFn = filterFunctions[timeFilter];
    const filtered = completedStats.filter(entry => filterFn(parseISO(entry.date)));
    const summary = {};
    filtered.forEach(({ fuelType }) => {
      summary[fuelType] = (summary[fuelType] || 0) + 1;
    });
    return Object.entries(summary).map(([fuelType, count]) => ({
      name: fuelType,
      value: count,
    }));
  };

  const getTotalLitersByFuelType = () => {
    const summary = {};
    completedStats.forEach(({ fuelType, liters }) => {
      summary[fuelType] = (summary[fuelType] || 0) + liters;
    });
    return summary;
  };

  const totalLiters = getTotalLitersByFuelType();
  const todayCount = completedStats.filter(e => isToday(parseISO(e.date))).length;
  const weekCount = completedStats.filter(e => isThisWeek(parseISO(e.date))).length;
  const monthCount = completedStats.filter(e => isThisMonth(parseISO(e.date))).length;

  const filteredFuelRequests = requests.filter(req => req.service === 'Fuel Delivery');

  return (
    <div>
     <h1 style={{ textAlign: 'center', marginTop: '50px', marginBottom: '10px' }}>Fuel Requests Summary</h1>
      <div style={{ display: 'flex', gap: '30px', marginTop: '20px', marginBottom: '30px' }}>
      <div style={{ flex: 1 }}>
      <div style={{ ...styles.card, padding: '20px 50px' }}>
        <h2 style={{ color: '#0f172a', marginBottom: '20px' }}>Total Fuel Services Summary</h2>
        <p><strong>Total:</strong> {completedStats.length}</p>
        <p><strong>Today:</strong> {todayCount}</p>
        <p><strong>This Week:</strong> {weekCount}</p>
        <p><strong>This Month:</strong> {monthCount}</p>
      <div style={{ marginTop: '15px' }}>
        <h4>Fuel Type Breakdown (Litres)</h4>
        {Object.keys(totalLiters).length === 0 ? (
          <p style={{ color: '#888' }}>No Data</p>
        ) : (
          <ul style={{ paddingLeft: '10px', lineHeight: '1.8', listStylePosition: 'inside' }}>
            {Object.entries(totalLiters).map(([fuel, liters]) => (
              <li key={fuel}><strong>{fuel}:</strong> {liters.toFixed(2)} Litres</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  </div>

  {/* Pie Chart Section */}
  <div style={{ flex: 1 }}>
    <div style={styles.card}>
      <h3>Fuel Request Stats</h3>
      <select
        value={timeFilter}
        onChange={(e) => setTimeFilter(e.target.value)}
        style={styles.select}
      >
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
      </select>

      {getFuelTypeData().length === 0 ? (
        <p style={{ marginTop: '40px', fontSize: '18px', color: '#888' }}>No Requests</p>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <PieChart width={260} height={260}>
            <Pie
              data={getFuelTypeData()}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, value }) => `${name}: ${value}`}
            >
              {getFuelTypeData().map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </div>
      )}
    </div>
  </div>
</div>

      <div>
        <h2 style={{ textAlign: 'center' }}>Fuel Requests' Details</h2>
        {filteredFuelRequests.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
            No fuel delivery requests.
          </p>
        ) : (
          filteredFuelRequests.map(req => (
            <div key={req.id} style={styles.requestCard}>
              <h4>{req.name}</h4>
              <p><strong>Phone:</strong>{req.mobile}</p>
              <p><strong>Fuel:</strong> {req.fuelType} - {req.quantity} Litres</p>
              <p><strong>Location:</strong> {req.location}</p>
              <p><strong>Status:</strong> {req.status}</p>

              {req.status === 'Accepted' && (
                <>
                  <p><strong>ETA:</strong> {req.eta} Minutes</p>
                  <p><strong>Delivery Location:</strong> Lat: {req.deliveryLocation.lat}, Lng: {req.deliveryLocation.lng}</p>
                </>
              )}

              {req.status === 'Pending' && (
                <>
                  <button onClick={() => handleAccept(req.id)} style={styles.acceptBtn}>
                    Accept
                  </button>
                  <button onClick={() => handleReject(req.id)} style={styles.rejectBtn}>
                    Reject
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
    height: 'auto',
  },
  select: {
    padding: '8px',
    borderRadius: '6px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    fontWeight: 'bold',
    background: '#fff',
  },
  requestCard: {
    border: '1px solid #ccc',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '15px',
    backgroundColor: '#fff',
  },
  acceptBtn: {
    backgroundColor: '#28a745',
    color: '#fff',
    padding: '8px 14px',
    marginRight: '10px',
    border: 'none',
    borderRadius: '4px',
  },
  rejectBtn: {
    backgroundColor: '#dc3545',
    color: '#fff',
    padding: '8px 14px',
    border: 'none',
    borderRadius: '4px',
  },
};

export default FuelOwnerDashboard;
