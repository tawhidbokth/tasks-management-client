import Swal from 'sweetalert2';
import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { AuthContext } from '../Provider/AuthProvider';
import Navbar from './Navbar';
import useTasks from '../Hooks/useTasks';

const TasksDashboard = () => {
  const [tasks, refetch] = useTasks();
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const { user } = useContext(AuthContext);

  // Get current local date and time
  const getLocalDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const form = e.target; // Get the form element
    const formData = new FormData(form);
    const newTask = {
      title: formData.get('title'),
      description: formData.get('description'),
      dateTime: getLocalDateTime(),
      status: formData.get('status'),
      employee_email: user?.email || '',
      employee: user?.displayName || '',
    };

    axios
      .post('https://tasks-managment-server.vercel.app/tasks', newTask)
      .then(data => {
        if (data.data.insertedId) {
          Swal.fire({
            position: 'top-center',
            icon: 'success',
            title: 'Task has been added.',
            showConfirmButton: false,
            timer: 1500,
          });
          refetch();
          form.reset(); // Reset the form after successful submission
        }
      })
      .catch(error => {
        console.error('Error adding task:', error);
        Swal.fire({
          position: 'top-center',
          icon: 'error',
          title: 'Failed to add task.',
          text: 'Please try again later.',
          showConfirmButton: true,
        });
      });
  };
  const handleDelete = id => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(result => {
      if (result.isConfirmed) {
        axios
          .delete(`https://tasks-managment-server.vercel.app/tasks/${id}`)
          .then(res => {
            if (res.data.deletedCount > 0) {
              refetch();
              Swal.fire({
                title: 'Deleted!',
                text: 'Task has been deleted.',
                icon: 'success',
              });
            }
          });
      }
    });
  };

  const handleUpdate = e => {
    e.preventDefault();
    if (!selectedTask) {
      console.error('No task selected for update');
      return;
    }

    const formData = new FormData(e.target);
    const updatedData = Object.fromEntries(formData.entries());

    axios
      .put(
        `https://tasks-managment-server.vercel.app/tasks/${selectedTask._id}`,
        updatedData
      )
      .then(data => {
        if (data.data.modifiedCount > 0) {
          Swal.fire({
            title: 'Success!',
            position: 'top-center',
            text: 'Task updated successfully',
            icon: 'success',
            confirmButtonText: 'Ok',
          });
          refetch();
          setShowModal(false); // Close the modal after update
        }
      });
  };

  // Handle drag-and-drop
  const onDragEnd = async result => {
    const { source, destination, draggableId } = result;

    if (!destination) return; // Dropped outside the list
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    // Find the task being dragged
    const task = tasks.find(t => t._id === draggableId);

    // Update task status if moved to a different category
    if (source.droppableId !== destination.droppableId) {
      task.status = destination.droppableId;
      await axios.put(
        `https://tasks-managment-server.vercel.app/tasks/${task._id}`,
        task
      );
    }

    // Reorder tasks
    const updatedTasks = [...tasks];
    updatedTasks.splice(source.index, 1);
    updatedTasks.splice(destination.index, 0, task);
    tasks(updatedTasks);
  };

  // Group tasks by status
  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.status]) acc[task.status] = [];
    acc[task.status].push(task);
    return acc;
  }, {});

  return (
    <div className="p-6 bg-gray-100 shadow-md rounded-lg h-auto">
      <Navbar />
      <h1 className="lg:text-4xl text-2xl font-bold text-yellow-700 mb-4 text-center">
        Task Management Application
      </h1>

      {/* Add Task Form */}
      <div className="lg:w-1/2 mx-auto my-8 p-6 bg-white shadow-md rounded-md">
        <form
          onSubmit={handleSubmit}
          className="grid lg:grid-cols-1 gap-4 items-center"
        >
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              name="title"
              required
              maxLength="50"
              placeholder="Enter title (max 50 characters)"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              maxLength="200"
              placeholder="Enter description (max 200 characters)"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Category</label>
            <select
              name="status"
              required
              className="w-full p-2 border rounded"
            >
              <option value="To-Do">To-Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>

      {/* Drag-and-Drop Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {['To-Do', 'In Progress', 'Done'].map(status => (
            <Droppable key={status} droppableId={status}>
              {provided => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="border rounded-lg shadow-md p-4 bg-gray-50"
                >
                  <h2 className="text-xl font-bold mb-4">{status}</h2>
                  {groupedTasks[status]?.map((task, index) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id}
                      index={index}
                    >
                      {provided => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`p-4 mb-4 rounded-lg shadow-sm ${
                            status === 'To-Do'
                              ? 'bg-yellow-200'
                              : status === 'In Progress'
                              ? 'bg-blue-200'
                              : 'bg-green-200'
                          }`}
                        >
                          <h3 className="text-lg font-semibold text-gray-800">
                            {task.title}
                          </h3>
                          <p className="text-gray-600">{task.description}</p>
                          <p className="text-sm text-gray-600">
                            🕒 {task.dateTime}
                          </p>
                          <div className="flex justify-between mt-3">
                            <button
                              onClick={() => {
                                setSelectedTask(task);
                                setShowModal(true);
                              }}
                              className="btn btn-sm text-blue-500 flex items-center gap-1"
                            >
                              🖊 Edit
                            </button>
                            <button
                              onClick={() => handleDelete(task._id)}
                              className="text-red-500 hover:underline"
                            >
                              ❌ Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg lg:w-1/3 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal Content */}
            <form onSubmit={handleUpdate} className="grid gap-4 items-center">
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={selectedTask?.title}
                  required
                  maxLength="50"
                  placeholder="Enter title (max 50 characters)"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  defaultValue={selectedTask?.description}
                  maxLength="200"
                  placeholder="Enter description (max 200 characters)"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Category</label>
                <select
                  name="status"
                  defaultValue={selectedTask?.status}
                  required
                  className="w-full p-2 border rounded"
                >
                  <option value="To-Do">To-Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  Update Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksDashboard;
