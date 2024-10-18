import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Employee = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state || {};
  const [tasks, setTasks] = useState([]);
  const [selectedProgress, setSelectedProgress] = useState('');
  const [reportFrequency, setReportFrequency] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tasks/${userId}`);
        setTasks(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch tasks');
        setLoading(false);
      }
    };

    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  const handleProgressSubmit = async (taskId) => {
    try {
      // Update the progress of the task in the backend
      await axios.post('http://localhost:5000/api/tasks/update-progress', {
        taskId,
        progress: selectedProgress,
        reportFrequency,
      });

      // Directly navigate to RegisteredUsers page
      navigate('/registeredusers');
    } catch (err) {
      console.error('Failed to update progress', err);
    }
  };

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div style={styles.container}>
        <h2>Employee Tasks</h2>
        {tasks.length > 0 ? (
          <ul style={styles.taskList}>
            {tasks.map(task => (
              <li key={task._id} style={styles.taskItem}>
                <strong>Task Name:</strong> {task.taskName}<br />
                
                <div className="form-group">
                  <label><strong>Progress:</strong></label>
                  <div>
                    <label>
                      <input
                        type="radio"
                        name={`progress-${task._id}`}
                        value="Recently Started"
                        checked={selectedProgress === 'Recently Started'}
                        onChange={(e) => setSelectedProgress(e.target.value)}
                      />
                      Recently Started
                    </label>
                    <label style={{ marginLeft: '10px' }}>
                      <input
                        type="radio"
                        name={`progress-${task._id}`}
                        value="Ongoing"
                        checked={selectedProgress === 'Ongoing'}
                        onChange={(e) => setSelectedProgress(e.target.value)}
                      />
                      Ongoing
                    </label>
                    <label style={{ marginLeft: '10px' }}>
                      <input
                        type="radio"
                        name={`progress-${task._id}`}
                        value="On Hold"
                        checked={selectedProgress === 'On Hold'}
                        onChange={(e) => setSelectedProgress(e.target.value)}
                      />
                      On Hold
                    </label>
                    <label style={{ marginLeft: '10px' }}>
                      <input
                        type="radio"
                        name={`progress-${task._id}`}
                        value="Completed"
                        checked={selectedProgress === 'Completed'}
                        onChange={(e) => setSelectedProgress(e.target.value)}
                      />
                      Completed
                    </label>
                  </div>
                </div>

                <div className="form-group mt-3">
                  <label><strong>Report Submission:</strong></label>
                  <div>
                    <label>
                      <input
                        type="radio"
                        name={`frequency-${task._id}`}
                        value="Weekly"
                        checked={reportFrequency === 'Weekly'}
                        onChange={(e) => setReportFrequency(e.target.value)}
                      />
                      Weekly
                    </label>
                    <label style={{ marginLeft: '10px' }}>
                      <input
                        type="radio"
                        name={`frequency-${task._id}`}
                        value="Monthly"
                        checked={reportFrequency === 'Monthly'}
                        onChange={(e) => setReportFrequency(e.target.value)}
                      />
                      Monthly
                    </label>
                  </div>
                </div>

                <button onClick={() => handleProgressSubmit(task._id)} style={{ marginTop: '10px' }}>
                  Submit Progress
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tasks assigned to this employee.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: 'auto',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginTop: '20px',
  },
  taskList: {
    listStyleType: 'none',
    padding: 0,
  },
  taskItem: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
    marginBottom: '10px',
  },
};

export default Employee;
