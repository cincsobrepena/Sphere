import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { FaTrash } from 'react-icons/fa'; 
import { Timestamp } from 'firebase/firestore';

//Manages color for the different priority tasks
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Low':
      return 'lightgreen';
    case 'Medium':
      return 'lightgoldenrodyellow'; 
    case 'High':
      return 'lightcoral';
    default:
      return 'white';
  }
};

// DraggableTask component
const DraggableTask = ({ task, index, moveTask, toggleTaskDone, handleDeleteTask }) => {
  const [, ref] = useDrag({
    type: 'TASK',
    item: { index },
  });

  const [, drop] = useDrop({
    accept: 'TASK',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveTask(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const taskDate = task.date instanceof Timestamp ? task.date.toDate() : new Date(task.date);

  return (
    <li 
      ref={(node) => ref(drop(node))} 
      className="task-item" 
      style={{ 
        textDecoration: task.done ? 'line-through' : 'none', 
        backgroundColor: getPriorityColor(task.priority) 
      }}
    >
      <div className="task-content">
        <input
          type="checkbox"
          checked={task.done}
          onChange={() => toggleTaskDone(task.id)} 
        />
        <span className="task-description">{task.description}</span>
        <span className="task-priority">{task.priority}</span>
        <span className="task-date">{taskDate.toDateString()}</span>
        <span className="task-category">{task.category}</span>
        <button 
          className="delete-task-button" 
          onClick={() => handleDeleteTask(task.id)} // Pass task.id to handleDeleteTask
        >
          <FaTrash />
        </button>
      </div>
    </li>
  );
};

export default DraggableTask;
