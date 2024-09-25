import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css'; // Create this CSS file for styling

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Hardcoded credentials
    const validPassword = 'ProgressTool++!';

    if (password === validPassword) {
      setIsAuthenticated(true);
      // Optionally, store auth state in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      navigate(`/admin/${username}`);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <h2>Admin Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;