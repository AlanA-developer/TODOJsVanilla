import { addElemento } from "../exports/exportAddTask.js";
import { resetInputs } from "../exports/exportResetInputs.js";


export const detectEnterToAddTask = (event) => {
  event.keyCode === 13 ? createTask() : null;
};

const createTask = () => {
  const valorTareaInput = document.getElementById("input_tareas");
  let contenidoInput = valorTareaInput.value;
  contenidoInput === "" ? alert("No puedes agregar una tarea vacia") : addElemento(contenidoInput);
  resetInputs();
};