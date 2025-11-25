// 🧩 Task 1: Import urlConfig from `giftlink-frontend/src/config.js`
import { urlConfig } from '../../config';

// 🧩 Task 2: Import useAppContext from `giftlink-frontend/context/AuthContext.js`
import { useAppContext } from '../../context/AuthContext';

// 🧩 Task 3: Import useNavigate from `react-router-dom`
import { useNavigate } from 'react-router-dom';

import React, { useState, useEffect } from 'react';

function LoginPage() {
  // Define states for email and password inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 🧩 Task 4: Include a state for incorrect password (error message)
  const [incorrect, setIncorrect] = useState('');

  // 🧩 Task 5: Create local variables for navigate, bearerToken, and setIsLoggedIn
  const navigate = useNavigate();
  const bearerToken = sessionStorage.getItem('bearer-token');
  const { setIsLoggedIn } = useAppContext();

  // 🧩 Task 6: If bearerToken has a value (user already logged in), navigate to MainPage
  useEffect(() => {
    if (sessionStorage.getItem('auth-token')) {
      navigate('/app');
    }
  }, [navigate]);

  // =====================
  // handleLogin() function
  // =====================
  const handleLogin = async () => {
    try {
      const res = await fetch(`${urlConfig.baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': bearerToken ? `Bearer ${bearerToken}` : '',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      // 🧩 Task 1: Access data coming from fetch API
      const json = await res.json();

      // 🧩 Task 5: If password incorrect or user not found
      if (!json.authtoken) {
        // Clear input fields
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        // Show error message
        setIncorrect('Wrong password. Try again.');

        // Optional: clear error after 2 seconds
        setTimeout(() => setIncorrect(''), 2000);
        return;
      }

      // 🧩 Task 2: Set user details in sessionStorage
      sessionStorage.setItem('auth-token', json.authtoken);
      sessionStorage.setItem('name', json.userName);
      sessionStorage.setItem('email', json.userEmail);

      // 🧩 Task 3: Set the user's state to logged in
      setIsLoggedIn(true);

      // 🧩 Task 4: Navigate to MainPage after successful login
      navigate('/app');
    } catch (e) {
      console.log('Error fetching details: ' + e.message);
      setIncorrect('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>

      <input
        id="email"
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        id="password"
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* 🧩 Task 6: Display an error message to the user */}
      <span
        style={{
          color: 'red',
          height: '.5cm',
          display: 'block',
          fontStyle: 'italic',
          fontSize: '12px',
        }}
      >
        {incorrect}
      </span>

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LoginPage;