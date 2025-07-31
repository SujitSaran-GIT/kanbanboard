import TaskModel from "../models/TaskModel.js";

const getTasks = async (req, res) => {
  try {
    const tasks = await TaskModel.find({ userId: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch tasks',
      error: error.message
    });
  }
};

const createTask = async (req, res) => {
  const { title, description } = req.body;
  try {
    const newTask = new TaskModel({ 
      title, 
      description,
      userId: req.user.id // Using Guardian's user ID
    });
    
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to create task',
      error: error.message
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
    res.status(500).json({ 
      message: 'Failed to update task',
      error: error.message
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const deletedTask = await TaskModel.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to delete task',
      error: error.message
    });
  }
};

export { getTasks, createTask, updateTask, deleteTask };