const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const uri = 'mongodb://127.0.0.1:27017/user'; // Ensure MongoDB is running and accessible
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// Define User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  position: { type: String, required: true },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

// Define Task Schema
const taskSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taskName: { type: String, required: true },
  assignedDate: { type: Date, required: true },
  projectedSubmission: { type: Date, required: true },
  actualSubmission: { type: Date },
  progress: { type: String, default: 'Not started' },
  reportSubmission: { type: String, default: 'Not submitted' },
  review: { type: String, default: 'Pending' },
  rating: { type: Number, default: 0 },
}, {
  timestamps: true,
});

const Task = mongoose.model('Task', taskSchema);

// Registration endpoint
app.post("/api/register", async (req, res) => {
  const { name, email, password, phone, position } = req.body;

  // Basic validation
  if (!name || !email || !password || !phone || !position) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return res.status(400).json({ message: "Name must contain only alphabets and spaces" });
  }
  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  if (password.length < 8 || !/[!@#$%^&*]/.test(password)) {
    return res.status(400).json({ message: "Password must be at least 8 characters and include a special symbol" });
  }
  if (position !== "Reporting Officer" && position !== "Employee") {
    return res.status(400).json({ message: "Position must be either Reporting Officer or Employee" });
  }

  // Check if user already exists
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password and save user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, phone, position });
    await newUser.save();
    return res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Login endpoint
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Successful login
    res.status(200).json({ success: true, message: "Login successful", employeeId: user._id , position: user.position});
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Assign Task endpoint
app.post("/api/give-task", async (req, res) => {
  const { employeeId, taskName, assignedDate, projectedSubmissionDate } = req.body;

  // Basic validation
  if (!employeeId || !taskName || !assignedDate || !projectedSubmissionDate) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if employee exists
    const employee = await User.findById(employeeId);
    if (!employee) {
      return res.status(400).json({ message: "Employee does not exist" });
    }

    const newTask = new Task({
      employeeId,
      taskName,
      assignedDate,
      projectedSubmission: new Date(projectedSubmissionDate), // Save projected submission date
    });

    await newTask.save();
    return res.status(200).json({ message: "Task assigned successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to assign task", error: err.message });
  }
});

// Fetch all users with task count
app.get("/api/users", async (req, res) => {
  try {
    // Aggregate user data with task count
    const users = await User.aggregate([
      {
        $lookup: {
          from: "tasks",  // Collection name in MongoDB
          localField: "_id",
          foreignField: "employeeId",
          as: "tasks"
        }
      },
      {
        $addFields: {
          taskCount: { $size: "$tasks" }
        }
      },
      {
        $project: {
          tasks: 0 // Optionally exclude tasks field
        }
      }
    ]);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
});

// Fetch all tasks for a specific employee
app.get("/api/tasks/:employeeId", async (req, res) => {
  const { employeeId } = req.params;

  try {
    const tasks = await Task.find({ employeeId }).populate('employeeId', 'name');
    if (!tasks) {
      return res.status(404).json({ message: "No tasks found for this employee" });
    }
    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err); // Log the error
    res.status(500).json({ message: "Failed to fetch tasks", error: err.message });
  }
});

// Fetch task details for review and progress
app.get("/api/task/:taskId", async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId).populate('employeeId', 'name');
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch task details", error: err.message });
  }
});

// Update task progress, review, and submission date
app.put("/api/task/:taskId", async (req, res) => {
  const { taskId } = req.params;
  const { progress, reportSubmission, review, rating, actualSubmission } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(taskId, {
      progress,
      reportSubmission,
      review,
      rating,
      actualSubmission: actualSubmission ? new Date(actualSubmission) : null, // Handle actual submission date
    }, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task updated successfully", task: updatedTask });
  } catch (err) {
    res.status(500).json({ message: "Failed to update task", error: err.message });
  }
});

// Fetch all tasks assigned to the logged-in employee
app.get("/api/my-tasks", async (req, res) => {
  // Assuming you have middleware that sets req.employeeId from the session or token
  const employeeId = req.headers['employee-id'];

  if (!employeeId) {
    return res.status(400).json({ message: "Employee ID is required" });
  }

  try {
    const tasks = await Task.find({ employeeId }).populate('employeeId', 'name');
    if (!tasks) {
      return res.status(404).json({ message: "No tasks found for this employee" });
    }
    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error fetching tasks for logged-in employee:", err); // Log the error
    res.status(500).json({ message: "Failed to fetch tasks", error: err.message });
  }
});

// Server start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

