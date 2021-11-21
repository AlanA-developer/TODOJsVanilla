import { detectEnterToAddTask } from "./exportDetectEnterToAddTask.js";

export const agregarTareas = () => {
  const input_descripcion = document.getElementById("input_descripcion");
  input_descripcion.addEventListener("keypress", (event) => {
    detectEnterToAddTask(event);
  });
};
