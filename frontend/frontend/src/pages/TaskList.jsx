import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [updatedTask, setUpdatedTask] = useState({});
  const location = useLocation();
  const userId = new URLSearchParams(location.search).get('userId'); // Extract userId from query params

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tasks/${userId}`);
        setTasks(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to fetch tasks');
        setLoading(false);
      }
    };

    fetchTasks();
  }, [userId]);

  const handleEdit = (taskId) => {
    setEditTaskId(taskId);
    const task = tasks.find(task => task._id === taskId);
    setUpdatedTask({
      actualDoc: task.reportSubmission,
      lastDoc: task.review,
      status: task.progress === 'Not started' ? 'Ongoing' : task.progress,
      rating: task.rating,
    });
  };

  const handleChange = (e) => {
    setUpdatedTask({
      ...updatedTask,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (taskId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/task/${taskId}`, {
        reportSubmission: updatedTask.actualDoc,
        review: updatedTask.lastDoc,
        progress: updatedTask.status,
        rating: updatedTask.rating,
      });

      if (response.status === 200) {
        setTasks(tasks.map(task =>
          task._id === taskId ? { ...task, reportSubmission: updatedTask.actualDoc, review: updatedTask.lastDoc, progress: updatedTask.status, rating: updatedTask.rating } : task
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

  const handleStatusChange = (status) => {
    setUpdatedTask({
      ...updatedTask,
      status,
    });
  };

  const handleRatingChange = (newRating) => {
    setUpdatedTask({
      ...updatedTask,
      rating: newRating,
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Task List</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.header}>S.No</th>
            <th style={styles.header}>Task</th>
            <th style={styles.header}>Assigned Date</th>
            <th style={styles.header}>Projected Submission</th>
            <th style={styles.header}>Actual Doc</th>
            <th style={styles.header}>Status</th>
            <th style={styles.header}>Rating</th>
            <th style={styles.header}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={task._id}>
              <td style={styles.cell}>{index + 1}</td>
              <td style={styles.cell}>{task.taskName}</td>
              <td style={styles.cell}>{new Date(task.assignedDate).toLocaleDateString('en-GB')}</td>
              <td style={styles.cell}>
                {new Date(task.projectedSubmission).toLocaleDateString('en-GB')}
              </td>
              <td style={styles.cell}>
                {editTaskId === task._id ? (
                  <input
                    type="text"
                    name="actualDoc"
                    value={updatedTask.actualDoc || ''}
                    onChange={handleChange}
                    style={styles.input}
                  />
                ) : (
                  task.reportSubmission
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
                {editTaskId === task._id ? (
                  <StarRating
                    currentRating={updatedTask.rating}
                    onRatingChange={handleRatingChange}
                  />
                ) : (
                  <StarRating
                    currentRating={task.rating}
                    editable={false}
                  />
                )}
              </td>
              <td style={styles.cell}>
                {editTaskId === task._id ? (
                  <button onClick={() => handleSave(task._id)} style={styles.button}>Save</button>
                ) : (
                  <button onClick={() => handleEdit(task._id)} style={styles.button}>Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const StarRating = ({ currentRating, onRatingChange, editable = true }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div style={styles.starRating}>
      {stars.map((star) => (
        <span
          key={star}
          style={{
            cursor: editable ? 'pointer' : 'default',
            color: star <= currentRating ? '#ffc107' : '#e4e5e9',
            fontSize: '20px',
          }}
          onClick={() => editable && onRatingChange(star)}
        >
          ★
        </span>
      ))}
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
    display: 'inline-block',
  },
};

export default TaskList;
