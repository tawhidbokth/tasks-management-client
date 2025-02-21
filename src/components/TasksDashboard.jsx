import React, { useState } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';

const categories = ['To-Do', 'In Progress', 'Done'];

const TasksDashboard = () => {
  const [tasks, setTasks] = useState({
    'To-Do': [],
    'In Progress': [],
    Done: [],
  });

  const handleAddTask = category => {
    const newTask = {
      id: `${category}-${Date.now()}`,
      title: 'New Task',
      description: '',
      category,
    };
    setTasks(prevTasks => ({
      ...prevTasks,
      [category]: [...prevTasks[category], newTask],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto flex gap-8">
        <DndContext>
          {categories.map(category => (
            <TaskList
              key={category}
              category={category}
              tasks={tasks[category]}
              setTasks={setTasks}
              handleAddTask={handleAddTask}
            />
          ))}
        </DndContext>
      </div>
    </div>
  );
};

const TaskList = ({ category, tasks, setTasks, handleAddTask }) => {
  const { setNodeRef } = useDroppable({ id: category });

  return (
    <div className="w-1/3 bg-white rounded-lg shadow-lg p-4" ref={setNodeRef}>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">{category}</h2>
      <button
        onClick={() => handleAddTask(category)}
        className="w-full py-2 bg-blue-600 text-white rounded-md mb-4 hover:bg-blue-700"
      >
        Add Task
      </button>
      <div>
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            setTasks={setTasks}
            category={category}
          />
        ))}
      </div>
    </div>
  );
};

const TaskCard = ({ task }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: task.id });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 cursor-pointer hover:bg-gray-200"
    >
      <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
      <p className="text-gray-600 text-sm">
        {task.description || 'No description'}
      </p>
    </div>
  );
};

export default TasksDashboard;
