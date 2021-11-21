import { addElemento } from "../exports/exportAddTask.js";
import { resetInputs } from "../exports/exportResetInputs.js";
export let contador = 0;

export const detectEnterToAddTask = (event) => {
  event.keyCode === 13 ? createTask() : null;
};

const createTask = () => {
  const valorTareaInput = document.getElementById("input_tareas");
  let contenidoInput = valorTareaInput.value;
  contenidoInput === "" ? alert("No puedes agregar una tarea vacia") : contador++, addElemento(contenidoInput);
  resetInputs();
};