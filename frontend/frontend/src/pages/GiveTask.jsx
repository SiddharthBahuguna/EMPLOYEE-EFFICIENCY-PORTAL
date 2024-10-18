import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const GiveTask = () => {
  const [taskName, setTaskName] = useState('');
  const [assignedDate, setAssignedDate] = useState(null);
  const [projectedSubmissionDate, setProjectedSubmissionDate] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [taskAssigned, setTaskAssigned] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        const employeeData = response.data.filter(user => user.position === 'Employee'); // Filter only employees
        setEmployees(employeeData);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  const handleAssignTask = async (e) => {
    e.preventDefault();

    if (!taskName || !assignedDate || !projectedSubmissionDate || !selectedEmployee) {
      setMessage('All fields are required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/give-task', {
        employeeId: selectedEmployee,
        taskName,
        assignedDate: assignedDate.toISOString(),
        projectedSubmissionDate: projectedSubmissionDate.toISOString(),
      });

      if (response.status === 200) {
        setTaskAssigned(true);
        setMessage('Task assigned successfully!');
      }
    } catch (error) {
      console.error('Error assigning task:', error);
      setMessage('Failed to assign task. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Assign Task</h2>
      <form onSubmit={handleAssignTask} className="p-3 border rounded shadow-sm">
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="taskName" className="form-label">Task:</label>
            <input
              type="text"
              id="taskName"
              className="form-control form-control-sm"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="employee" className="form-label">Employee:</label>
            <select
              id="employee"
              className="form-control form-control-sm"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              required
            >
              <option value="">Select an employee</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>{emp.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="assignedDate" className="form-label">Assigned Date:</label>
            <DatePicker
              selected={assignedDate}
              onChange={(date) => setAssignedDate(date)}
              dateFormat="dd/MM/yyyy"
              className="form-control form-control-sm"
              placeholderText="Select date"
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="projectedSubmissionDate" className="form-label">Projected Submission Date:</label>
            <DatePicker
              selected={projectedSubmissionDate}
              onChange={(date) => setProjectedSubmissionDate(date)}
              dateFormat="dd/MM/yyyy"
              className="form-control form-control-sm"
              placeholderText="Select date"
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <button type="submit" className="btn btn-primary btn-sm">Assign Task</button>
          </div>
        </div>
      </form>

      {taskAssigned && (
        <div className="mt-4 text-center">
          <h4>{message}</h4>
        </div>
      )}
    </div>
  );
};

export default GiveTask;
