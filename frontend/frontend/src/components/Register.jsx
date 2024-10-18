import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import backgroundImage from "../components/gg.jpg"; // Correct import of the image

// Inline CSS for the component
const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundImage: `url(${backgroundImage})`, // Apply the background image
  backgroundSize: 'cover', // Cover the entire container
  backgroundPosition: 'center', // Center the background image
  backgroundRepeat: 'no-repeat', // Prevent image repetition
};

const cardStyle = {
  maxWidth: '400px', // Reduced width of the card
  width: '100%',
  borderRadius: '0px', // Square corners
};

const headerStyle = {
  backgroundColor: '#000000', // Set background color to black
  color: 'white',
  textAlign: 'center',
};

const inputStyle = {
  maxWidth: '100%', // Reduced width of the form fields
};

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    position: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = (phone) => /^\d{10}$/.test(phone);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword, phone, position } = formData;

    // Validate form fields
    if (!name || !email || !password || !confirmPassword || !phone || !position) {
      setError('All fields are required');
      return;
    }
    if (name.match(/[^a-zA-Z\s]/)) {
      setError('Name can only contain alphabets and spaces');
      return;
    }
    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }
    if (password.length < 8 || !/[!@#$%^&*]/.test(password)) {
      setError('Password must be at least 8 characters and include a special symbol');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!validatePhone(phone)) {
      setError('Phone number must be exactly 10 digits');
      return;
    }
    if (position !== 'Reporting Officer' && position !== 'Employee') {
      setError('Please select a valid position');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/register', formData);

      if (response.status === 200) {
        navigate('/login');
      } else {
        setError('An error occurred. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div style={containerStyle}>
      <Card className="shadow-lg" style={cardStyle}>
        <Card.Header className="p-3" style={headerStyle}>
          <h4>Register</h4>
        </Card.Header>
        <Card.Body>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={inputStyle} // Apply the reduced width style
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={inputStyle} // Apply the reduced width style
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={inputStyle} // Apply the reduced width style
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={inputStyle} // Apply the reduced width style
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={inputStyle} // Apply the reduced width style
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Position</Form.Label>
              <Form.Check
                type="radio"
                label="Reporting Officer"
                name="position"
                value="Reporting Officer"
                onChange={handleChange}
                checked={formData.position === "Reporting Officer"}
              />
              <Form.Check
                type="radio"
                label="Employee"
                name="position"
                value="Employee"
                onChange={handleChange}
                checked={formData.position === "Employee"}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Button variant="warning" type="submit">
                Register
              </Button>
            </Form.Group>
          </Form>
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Register;
