// Importamos la funcion para agregar la tarea
import { addElemento } from './exportAddTask.js'

// Importamos la funcion para regresar los inputs a su estado inicial
import { resetInputs } from './exportResetInputs.js'

// Agregamos la funcionalidad del botón para editar la tarea
import { buttonEdit } from './exportFunctionButtonEdit.js'

// Importamos la función para determinar la importancia de la tarea
import { functionImportanceTask } from './exportFunctionImportanceTask.js'

// Exportamos la función para si detecta la tecla enter y agregar la tarea
export const detectEnterToAddTask = (event) => {
  // Si el código de la tecla es 13 (enter) ejecuta la función `createTask()` de lo contrario no hace nada
  // eslint-disable-next-line no-unused-expressions
  event.keyCode === 13 ? createTask() : null;
}

// Función para crear la tarea
export const createTask = () => {
  // Función para determinar la importancia de la tarea
  functionImportanceTask()

  // Si el valor del input no está vacío ejecuta la función `addElemento()` de lo contrario no hace nada
  // eslint-disable-next-line no-unused-expressions
  document.getElementById('input_tareas')
    .value === ''
    ? alert('No puedes agregar una tarea vacia')
    // eslint-disable-next-line no-sequences
    : addElemento(document.getElementById('input_tareas').value), buttonEdit(), resetInputs()
}
