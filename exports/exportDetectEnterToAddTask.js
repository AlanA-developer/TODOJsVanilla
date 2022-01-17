//Importamos la funcion para agregar la tarea
import { addElemento } from "./exportAddTask.js";

//Importamos la funcion para regresar los inputs a su estado inicial
import { resetInputs } from "./exportResetInputs.js";

//Agregamos la funcionalidad del botón para editar la tarea
import { buttonEdit } from "./exportFunctionButtonEdit.js";

//Importamos la función para determinar la importancia de la tarea
import { functionImportanceTask } from "./exportFunctionImportanceTask.js";


//Exportamos la función para si detecta la tecla enter y agregar la tarea
export const detectEnterToAddTask = (event) => {
  //Si el código de la tecla es 13 (enter) ejecuta la función `createTask()` de lo contrario no hace nada
  event.keyCode === 13 ? createTask() : null;
};

//Función para crear la tarea
const createTask = () => {
  //Localizamos el input del valor de la tarea y la guardamos en una variable
  const valorTareaInput = document.getElementById("input_tareas");

  //Guardamos el valor del input en una variable
  let contenidoInput = valorTareaInput.value;

  //Función para determinar la importancia de la tarea
  functionImportanceTask();

  //Si el valor del input no está vacío ejecuta la función `addElemento()` de lo contrario no hace nada
  contenidoInput === "" ? alert("No puedes agregar una tarea vacia") : addElemento(contenidoInput), buttonEdit(), resetInputs();
};