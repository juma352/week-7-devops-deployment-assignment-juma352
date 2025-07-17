import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import TaskCard from "../components/TaskCard";
import TaskDialog from "../components/TaskDialog";
import Navbar from "../components/Navbar";
import toast from "@/lib/toast";
import { getUserFromToken } from "@/utils/auth";

export default function DeveloperDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const load = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await API.get("/tasks/me");
      setTasks(res.data || []);
    } catch (error) {
      console.error("Error loading tasks:", error);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast("Please login to access your tasks");
        localStorage.removeItem("token");
        navigate("/login");
      } else if (error.response?.status === 404) {
        setTasks([]);
      } else {
        toast("Error loading tasks");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userData = getUserFromToken();
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(userData);
    load();
  }, [navigate]);

  const createTask = async (payload) => {
    try {
      const res = await API.post("/tasks", payload);
      setTasks(prev => [res.data, ...prev]);
      toast("Task created ✔️");
    } catch (error) {
      toast(error.response?.data?.message || "Failed to create task");
    }
  };

  const toggleTask = async (id) => {
    try {
      const task = tasks.find(t => t._id === id);
      const res = await API.put(`/tasks/${id}`, { completed: !task.completed });
      setTasks(prev => prev.map(t => (t._id === id ? res.data : t)));
    } catch (error) {
      toast(error.response?.data?.message || "Failed to update task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => t._id !== id));
      toast("Task deleted 🗑️");
    } catch (error) {
      toast(error.response?.data?.message || "Failed to delete task");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="max-w-5xl mx-auto p-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Developer Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Welcome {user?.username || 'Developer'} - Manage your personal tasks
            </p>
          </div>
          <TaskDialog onSubmit={createTask} />
        </div>

        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <h2 className="font-semibold text-green-900 dark:text-green-100">Developer View</h2>
          <p className="text-sm text-green-700 dark:text-green-300">
            You can create, edit, and delete your own tasks. Total tasks: {tasks.length}
          </p>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No tasks yet. Create your first task!</p>
          </div>
        ) : (
          <section
            className="grid gap-6
                       sm:grid-cols-2
                       lg:grid-cols-3
                       xl:grid-cols-4"
          >
            {tasks.map(t => (
              <TaskCard
                key={t._id}
                task={t}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            ))}
          </section>
        )}
      </main>
    </>
  );
}