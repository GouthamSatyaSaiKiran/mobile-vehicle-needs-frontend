import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/auth/forgot', { email });
      setMessage(response.data || 'Password reset link sent to your email.');
    } catch (err) {
      setError(err.response?.data || 'Failed to send reset link.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', paddingTop: '50px' }}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          <label>Enter your registered email:</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '8px' }}
          />
        </div>
        <br />
        <button type="submit" style={{ width: '100%', padding: '10px' }}>
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
