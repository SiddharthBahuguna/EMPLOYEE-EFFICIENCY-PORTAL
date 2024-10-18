import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListCheck } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const RegisteredUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        // Filter out users who are Reporting Officers
        const filteredUsers = response.data.filter(user => user.position !== 'Reporting Officer');
        setUsers(filteredUsers);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleTaskListClick = (userId) => {
    navigate(`/tasklist?userId=${userId}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Registered Users</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.header}>S.No</th>
            <th style={styles.header}>Name</th>
            <th style={styles.header}>Email</th>
            <th style={styles.header}>Phone</th>
            <th style={styles.header}>Position</th>
            <th style={styles.header}>No. of Tasks Assigned</th>
            <th style={styles.header}>List of Tasks</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td style={styles.cell}>{index + 1}</td>
              <td style={styles.cell}>{user.name}</td>
              <td style={styles.cell}>{user.email}</td>
              <td style={styles.cell}>{user.phone}</td>
              <td style={styles.cell}>{user.position}</td>
              <td style={styles.cell}>{user.taskCount}</td>
              <td style={styles.cell}>
                <FontAwesomeIcon
                  icon={faListCheck}
                  style={{ cursor: 'pointer', color: '#007bff' }}
                  onClick={() => handleTaskListClick(user._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1000px',
    margin: 'auto',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  header: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px',
    textAlign: 'left',
  },
  cell: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
};

export default RegisteredUsers;
