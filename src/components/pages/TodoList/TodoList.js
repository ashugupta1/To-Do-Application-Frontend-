import React, { useState, useEffect } from "react";
import axios from "axios";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("https://to-do-application-backend-4yis.onrender.com/api/tasks", {
          headers: { "x-auth-token": token },
        });
        console.log(res.data);
        setTasks(res.data);
      } catch (err) {
        setError("Failed to fetch tasks");
      }
    };
    fetchTasks();
  }, [token]);

  const handleAddTask = async () => {
    if (!newTask || !newDescription) return; // Prevent adding empty tasks
    try {
      const res = await axios.post(
        "https://to-do-application-backend-4yis.onrender.com/api/tasks",
        { title: newTask, description: newDescription },
        {
          headers: { "x-auth-token": token },
        }
      );
      setTasks([...tasks, res.data]);
      setNewTask("");
      setNewDescription("");
    } catch (err) {
      setError("Failed to add task");
    }
  };

  const handleToggleStatus = async (id, status) => {
    const newStatus = status === "completed" ? "incomplete" : "completed";
    try {
      await axios.put(
        `https://to-do-application-backend-4yis.onrender.com/api/tasks/${id}`,
        { status: newStatus },
        {
          headers: { "x-auth-token": token },
        }
      );
      setTasks(
        tasks.map((task) =>
          task._id === id ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      setError("Failed to update task status");
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`https://to-do-application-backend-4yis.onrender.com/api/tasks/${id}`, {
        headers: { "x-auth-token": token },
      });
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  return (
    <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My To-Do List</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Title"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="w-full md:w-2/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleAddTask}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Add Task
        </button>
      </div>

      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="p-4 bg-gray-100 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center"
          >
            <div>
              <strong className="text-lg font-semibold">{task.title}</strong>
              <p className="text-gray-600">{task.description}</p>
              <p className="text-sm text-gray-500">
                Created by: {task.createdBy.username} ({task.createdBy.email})
              </p>

              <span
                className={`inline-block mt-2 px-2 py-1 text-sm rounded-full ${
                  task.status === "completed"
                    ? "bg-green-200 text-green-800"
                    : "bg-yellow-200 text-yellow-800"
                }`}
              >
                {task.status}
              </span>
            </div>
            <div className="flex items-center mt-4 md:mt-0 md:ml-4 space-x-2">
              <button
                onClick={() => handleToggleStatus(task._id, task.status)}
                className="bg-indigo-500 text-white px-3 py-1 rounded-lg hover:bg-indigo-600 transition duration-300"
              >
                {task.status === "completed"
                  ? "Mark Incomplete"
                  : "Mark Complete"}
              </button>
              <button
                onClick={() => handleDeleteTask(task._id)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
