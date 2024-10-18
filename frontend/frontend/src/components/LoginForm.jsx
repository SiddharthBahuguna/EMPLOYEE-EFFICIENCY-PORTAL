import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import backgroundImage from "../components/gg.jpg"; // Correct import of the image

const LoginForm = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setError('All fields are required');
      return;
    }
    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });

      if (response.status === 200) {
        const { employeeId, position } = response.data; // Extract employeeId and position
        localStorage.setItem('userRole', position); // Store the role in localStorage
        localStorage.setItem('employeeId', employeeId); // Store employeeId if needed
        setIsAuthenticated(true);
        navigate('/home');
      } else {
        setError('An error occurred. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  // Inline CSS styles
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundImage: `url(${backgroundImage})`, // Correct usage of imported image
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    margin: 0,
  };

  const cardStyle = {
    maxWidth: '400px',
    width: '100%',
    borderRadius: '0px', // Square corners
  };

  const headerStyle = {
    backgroundColor: '#000000', // Black background color for the header
    color: 'white', // White text color for contrast
    textAlign: 'center', // Center the text
  };

  return (
    <div style={containerStyle}>
      <Card className="shadow-lg" style={cardStyle}>
        <Card.Header className="p-3" style={headerStyle}>
          <h4>Login</h4> {/* Changed heading to 'Login' */}
        </Card.Header>
        <Card.Body>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Button variant="warning" type="submit">
                Login
              </Button>
            </Form.Group>
          </Form>
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LoginForm;
