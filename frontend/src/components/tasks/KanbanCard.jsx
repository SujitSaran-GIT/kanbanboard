import React from 'react';
import { motion } from 'framer-motion';

const KanbanCard = ({ task, onDragStart, onDelete }) => (
  <motion.div
    draggable
    onDragStart={e => onDragStart(e, task._id)}
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 #F75A5A55' }}
    transition={{ duration: 0.4, type: 'spring' }}
    className="bg-black/60 backdrop-blur-lg rounded-xl shadow-lg border border-white/10 p-4 mb-2 cursor-pointer transition-all"
    style={{
      background: 'rgba(0,0,0,0.7)',
      boxShadow: '0 2px 12px 0 rgba(0,0,0,0.7)',
    }}
  >
    <button 
      onClick={(e) => {
        e.stopPropagation();
        onDelete(task._id);
      }}
      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      aria-label="Delete task"
    >
      ×
    </button>
    <h3 className="font-semibold text-lg text-[#F75A5A] mb-1 drop-shadow">{task.title}</h3>
    <p className="text-white/90 text-sm mb-2">{task.description}</p>
    <div className="flex justify-between items-center text-xs text-[#6DE1D2]">
      <span>Status: {task.status}</span>
    </div>
  </motion.div>
);

export default KanbanCard;