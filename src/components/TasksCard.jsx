// import React from 'react';
// import { useDraggable } from '@dnd-kit/core';

// const TaskCard = ({ task, index }) => {
//   const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
//     id: task.id,
//   });

//   return (
//     <div
//       ref={setNodeRef}
//       {...attributes}
//       {...listeners}
//       className={`task-card p-4 mb-2 rounded shadow-md ${
//         isDragging ? 'bg-gray-200' : 'bg-white'
//       }`}
//     >
//       <h3 className="text-lg font-semibold">{task.title}</h3>
//     </div>
//   );
// };

// export default TaskCard;
