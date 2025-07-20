import React from 'react';
import { motion } from 'framer-motion';
import KanbanCard from './KanbanCard';

const palette = ['#F75A5A', '#FFA955', '#FFD63A', '#6DE1D2'];

const KanbanColumn = ({ column, tasks = [], onTaskDrop, onCardDragStart, onDeleteTask }) => {
  // Allow drop
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onTaskDrop(taskId, column.id);
    }
  };

  return (
    <motion.div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: 'spring' }}
      className="flex-1 flex flex-col gap-4 bg-black/50 backdrop-blur-lg rounded-2xl shadow-xl border border-white/10 p-4 min-w-[300px]"
      style={{
        background: 'rgba(0,0,0,0.6)',
        boxShadow: '0 4px 24px 0 rgba(0,0,0,0.7)',
      }}
    >
      <h2 className="text-xl font-bold text-white mb-2 drop-shadow">{column.title || column.label}</h2>
      {tasks.length === 0 ? (
        <div className="text-white/60 text-center">No tasks</div>
      ) : (
        tasks.map((task) => (
          <KanbanCard key={task._id} task={task} onDragStart={onCardDragStart} onDelete={onDeleteTask}/>
        ))
      )}
    </motion.div>
  );
};

export default KanbanColumn;