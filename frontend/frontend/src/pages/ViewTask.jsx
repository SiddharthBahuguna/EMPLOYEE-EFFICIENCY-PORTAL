import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';

const ViewTask = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [editTaskId, setEditTaskId] = useState(null);
  const [updatedTask, setUpdatedTask] = useState({});

  useEffect(() => {
    const fetchTasks = async () => {
      const employeeId = localStorage.getItem('employeeId');

      if (!employeeId) {
        setError('Employee ID not found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/my-tasks`, {
          headers: { 'Employee-ID': employeeId },
        });

        if (response.status === 200) {
          setTasks(response.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        console.error('Failed to fetch tasks', err);
        setError('Failed to fetch tasks. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleStatusChange = (status) => {
    setUpdatedTask({
      ...updatedTask,
      status,
    });
  };

  const handleActualDocChange = (taskId) => {
    setEditTaskId(taskId);
    const task = tasks.find(task => task._id === taskId);
    setUpdatedTask({
      actualDoc: task.reportSubmission,
      status: task.progress,
    });
  };

  const handleSave = async (taskId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/task/${taskId}`, {
        reportSubmission: updatedTask.actualDoc,
        progress: updatedTask.status,
      });

      if (response.status === 200) {
        setTasks(tasks.map(task =>
          task._id === taskId ? { ...task, reportSubmission: updatedTask.actualDoc, progress: updatedTask.status } : task
        ));
        setEditTaskId(null);
      } else {
        throw new Error('Failed to update task');
      }
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task');
    }
  };

  const renderStars = (rating) => {
    if (rating === undefined || rating === null) return 'N/A';
    const stars = Array.from({ length: 5 }, (_, i) => i + 1);
    return (
      <div style={styles.starRating}>
        {stars.map((star) => (
          <span
            key={star}
            style={{
              cursor: 'default',
              color: star <= rating ? '#ffc107' : '#e4e5e9',
              fontSize: '20px',
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>My Tasks</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.header}>S.No</th>
            <th style={styles.header}>Task Name</th>
            <th style={styles.header}>Assigned Date</th>
            <th style={styles.header}>Projected Submission</th>
            <th style={styles.header}>Actual Doc</th>
            <th style={styles.header}>Status</th>
            <th style={styles.header}>Rating</th> {/* Added Rating Header */}
            <th style={styles.header}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={task._id}>
              <td style={styles.cell}>{index + 1}</td>
              <td style={styles.cell}>{task.taskName}</td>
              <td style={styles.cell}>{new Date(task.assignedDate).toLocaleDateString('en-GB')}</td>
              <td style={styles.cell}>{new Date(task.projectedSubmission).toLocaleDateString('en-GB')}</td>
              <td style={styles.cell}>
                {editTaskId === task._id ? (
                  <input
                    type="text"
                    name="actualDoc"
                    value={updatedTask.actualDoc || ''}
                    onChange={(e) => setUpdatedTask({ ...updatedTask, actualDoc: e.target.value })}
                    style={styles.input}
                  />
                ) : (
                  task.reportSubmission || 'N/A'
                )}
              </td>
              <td style={styles.cell}>
                {editTaskId === task._id ? (
                  <DropdownButton
                    id="dropdown-basic-button"
                    title={updatedTask.status || 'Select Status'}
                    onSelect={handleStatusChange}
                    variant="secondary"
                  >
                    <Dropdown.Item eventKey="Ongoing">Ongoing</Dropdown.Item>
                    <Dropdown.Item eventKey="Not started">Not started</Dropdown.Item>
                    <Dropdown.Item eventKey="Assigned">Assigned</Dropdown.Item>
                    <Dropdown.Item eventKey="Completed">Completed</Dropdown.Item>
                    <Dropdown.Item eventKey="Onhold">Onhold</Dropdown.Item>
                  </DropdownButton>
                ) : (
                  task.progress
                )}
              </td>
              <td style={styles.cell}>
                {task.progress === 'Completed' ? ( // Conditional rendering based on status
                  renderStars(task.rating)
                ) : (
                  'N/A'
                )}
              </td>
              <td style={styles.cell}>
                {editTaskId === task._id ? (
                  <Button onClick={() => handleSave(task._id)} style={styles.button}>Save</Button>
                ) : (
                  <Button onClick={() => handleActualDocChange(task._id)} style={styles.button}>Edit</Button>
                )}
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
  input: {
    width: '100%',
    padding: '5px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  button: {
    padding: '5px 10px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
  },
  starRating: {
    display: 'flex',
    alignItems: 'center',
  },
};

export default ViewTask;
