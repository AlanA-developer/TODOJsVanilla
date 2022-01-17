import { addElemento } from "./exportAddTask.js";
import { resetInputs } from "./exportResetInputs.js";
import { buttonEdit } from "./exportFunctionButtonEdit.js";
import { functionImportanceTask } from "./exportFunctionImportanceTask.js";


export const detectEnterToAddTask = (event) => {
  event.keyCode === 13 ? createTask() : null;
};

const createTask = () => {
  const valorTareaInput = document.getElementById("input_tareas");
  let contenidoInput = valorTareaInput.value;
  functionImportanceTask();
  contenidoInput === "" ? alert("No puedes agregar una tarea vacia") : addElemento(contenidoInput), buttonEdit(), resetInputs();
};