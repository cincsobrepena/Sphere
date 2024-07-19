import React, { useRef, useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableTask from './DraggableTask';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import './ToDoList.css';

const ToDoList = () => {
  const taskDescriptionRef = useRef(null);
  const categoryInputRef = useRef(null);
  const modalCategoryInputRef = useRef(null);
  const taskDateRef = useRef(null);
  const taskPriorityRef = useRef(null);
  
  const [categories, setCategories] = useState(['Default']);
  const [showModal, setShowModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter state variables
  const [descriptionFilter, setDescriptionFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [doneFilter, setDoneFilter] = useState('');

  // State for tasks and user
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);

  // Fetch categories and tasks when the user changes
  useEffect(() => {
    if (user) {
      fetchTasks();
      fetchCategories();
    }
  }, [user]);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch categories
  const fetchCategories = async () => {
    if (user) {
      const categoriesCollection = collection(db, 'users', user.uid, 'categories');
      const categorySnapshot = await getDocs(categoriesCollection);
      const categoryList = categorySnapshot.docs.map(doc => doc.data().name);
      setCategories(['Default', ...categoryList]); // Add default category
    }
  };

  // Fetch tasks
  const fetchTasks = async () => {
    if (user) {
      const tasksCollection = collection(db, 'users', user.uid, 'tasks');
      const taskSnapshot = await getDocs(tasksCollection);
      const taskList = taskSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          date: data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date) // Convert to Date object
        };
      }).sort((a, b) => a.order - b.order); // Initial sort by order field

      setTasks(taskList);
    }
  };

  // Add task to Firestore
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (user) {
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
  
      const highestOrder = tasks.length > 0 ? Math.max(...tasks.map(task => task.order)) : 0;
      const newOrder = highestOrder + 1;
  
      const newTask = {
        description: taskDescription,
        category: category,
        date: new Date(date),
        priority: priority,
        done: false,
        order: newOrder,
      };
  
      try {
        const docRef = await addDoc(collection(db, 'users', user.uid, 'tasks'), newTask);
        await updateDoc(docRef, { order: newOrder });
        fetchTasks(); 
      } catch (e) {
        console.error("Error adding document: ", e);
      }
  
      taskDescriptionRef.current.value = '';
      categoryInputRef.current.value = '';
      taskDateRef.current.value = '';
      taskPriorityRef.current.value = '';
  
      setShowAddTaskModal(false);
    }
  };
  
  // Toggle task done status
  const toggleTaskDone = async (taskId) => {
    const task = tasks.find(task => task.id === taskId);
    if (!task) return; 
  
    const taskRef = doc(db, 'users', user.uid, 'tasks', task.id);
  
    try {
      await updateDoc(taskRef, { done: !task.done });
      fetchTasks(); 
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  // Add a new category
  const handleAddCategory = async () => {
    if (user) {
      const newCategory = modalCategoryInputRef.current.value.trim();
      if (newCategory && !categories.includes(newCategory)) {
        try {
          await addDoc(collection(db, 'users', user.uid, 'categories'), { name: newCategory });
          fetchCategories(); 
        } catch (e) {
          console.error("Error adding category: ", e);
        }
      }
      modalCategoryInputRef.current.value = '';
    }
  };
  
  // Delete a category
  const handleDeleteCategory = async (categoryToDelete) => {
    if (user) {
      const confirmDelete = window.confirm(`Are you sure you want to delete the category "${categoryToDelete}"?`);
      if (confirmDelete) {
        try {
          const categoriesCollection = collection(db, 'users', user.uid, 'categories');
          const categorySnapshot = await getDocs(categoriesCollection);
          const categoryDoc = categorySnapshot.docs.find(doc => doc.data().name === categoryToDelete);
          if (categoryDoc) {
            await deleteDoc(doc(db, 'users', user.uid, 'categories', categoryDoc.id));
            fetchCategories(); 
          }
        } catch (e) {
          console.error("Error deleting category: ", e);
        }
      }
    }
  };
  
  // Delete a task
  const handleDeleteTask = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
    if (confirmDelete && user) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'tasks', id));
        fetchTasks(); 
      } catch (e) {
        console.error("Error removing document: ", e);
      }
    }
  };

  // Move task function for drag and drop
  const moveTask = (dragIndex, hoverIndex) => {
    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(dragIndex, 1);
    updatedTasks.splice(hoverIndex, 0, movedTask);
    setTasks(updatedTasks);

    // Update Firestore with new tasks order
    updatedTasks.forEach((task, index) => {
      updateDoc(doc(db, 'users', user.uid, 'tasks', task.id), { order: index });
    });
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        window.location.href = '/login';
      })
      .catch((error) => {
        console.error('Logout Error:', error);
      });
  };

  const handleDescriptionFilterChange = (e) => setDescriptionFilter(e.target.value);
  const handleCategoryFilterChange = (e) => setCategoryFilter(e.target.value);
  const handlePriorityFilterChange = (e) => setPriorityFilter(e.target.value);
  const handleDateFilterChange = (e) => setDateFilter(e.target.value);
  const handleDoneFilterChange = (e) => setDoneFilter(e.target.value);

  const filteredTasks = tasks.filter((task) => {
    
    const descriptionMatch = task.description.toLowerCase().includes(descriptionFilter.toLowerCase());
    const categoryMatch = !categoryFilter || task.category === categoryFilter;
    const priorityMatch = !priorityFilter || task.priority === priorityFilter;
    const dateMatch = !dateFilter || task.date.toISOString().split('T')[0] === dateFilter;
    const doneMatch = !doneFilter || (doneFilter === 'true' ? task.done : !task.done);
    return descriptionMatch && categoryMatch && priorityMatch && dateMatch && doneMatch;
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="todo-container">
        <h1>To-Do List</h1>

        <button onClick={handleLogout} className="logout-button">Logout</button>

        {showAddTaskModal && (
          <div className="modal">
            <div className="modal-content">
              <h2 style={{ textAlign: 'center' }}>Add Task</h2>
              <form onSubmit={handleFormSubmit}>
                <table className="form-table">
                  <tbody>
                    <tr>
                      <td className="form-label">
                        <label htmlFor="taskDescription">Task Description</label>
                      </td>
                      <td className="form-field">
                        <input
                          type="text"
                          id="taskDescription"
                          ref={taskDescriptionRef}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="form-label">
                        <label htmlFor="taskPriority">Priority</label>
                      </td>
                      <td className="form-field">
                        <select id="taskPriority" ref={taskPriorityRef}>
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td className="form-label">
                        <label htmlFor="taskDate">Deadline</label>
                      </td>
                      <td className="form-field">
                        <input
                          type="date"
                          style={{ height: 30 }}
                          id="taskDate"
                          ref={taskDateRef}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="form-label">
                        <label htmlFor="categoryInput">Category</label>
                      </td>
                      <td className="form-field">
                        <select id="categoryInput" ref={categoryInputRef}>
                          {categories.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <button type="submit">Add Task</button>
              </form>
              <button onClick={() => setShowAddTaskModal(false)}>Close</button>
            </div>
          </div>
        )}

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Manage Categories</h2>
              <table className="category-table">
                <tbody>
                  <tr>
                    <td className="form-label">
                      <label htmlFor="modalCategoryInput">Add Category</label>
                    </td>
                    <td className="form-field">
                      <input
                        type="text"
                        id="modalCategoryInput"
                        ref={modalCategoryInputRef}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <button onClick={handleAddCategory}>Add Category</button>
              <h3>Existing Categories</h3>
              <table className="category-list-table">
                <thead>
                  <tr>
                    <th>Category Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, index) => (
                    <tr key={index}>
                      <td>{category}</td>
                      <td>
                        {category !== 'Default' && (
                          <button onClick={() => handleDeleteCategory(category)}>Delete</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        )}

        <h2 style={{ textAlign: 'left', marginLeft: 3 }}>Tasks</h2>
        <div className="filters">
          <table className="filter-table">
            <tbody>
              <tr>
                <td className="filter-labels">
                  <label htmlFor="doneFilter" style={{ marginTop: 3 }}>Status</label>
                </td>
                <td className="filter-labels">
                  <label htmlFor="descriptionFilter" style={{ marginTop: 3 }}>Description</label>
                </td>
                <td className="filter-labels">
                  <label htmlFor="priorityFilter" style={{ marginTop: 3 }}>Priority</label>
                </td>
                <td className="filter-labels">
                  <label htmlFor="dateFilter" style={{ marginTop: 3 }}>Date</label>
                </td>
                <td className="filter-labels" style={{ display: 'flex' }}>
                  <label htmlFor="categoryFilter" style={{ marginTop: 3 }}>Category</label>
                  <button className="manage-categories-button" onClick={() => setShowModal(true)}>+</button>
                </td>
              </tr>
              <tr>
                <td className="filter-fields">
                  <select
                    id="doneFilter"
                    value={doneFilter}
                    onChange={handleDoneFilterChange}
                  >
                    <option value="">All</option>
                    <option value="true">Done</option>
                    <option value="false">Not Done</option>
                  </select>
                </td>
                <td className="filter-fields">
                  <input
                    id="descriptionFilter"
                    type="text"
                    value={descriptionFilter}
                    onChange={handleDescriptionFilterChange}
                  />
                </td>
                <td className="filter-fields">
                  <select
                    id="priorityFilter"
                    value={priorityFilter}
                    onChange={handlePriorityFilterChange}
                  >
                    <option value="">All</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </td>
                <td className="filter-fields">
                  <input
                    id="dateFilter"
                    type="date"
                    value={dateFilter}
                    style={{ height: 30 }}
                    onChange={handleDateFilterChange}
                  />
                </td>
                <td className="filter-fields">
                  <select
                    id="categoryFilter"
                    value={categoryFilter}
                    onChange={handleCategoryFilterChange}
                  >
                    <option value="">All</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>{category}</option>
                    ))}
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <button className="add-task-button" onClick={() => setShowAddTaskModal(true)}>Add Task+</button>
        <div className="task-list">
          {filteredTasks.map((task, index) => (
            <DraggableTask 
              key={task.id} 
              index={index} 
              task={task} 
              moveTask={moveTask} 
              toggleTaskDone={() => toggleTaskDone(task.id)}
              handleDeleteTask={() => handleDeleteTask(task.id)} 
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default ToDoList;