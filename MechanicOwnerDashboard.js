import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer
} from 'recharts';
import { parseISO, isToday, isThisWeek, isThisMonth } from 'date-fns';

function MechanicOwnerDashboard({ requests = [], setRequests }) {
  const [stats, setStats] = useState({
    total: 0,
    daily: 0,
    weekly: 0,
    monthly: 0,
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Load mechanic requests from localStorage on mount
  useEffect(() => {
    const savedRequests = localStorage.getItem('vehicleRequests');
    if (savedRequests) {
      setRequests(JSON.parse(savedRequests));
    }

    try {
      const saved = JSON.parse(localStorage.getItem('mechanicStats'));
      const logs = saved?.logs ?? [];
      updateStatsFromLogs(logs);
    } catch (error) {
      console.error('Failed to load mechanicStats from localStorage:', error);
      setStats({ total: 0, daily: 0, weekly: 0, monthly: 0 });
    }
  }, []);

  // Save requests to localStorage whenever updated
  useEffect(() => {
    localStorage.setItem('vehicleRequests', JSON.stringify(requests));
  }, [requests]);

  const updateStatsFromLogs = (logs) => {
    if (!Array.isArray(logs)) logs = [];

    const total = logs.length;
    const daily = logs.filter((ts) => isToday(parseISO(ts))).length;
    const weekly = logs.filter((ts) => isThisWeek(parseISO(ts))).length;
    const monthly = logs.filter((ts) => isThisMonth(parseISO(ts))).length;

    setStats({ total, daily, weekly, monthly });
  };

  const updateStats = () => {
    const timestamp = new Date().toISOString();
    const saved = JSON.parse(localStorage.getItem('mechanicStats')) || { logs: [] };
    const updatedLogs = Array.isArray(saved.logs) ? [...saved.logs, timestamp] : [timestamp];
    localStorage.setItem('mechanicStats', JSON.stringify({ logs: updatedLogs }));
    updateStatsFromLogs(updatedLogs);
  };

  const handleAccept = (id) => {
    const updated = requests.map((req) => {
      if (req.id === id && req.service === 'Mechanic Help' && req.status === 'Pending') {
        updateStats();
        return {
          ...req,
          status: 'Accepted',
          eta: 45,
          deliveryLocation: { lat: 17.481465, lng: 78.3934546 },
        };
      }
      return req;
    });
    setRequests(updated);
  };

  const handleReject = (id) => {
    const updated = requests.map((req) =>
      req.id === id ? { ...req, status: 'Rejected' } : req
    );
    setRequests(updated);
  };

  const pieData = [
    { name: 'Today', value: stats.daily },
    { name: 'This Week', value: stats.weekly },
    { name: 'This Month', value: stats.monthly },
    { name: 'Total', value: stats.total },
  ];

  return (
    <div>
      <h1 style={{ textAlign: 'center', marginTop: '50px', marginBottom: '10px' }}>
        Mechanic Requests Summary
      </h1>

      <div style={{ padding: '20px', marginTop: '20px' }}>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
          <div
            style={{
              flex: '1',
              minWidth: '300px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              padding: '15px',
              textAlign: 'center',
            }}
          >
            <h2 style={{ color: '#0f172a', marginBottom: '20px' }}>Total Mechanic Services Summary</h2>
            <p><strong>Total:</strong> {stats.total}</p>
            <p><strong>Today:</strong> {stats.daily}</p>
            <p><strong>This Week:</strong> {stats.weekly}</p>
            <p><strong>This Month:</strong> {stats.monthly}</p>
          </div>

          <div
            style={{
              flex: '1',
              minWidth: '300px',
              background: '#fff',
              borderRadius: '8px',
              padding: '10px',
            }}
          >
            <h3 style={{ textAlign: 'center' }}>Mechanic Service Stats</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h2 style={{ textAlign: 'center' }}>Mechanic Requests' Details</h2>

          {requests
            .filter((req) => req.service === 'Mechanic Help')
            .map((req) => (
              <div
                key={req.id}
                style={{
                  background: '#f9f9f9',
                  padding: '10px',
                  borderRadius: '8px',
                  marginBottom: '10px',
                }}
              >
                <h4>{req.name}</h4>
                <p><strong>Phone:</strong> {req.mobile}</p>
                <p><strong>Issue:</strong> {req.issue}</p>
                <p><strong>Location:</strong> {req.location}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span
                    style={{
                      color:
                        req.status === 'Accepted'
                          ? 'green'
                          : req.status === 'Rejected'
                          ? 'red'
                          : 'orange',
                    }}
                  >
                    {req.status}
                  </span>
                </p>

                {req.status === 'Accepted' && (
                  <>
                    <p><strong>ETA:</strong> {req.eta} Minutes</p>
                    <p>
                      <strong>Delivery Location:</strong> Lat:{' '}
                      {req.deliveryLocation.lat}, Lng:{' '}
                      {req.deliveryLocation.lng}
                    </p>
                  </>
                )}

                {req.status === 'Pending' && (
                  <>
                    <button
                      style={{
                        backgroundColor: '#2bb449ff',
                        color: '#fff',
                        padding: '8px 16px',
                        marginRight: '10px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleAccept(req.id)}
                    >
                      Accept
                    </button>
                    <button
                      style={{
                        backgroundColor: '#dc3545',
                        color: '#fff',
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleReject(req.id)}
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default MechanicOwnerDashboard;

