import React, { useRef, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableTask from './DraggableTask';

const ToDoList = () => {
  const taskDescriptionRef = useRef(null);
  const categoryInputRef = useRef(null);
  const modalCategoryInputRef = useRef(null); 
  const taskDateRef = useRef(null);
  const taskPriorityRef = useRef(null);
  const tasksRef = useRef([]);
  const [categories, setCategories] = useState(['Default']);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [, forceUpdate] = useState();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    
    const taskDescription = taskDescriptionRef.current.value;
    const category = categoryInputRef.current.value;
    let date = taskDateRef.current.value;
    const priority = taskPriorityRef.current.value;

    
    if (!date) {
      const currentDate = new Date();
      date = `${currentDate.getFullYear()}-${('0' + (currentDate.getMonth() + 1)).slice(-2)}-${('0' + currentDate.getDate()).slice(-2)}`;
    }

    
    if (!taskDescription || !category || !priority) {
      alert('Please enter Task Description, Category, and Priority.');
      return;
    }

    
    const newTask = {
      description: taskDescription,
      category: category,
      date: new Date(date), 
      priority: priority,
    };

    
    tasksRef.current = [...tasksRef.current, newTask];

    
    tasksRef.current.sort((a, b) => {
      
      const dateComparison = a.date - b.date;
      if (dateComparison !== 0) {
        return dateComparison;
      }

      
      const priorityOrder = {
        'Low': 0,
        'Medium': 1,
        'High': 2,
      };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    
    taskDescriptionRef.current.value = '';
    categoryInputRef.current.value = '';
    taskDateRef.current.value = '';
    taskPriorityRef.current.value = '';

    
    forceUpdate(Math.random());
  };

  const handleAddCategory = () => {
    const newCategory = modalCategoryInputRef.current.value.trim(); // Use modalCategoryInputRef here
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      modalCategoryInputRef.current.value = ''; // Clear modal category input
    }
  };

  const handleDeleteCategory = (categoryToDelete) => {
    const updatedCategories = categories.filter((category) => category !== categoryToDelete);
    setCategories(updatedCategories);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const moveTask = (fromIndex, toIndex) => {
    const updatedTasks = [...tasksRef.current];
    const [movedTask] = updatedTasks.splice(fromIndex, 1);
    updatedTasks.splice(toIndex, 0, movedTask);
    tasksRef.current = updatedTasks;
    forceUpdate(Math.random());
  };

  
  const filteredTasks = tasksRef.current.filter((task) =>
    task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <h1>To-Do List</h1>
        <form onSubmit={handleFormSubmit}>
          <div>
            <label>
              Task Description:
              <input
                type="text"
                ref={taskDescriptionRef}
              />
            </label>
          </div>
          <div>
            <label>
              Category:
              <select ref={categoryInputRef}>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <label>
              Deadline:
              <input
                type="date"
                ref={taskDateRef}
              />
            </label>
          </div>
          <div>
            <label>
              Priority:
              <select ref={taskPriorityRef}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </label>
          </div>
          <button type="submit">Add Task</button>
        </form>

        
        <button onClick={toggleModal}>Manage Categories</button>

        
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Manage Categories</h2>
              
              <div>
                <label>
                  Add New Category:
                  <input type="text" ref={modalCategoryInputRef} /> 
                  <button onClick={handleAddCategory}>Add</button>
                </label>
              </div>

              
              <div>
                <h3>Categories</h3>
                <ul>
                  {categories.map((category, index) => (
                    <li key={index}>
                      {category}
                      <button onClick={() => handleDeleteCategory(category)}>Delete</button>
                    </li>
                  ))}
                </ul>
              </div>

              
              <button onClick={toggleModal}>Close</button>
            </div>
          </div>
        )}

        
        <div>
          <input
            type="text"
            placeholder="Search by description or category..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        
        <div>
          <h2>Tasks</h2>
          <ul>
            {filteredTasks.map((task, index) => (
              <DraggableTask key={index} index={index} task={task} moveTask={moveTask} />
            ))}
          </ul>
        </div>
      </div>
    </DndProvider>
  );
};

export default ToDoList;
