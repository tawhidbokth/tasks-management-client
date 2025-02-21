// import React, { useState } from 'react';
// import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
// import TaskCard from './TasksCard';

// const TaskLists = ({ category }) => {
//   const [tasks, setTasks] = useState([
//     { id: '1', title: 'Sample Task 1' },
//     { id: '2', title: 'Sample Task 2' },
//   ]);

//   const handleAddTask = () => {
//     const newTask = {
//       id: `${tasks.length + 1}`,
//       title: `New Task ${tasks.length + 1}`,
//     };
//     setTasks([...tasks, newTask]);
//   };

//   const handleDragEnd = event => {
//     const { active, over } = event;

//     if (active.id !== over.id) {
//       const activeIndex = tasks.findIndex(task => task.id === active.id);
//       const overIndex = tasks.findIndex(task => task.id === over.id);

//       const newTasks = Array.from(tasks);
//       newTasks.splice(activeIndex, 1);
//       newTasks.splice(overIndex, 0, tasks[activeIndex]);

//       setTasks(newTasks);
//     }
//   };

//   return (
//     <div className="task-list-container">
//       <h2 className="text-xl font-semibold mb-4">{category}</h2>
//       <button
//         onClick={handleAddTask}
//         className="add-task-btn bg-blue-500 text-white p-2 rounded"
//       >
//         Add Task
//       </button>

//       <DndContext onDragEnd={handleDragEnd}>
//         <div className="task-list">
//           {tasks.map((task, index) => {
//             return <TaskCard key={task.id} task={task} index={index} />;
//           })}
//         </div>
//       </DndContext>
//     </div>
//   );
// };

// export default TaskLists;
