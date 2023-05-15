import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Task from "./Task";
import TaskForm from "./TaskForm";
import { URL } from "../App";
import loadingGif from "../assets/loader.gif";

//localhost:5000/api/tasks

const TaskList = () => {
  // States
  const [formData, setFormData] = useState({
    taskName: "",
    completed: false,
  });
  const { taskName } = formData;
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [taskId, setTaskId] = useState("");

  // useEffects
  useEffect(() => {
    getTasks();
  }, []);

  useEffect(() => {
    const filterCompletedTasks = tasks.filter((task) => {
      return task.completed === true;
    });
    setCompletedTasks(filterCompletedTasks);
  }, [tasks]);

  // Helper functions
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const createTask = async (e) => {
    e.preventDefault();
    if (taskName === "") {
      return toast.error("input field cannot be empty");
    }
    try {
      await axios.post(`${URL}/api/tasks`, formData);
      getTasks();
      toast.success("Task added successfully");
      setFormData({ ...formData, taskName: "" });
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const getTasks = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${URL}/api/tasks`);
      setTasks(data);
      setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  const getSingleTask = async (task) => {
    setFormData({ taskName: task.taskName, completed: false });
    setTaskId(task._id);
    setIsEditing(true);
  };

  const updateTask = async (e) => {
    e.preventDefault();
    if (taskName === "") {
      return toast.error("input field cannot be empty");
    }
    try {
      await axios.put(`${URL}/api/tasks/${taskId}`, formData);
      setFormData({ ...formData, taskName: "" });
      setIsEditing(false);
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${URL}/api/tasks/${id}`);
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const setToComplete = async (task) => {
    const newFromData = {
      taskName: task.taskName,
      completed: true,
    };
    try {
      await axios.put(`${URL}/api/tasks/${task._id}`, newFromData);
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const renderSpinner = () => {
    return (
      isLoading && (
        <div className="--flex-center">
          <img src={loadingGif} alt="spinning loading image" />
        </div>
      )
    );
  };

  const renderTasks = () => {
    return !isLoading && tasks.length === 0 ? (
      <p className="--py">No tasks added</p>
    ) : (
      <>
        {tasks.map((task, index) => {
          return (
            <Task
              key={task._id}
              index={index}
              task={task}
              deleteTask={deleteTask}
              getSingleTask={getSingleTask}
              setToComplete={setToComplete}
            />
          );
        })}
      </>
    );
  };

  const renderTaskCounter = () => {
    return (
      tasks.length > 0 && (
        <div className="--flex-between --pb">
          <p>
            <b>Total Tasks:</b> {tasks.length}
          </p>
          <p>
            <b>Completed Tasks:</b> {completedTasks.length}
          </p>
        </div>
      )
    );
  };

  return (
    <div>
      <h2>Task Manager</h2>
      <TaskForm
        name={taskName}
        handleInputChange={handleInputChange}
        createTask={createTask}
        updateTask={updateTask}
        isEditing={isEditing}
      />
      {renderTaskCounter()}
      <hr />
      {renderSpinner()}
      {renderTasks()}
    </div>
  );
};

export default TaskList;
