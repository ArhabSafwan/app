'use client'; // 1. TURN INTO CLIENT COMPONENT
/**
 * In Next.js, 'use client' is like adding an 'EventListener' in vanilla JS.
 * By default, pages are static HTML (Server Components). 
 * Adding this allows us to use Hooks like 'useState' and handle clicks.
 */

import React, { useState } from 'react';

export default function KanbanPage() {
  /**
   * 2. REACT STATE (Laravel Analogy: Session or a Collection in Memory)
   * 
   * In Laravel, to keep data between clicks, you'd save it to a Database or Session.
   * In Next.js, 'useState' creates a variable that React "watches".
   * If you update 'tasks', React automatically re-renders the HTML.
   */
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Learn Next.js Routing', status: 'Todo' },
    { id: 2, title: 'Setup Kanban Board', status: 'In Progress' },
    { id: 3, title: 'Understand Server Components', status: 'Todo' },
    { id: 4, title: 'Master JSX Basics', status: 'Done' },
    { id: 5, title: 'Object Destructuring', status: 'In Progress' },
  ]);

  const columns = ['Todo', 'In Progress', 'Done'];

  /**
   * 3. UPDATE TASK STATUS (Laravel Analogy: $collection->map())
   * 
   * We use the Spread Operator (...) to copy the task and change only the status.
   */
  const markAsDone = (taskId: number) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        // Return a copy of the task with status changed to 'Done'
        return { ...task, status: 'Done' };
      }
      return task; // Leave other tasks alone
    });
    setTasks(updatedTasks);
  };

  /**
   * 4. DELETE TASK (Laravel Analogy: $collection->reject() or forget())
   * 
   * We use .filter() to create a new array WITHOUT the deleted task.
   */
  const deleteTask = (taskId: number) => {
    const filteredTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(filteredTasks);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen bg-gray-50">
      <h1 className="text-4xl font-extrabold mb-10 text-gray-900 tracking-tight">
        Vibe Kanban <span className="text-blue-600">Board</span>
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {columns.map((column) => (
          <div key={column} className="bg-gray-200/50 p-5 rounded-2xl border border-gray-200 shadow-sm min-h-[600px]">
            <h2 className="text-lg font-bold mb-6 text-gray-600 uppercase flex items-center justify-between">
              {column}
              <span className="bg-gray-300 text-gray-700 text-xs px-2 py-1 rounded-full">
                {tasks.filter(t => t.status === column).length}
              </span>
            </h2>
            
            <div className="flex flex-col gap-4">
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
                      {/* CHECKMARK BUTTON */}
                      {column !== 'Done' && (
                        <button 
                          onClick={() => markAsDone(id)}
                          className="flex-1 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white border border-green-200 py-1.5 rounded-lg text-sm font-bold transition-colors flex items-center justify-center"
                          title="Mark as Done"
                        >
                          ✓ Done
                        </button>
                      )}

                      {/* DELETE BUTTON */}
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
