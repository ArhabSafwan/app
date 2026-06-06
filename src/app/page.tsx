import React from 'react';

/**
 * 1. HARDCODED DATA
 * In Laravel, you might pass this from a Controller to a Blade view:
 * return view('kanban', ['tasks' => $tasks]);
 * 
 * In Next.js Server Components, you can define data directly or fetch it.
 */
const tasks = [
  { id: 1, title: 'Learn Next.js Routing', status: 'Todo' },
  { id: 2, title: 'Setup Kanban Board', status: 'In Progress' },
  { id: 3, title: 'Understand Server Components', status: 'Todo' },
  { id: 4, title: 'Master JSX Basics', status: 'Done' },
  { id: 5, title: 'Object Destructuring', status: 'In Progress' },
];

/**
 * 2. THE PAGE COMPONENT
 * This is a "Server Component" by default in the 'app' directory.
 * Think of it as a Controller and a Blade template merged into one file.
 */
export default function KanbanPage() {
  const columns = ['Todo', 'In Progress', 'Done'];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">My Kanban Board</h1>

      {/* 3. GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* 
          4. THE .map() LOOP (The Laravel @foreach Analogy)
          
          Laravel: @foreach($columns as $column) ... @endforeach
          Next.js: {columns.map((column) => ( ... ))}
          
          Note: We use 'key' so React can track elements (important for performance).
        */}
        {columns.map((column) => (
          <div key={column} className="bg-gray-100 p-4 rounded-xl shadow-inner min-h-[500px]">
            <h2 className="text-xl font-bold mb-6 text-gray-700 uppercase tracking-wide border-b-2 border-gray-200 pb-2">
              {column}
            </h2>

            <div className="flex flex-col gap-4">
              {/* 
                5. FILTERING & MAPPING TASKS
                
                Laravel: @foreach($tasks->where('status', $column) as $task)
                Next.js: {tasks.filter(t => t.status === column).map(task => ...)}
              */}
              {tasks
                .filter((task) => task.status === column)
                .map(({ id, title }) => {
                  /**
                   * 6. OBJECT DESTRUCTURING
                   * Instead of writing 'task.id' and 'task.title', we 'destructure' them
                   * directly in the function arguments: ({ id, title }).
                   * 
                   * Laravel equivalent: It's like extracting variables from an array.
                   */
                  return (
                    <div
                      key={id}
                      className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                    >
                      <p className="text-gray-700 font-medium group-hover:text-blue-600">
                        {title}
                      </p>
                      <div className="mt-2 text-xs text-gray-400">
                        Task #{id}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
