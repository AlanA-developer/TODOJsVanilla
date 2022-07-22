// Importamos la función para detectar la tecla enter
import { detectEnterToAddTask, createTask } from './exportDetectEnterToAddTask.js'
// Exportamos la función para agregar la función de agregar tareas
export const agregarTareas = () => {
  document.getElementById('input_descripcion')
    .addEventListener('keypress', (event) => {
      // Si se levanta la tecla enter se agrega la tarea
      detectEnterToAddTask(event)
    })

    //Agregamos funcionalidad al boton de agregar tarea
    document.getElementById('buttonAddTask').addEventListener('click', createTask)
}
