'use client';

import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8000/api';

interface Task {
  id: number;
  title: string;
  status: 'Todo' | 'In Progress' | 'Done';
}

export default function KanbanPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const columns: Task['status'][] = ['Todo', 'In Progress', 'Done'];

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTaskTitle, status: 'Todo' }),
      });
      if (response.ok) {
        setNewTaskTitle('');
        fetchTasks();
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const updateTaskStatus = async (taskId: number, newStatus: Task['status']) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

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

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen bg-gray-50">
      <h1 className="text-4xl font-extrabold mb-6 text-gray-900 tracking-tight">
        Vibe Kanban <span className="text-blue-600">Board</span>
      </h1>

      <form onSubmit={createTask} className="mb-10 flex gap-2">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
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
