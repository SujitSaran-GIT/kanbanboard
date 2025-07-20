import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { DragDropContext } from 'react-beautiful-dnd';
import { createTask, updateTask } from '../../redux/slices/taskSlice';
import KanbanColumn from './KanbanColumn';
import { motion } from 'framer-motion';

const palette = ['#F75A5A', '#FFA955', '#FFD63A', '#6DE1D2'];

const columns = [
  { id: 'To Do', label: 'To Do', color: palette[0] },
  { id: 'In Progress', label: 'In Progress', color: palette[1] },
  { id: 'Done', label: 'Completed', color: palette[2] },
];

const KanbanBoardInner = ({ columns, tasks, onTaskDrop, onCardDragStart, onDeleteTask }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.7, type: 'spring' }}
    className="flex gap-8 p-8 bg-black/60 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/10 mt-24 mx-auto max-w-7xl"
    style={{
      background: 'rgba(0,0,0,0.7)',
      boxShadow: '0 8px 32px 0 rgba(0,0,0,0.5)',
    }}
  >
    {columns.map((col) => (
      <KanbanColumn key={col.id} column={col} tasks={tasks.filter(t => t.status === col.id)} onTaskDrop={onTaskDrop} onCardDragStart={onCardDragStart} onDeleteTask={onDeleteTask}/>
    ))}
  </motion.div>
);

export default function KanbanBoard({ tasks = [], loading }) {
  const dispatch = useDispatch();
  const [newTask, setNewTask] = useState({ title: '', description: '' });

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim() || !newTask.description.trim()) return;
    await dispatch(createTask({ title: newTask.title, description: newTask.description }));
    setNewTask({ title: '', description: '' });
  };

  const moveTask = (id, newStatus) => {
    const task = tasks.find(t => t._id === id);
    if (task && task.status !== newStatus) {
      dispatch(updateTask({ id, status: newStatus, title: task.title, description: task.description }));
    }
  };

  // Set task id in dataTransfer for drag
  const handleCardDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const deleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await dispatch(deleteTask(taskId));
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={addTask} className="flex flex-col md:flex-row gap-2 mb-6">
        <input
          type="text"
          value={newTask.title}
          onChange={e => setNewTask(t => ({ ...t, title: e.target.value }))}
          placeholder="Task title..."
          className="flex-1 px-4 py-2 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#6DE1D2]"
          required
        />
        <input
          type="text"
          value={newTask.description}
          onChange={e => setNewTask(t => ({ ...t, description: e.target.value }))}
          placeholder="Task description..."
          className="flex-1 px-4 py-2 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#6DE1D2]"
          required
        />
        <button type="submit" className="px-6 py-2 rounded-lg font-semibold text-white" style={{background: `linear-gradient(90deg, ${palette[0]}, ${palette[1]})`}} disabled={loading}>
          {loading ? 'Adding...' : 'Add'}
        </button>
      </form>
      <KanbanBoardInner columns={columns} tasks={tasks} onTaskDrop={moveTask} onCardDragStart={handleCardDragStart} onDeleteTask={deleteTask}/>
    </div>
  );
}