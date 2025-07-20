import TaskModel from "../models/TaskModel.js";


const getTasks = async (req, res) => {
  try {
    // console.log('Authenticated user ID:', req.user?._id);

    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        message: 'Unauthorized - User not authenticated',
        userObject: req.user // For debugging
      });
    }

    const tasks = await TaskModel.find({ userId: req.user._id });
    // console.log('Found tasks:', tasks);

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

const createTask = async (req, res) => {
  const { title, description } = req.body;
  try {
    // Add validation
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized - User not authenticated' });
    }
    
    const newTask = new TaskModel({ 
      title, 
      description,
      userId: req.user.id 
    });
    
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error); // Add detailed logging
    res.status(500).json({ 
      message: 'Failed to create task',
      error: error.message // Include actual error message
    });
  }
};

const updateTask = async (req, res) => {
  const { title, status, description } = req.body;
  try {
    const updatedTask = await TaskModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status, title, description },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const deletedTask = await TaskModel.findByIdAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task' });
  }
};


export { getTasks, createTask, updateTask, deleteTask}