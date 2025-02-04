import React, { useState, useEffect } from "react";

const API_URL = "https://playground.4geeks.com/todo/";
const USER = "oscar"

const Tareas = () => {
  const [tasks, setTasks] = useState([]); 
  const [taskInput, setTaskInput] = useState(""); 

  
  useEffect(() => {
    fetch(API_URL + "users/" + USER,{
      method:"POST",
      body:"",
      headers: { "Content-Type": "application/json" },
    } )
      .then((resp) => resp.json())
      .then((data) => {
        console.log("Tareas obtenidas:", data);
        if (Array.isArray(data)) {
          setTasks(data);
        }
      })
      .catch((error) => console.error("Error al cargar tareas:", error));
  }, []);

  
  const updateTasksOnServer = (task) => {
    fetch(API_URL + "todos/" + task.id, {
      method: "PUT",
      body: JSON.stringify(task),
      headers: { "Content-Type": "application/json" },
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log("Servidor actualizado:", data);
        setTasks(task);
      })
      .catch((error) => console.error("Error al actualizar tareas:", error));
  };

  
  const addTask = (e) => {
    if (e.key === "Enter" && taskInput.trim() !== "") {
      fetch(API_URL + "todos/" + USER, {
        method: "POST",
        body: JSON.stringify({label:taskInput,is_done:false}),
        headers: { "Content-Type": "application/json" },
      })
      .then((resp) => resp.json())
      .then((data) => {
        console.log("Servidor actualizado:", data);
        setTasks(tasks.push(data));
      })
      .catch((error) => console.error("Error al actualizar tareas:", error));
      setTaskInput(""); 
    }
  };

  
  const deleteTask = (id) => {
    const newTasks = tasks.filter((task) => task.id !== id);
    updateTasksOnServer(newTasks);
  };

 
  const clearAllTasks = () => {
    if (window.confirm("¿Estás seguro de borrar todas las tareas?")) {
      updateTasksOnServer([]);
    }
  };

  console.log(tasks);  

  return (
    <div className="notebook-container d-flex justify-content-center align-items-center">
      <div className="notebook p-4">
        
        <textarea
          className="notebook-textarea"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          onKeyDown={addTask}
          placeholder="Escribe tu tarea y presiona Enter..."
          onBlur={(e) => {
            
            if (e.target.value.trim() === "") {
              setTaskInput(""); 
            }
          }}
        ></textarea>

        
        <ul className="task-list mt-3">
          {tasks.length === 0 ? (
            <p className="text-muted">No hay tareas. Añade una tarea.</p>
          ) : (
            tasks.map((task) => (
              <li key={task.id} className="task-item d-flex justify-content-between align-items-center">
                <span>{task.text}</span>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteTask(task.id)}
                >
                  Eliminar
                </button>
              </li>
            ))
          )}
        </ul>

        
        {tasks.length > 0 && (
          <button
            className="btn btn-warning mt-3"
            onClick={clearAllTasks}
            style={{ display: "block", width: "50%", zIndex: 10, marginLeft: "30%" }}
          >
            Limpiar Todo
          </button>
        )}
      </div>
    </div>
  );
};

export default Tareas;
