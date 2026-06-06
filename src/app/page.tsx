'use client'; 
/**
 * 1. 'use client' (Laravel Analogy: Client-side Script)
 * In Next.js, files are "Server Components" by default (like a Blade template).
 * Adding 'use client' tells Next.js this file needs JavaScript to run in the browser
 * for things like button clicks, input typing, and "State" management.
 */

import React, { useState, useEffect } from 'react';

// The URL to your Laravel API. 
const API_BASE_URL = 'http://localhost:8000/api';

/**
 * 2. INTERFACE (Laravel Analogy: Type Hinting / DTO)
 * Since we are using TypeScript, we define what a "Task" object looks like.
 * This is similar to how you'd use PHP type hinting in a Controller.
 */
interface Task {
  id: number;
  title: string;
  status: 'Todo' | 'In Progress' | 'Done';
}

export default function KanbanPage() {
  /**
   * 3. STATE - useState (Laravel Analogy: Reactive Variables / Session-lite)
   * In jQuery, you'd find an element and change its text manually: $('#task').text('Done').
   * In React, you update the "State" (tasks), and React automatically re-renders the HTML
   * for you. No manual DOM manipulation needed!
   */
  const [tasks, setTasks] = useState<Task[]>([]); // Current tasks list
  const [newTaskTitle, setNewTaskTitle] = useState(''); // Text in the "Add Task" input
  
  // Columns for our board
  const columns: Task['status'][] = ['Todo', 'In Progress', 'Done'];

  /**
   * 4. EFFECT - useEffect (Laravel Analogy: $(document).ready())
   * This runs automatically when the page first loads in the browser.
   * We use it to trigger our initial data fetch.
   */
  useEffect(() => {
    fetchTasks();
  }, []); // The empty array [] means "run only once on load"

  /**
   * 5. FETCHING DATA (Laravel Analogy: $.ajax or axios.get)
   * This calls your Laravel TaskController@index.
   */
  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      const data = await response.json();
      setTasks(data); // Updating state triggers an automatic UI refresh
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  /**
   * 6. CREATING DATA (Laravel Analogy: Form POST request)
   * Triggered by the form's onSubmit event.
   */
  const createTask = async (e: React.FormEvent) => {
    e.preventDefault(); // Stop the page from refreshing (Standard AJAX behavior)
    if (!newTaskTitle.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTaskTitle, status: 'Todo' }),
      });
      
      if (response.ok) {
        setNewTaskTitle(''); // Clear the input field
        fetchTasks(); // Refresh the list from the database
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  /**
   * 7. UPDATING DATA (Laravel Analogy: TaskController@update)
   * Uses the PUT method to change the task's status in MySQL.
   */
  const updateTaskStatus = async (taskId: number, newStatus: Task['status']) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        fetchTasks(); // Refresh UI to show the task in the new column
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  /**
   * 8. DELETING DATA (Laravel Analogy: TaskController@destroy)
   */
  const deleteTask = async (taskId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  /**
   * 9. THE UI (Laravel Analogy: Blade Template + Loops)
   * Instead of @foreach($tasks as $task), we use tasks.map().
   * Tailwind CSS classes are used for styling (utility-first, similar to Bootstrap but more flexible).
   */
  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen bg-gray-50">
      <h1 className="text-4xl font-extrabold mb-6 text-gray-900 tracking-tight">
        Vibe Kanban <span className="text-blue-600">Board</span>
      </h1>

      {/* INPUT FORM: Equivalent to a standard HTML form but handled by createTask function */}
      <form onSubmit={createTask} className="mb-10 flex gap-2">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)} // Update state as you type
          placeholder="What needs to be done?"
          className="flex-1 p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md"
        >
          Add Task
        </button>
      </form>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* LOOP THROUGH COLUMNS */}
        {columns.map((column) => (
          <div key={column} className="bg-gray-200/50 p-5 rounded-2xl border border-gray-200 shadow-sm min-h-[600px]">
            <h2 className="text-lg font-bold mb-6 text-gray-600 uppercase flex items-center justify-between">
              {column}
              <span className="bg-gray-300 text-gray-700 text-xs px-2 py-1 rounded-full">
                {/* FILTER: Similar to Laravel's $collection->filter() */}
                {tasks.filter(t => t.status === column).length}
              </span>
            </h2>
            
            <div className="flex flex-col gap-4">
              {/* LOOP THROUGH TASKS FOR THIS COLUMN */}
              {tasks
                .filter((task) => task.status === column)
                .map(({ id, title }) => (
                  <div 
                    key={id} 
                    className="bg-white p-5 rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-all group relative"
                  >
                    <p className="text-gray-800 font-semibold mb-4 leading-snug">
                      {title}
                    </p>
                    
                    <div className="flex gap-2">
                      {/* LOGIC: Show different buttons based on current column */}
                      {column === 'Todo' && (
                        <button 
                          onClick={() => updateTaskStatus(id, 'In Progress')}
                          className="flex-1 bg-yellow-50 text-yellow-600 hover:bg-yellow-600 hover:text-white border border-yellow-200 py-1.5 rounded-lg text-sm font-bold transition-colors flex items-center justify-center"
                        >
                          Start
                        </button>
                      )}
                      
                      {column === 'In Progress' && (
                        <button 
                          onClick={() => updateTaskStatus(id, 'Done')}
                          className="flex-1 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white border border-green-200 py-1.5 rounded-lg text-sm font-bold transition-colors flex items-center justify-center"
                        >
                          Finish
                        </button>
                      )}

                      <button 
                        onClick={() => deleteTask(id)}
                        className="p-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 rounded-lg transition-all"
                        title="Delete Task"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    {/* KEY CONCEPT: React handles the 'group-hover' via CSS, no jQuery hover() needed */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-gray-300">
                      ID: {id}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
