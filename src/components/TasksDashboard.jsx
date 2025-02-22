import Swal from 'sweetalert2';
import { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../Provider/AuthProvider';
import useTasks from '../Hooks/useTasks';
import Navbar from './Navbar';

const TasksDashboard = () => {
  const [tasks, refetch] = useTasks();
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null); // Store selected task data
  const { user } = useContext(AuthContext);
  const getLocalDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const initialData = Object.fromEntries(formData.entries());

    const finalData = {
      ...initialData,
      employee_email: user?.email || '',
      employee: user?.displayName || '',
    };

    axios
      .post('http://localhost:5000/tasks', finalData)
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
        axios.delete(`http://localhost:5000/tasks/${id}`).then(res => {
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
      .put(`http://localhost:5000/tasks/${selectedTask._id}`, updatedData)
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
          setShowSalaryModal(false); // Close the modal after update
        }
      });
  };

  return (
    <div className="p-6 bg-gray-100 shadow-md rounded-lg  h-auto">
      <Navbar></Navbar>
      <h1 className="lg:text-4xl text-2xl font-bold text-yellow-700 mb-4 text-center">
        Task Management Application
      </h1>
      <div className="lg:w-1/2 mx-auto my-8 p-6 bg-white shadow-md rounded-md">
        <form
          onSubmit={handleSubmit}
          className=" grid lg:grid-cols-1 gap-4 items-center"
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
            <label className="block text-sm font-medium">Timestamp</label>
            <input
              type="datetime-local"
              name="dateTime"
              value={getLocalDateTime()}
              readOnly
              className="border px-3 py-2 rounded w-full bg-gray-100 text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Tasks Category</label>
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
            <label className="block text-sm font-medium">Submit Tasks</label>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Submit Tasks
            </button>
          </div>
        </form>
      </div>
      {/* Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {tasks.map(t => {
          const bgColor =
            t.status === 'To-Do'
              ? 'bg-yellow-200'
              : t.status === 'In Progress'
              ? 'bg-blue-200'
              : 'bg-green-200';

          return (
            <div
              key={t._id}
              className={`border rounded-lg shadow-md p-4 ${bgColor}`}
            >
              <h3 className="text-lg font-semibold text-gray-800">{t.title}</h3>
              <p className="text-gray-800 font-medium">📌 {t.status}</p>
              <p className="text-sm text-gray-600">🕒 {t.dateTime}</p>

              <div className="flex justify-between mt-3">
                <button
                  onClick={() => {
                    setSelectedTask(t);
                    setShowSalaryModal(true);
                  }}
                  className="btn btn-sm text-blue-500 flex items-center gap-1"
                >
                  🖊 Update
                </button>

                <button
                  onClick={() => handleDelete(t._id)}
                  className="text-red-500 hover:underline"
                >
                  ❌ Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showSalaryModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg lg:w-1/3">
            <form onSubmit={handleUpdate} className=" grid  gap-4 items-center">
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
                <label className="block text-sm font-medium">Timestamp</label>
                <input
                  type="datetime-local"
                  name="dateTime"
                  value={getLocalDateTime()}
                  readOnly
                  className="border px-3 py-2 rounded w-full bg-gray-100 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Tasks Category
                </label>
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
                  Update Tasks
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
