import React, { useState, useEffect } from "react";

const API_URL = "https://playground.4geeks.com/todo/todos/TU_USUARIO";

const Tareas = () => {
  const [tasks, setTasks] = useState([]); // Lista de tareas
  const [taskInput, setTaskInput] = useState(""); // Input de nueva tarea

  // 🔹 Cargar tareas desde la API al iniciar
  useEffect(() => {
    fetch(API_URL)
      .then((resp) => resp.json())
      .then((data) => {
        console.log("Tareas obtenidas:", data);
        if (Array.isArray(data)) {
          setTasks(data);
        }
      })
      .catch((error) => console.error("Error al cargar tareas:", error));
  }, []);

  // 🔹 Actualizar tareas en la API
  const updateTasksOnServer = (newTasks) => {
    fetch(API_URL, {
      method: "PUT",
      body: JSON.stringify(newTasks),
      headers: { "Content-Type": "application/json" },
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log("Servidor actualizado:", data);
        setTasks(newTasks);
      })
      .catch((error) => console.error("Error al actualizar tareas:", error));
  };

  // 🔹 Agregar tarea
  const addTask = (e) => {
    if (e.key === "Enter" && taskInput.trim() !== "") {
      const newTask = { id: Date.now(), text: taskInput.trim() };
      const newTasks = [...tasks, newTask];
      updateTasksOnServer(newTasks);
      setTaskInput(""); // Limpiar el input después de agregar la tarea
    }
  };

  // 🔹 Eliminar tarea por ID
  const deleteTask = (id) => {
    const newTasks = tasks.filter((task) => task.id !== id);
    updateTasksOnServer(newTasks);
  };

  // 🔹 Eliminar todas las tareas
  const clearAllTasks = () => {
    if (window.confirm("¿Estás seguro de borrar todas las tareas?")) {
      updateTasksOnServer([]);
    }
  };

  console.log(tasks);  // Ver el estado de las tareas cada vez que se renderiza

  return (
    <div className="notebook-container d-flex justify-content-center align-items-center">
      <div className="notebook p-4">
        {/* 📝 Input para añadir tareas */}
        <textarea
          className="notebook-textarea"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          onKeyDown={addTask}
          placeholder="Escribe tu tarea y presiona Enter..."
          onBlur={(e) => {
            // Si el campo está vacío al perder el foco, el placeholder se verá
            if (e.target.value.trim() === "") {
              setTaskInput(""); // Asegúrate de mantener el campo vacío al perder el foco
            }
          }}
        ></textarea>

        {/* 🔹 Lista de tareas */}
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

        {/* 🔥 BOTÓN PARA BORRAR TODAS LAS TAREAS */}
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
