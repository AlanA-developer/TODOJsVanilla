/* eslint-disable func-call-spacing */
// Importamos el header
import { appendHeader } from './components/header.js'

// Importamos la sección de inputs
import { appendTodoInputsSection } from './components/todoSection.js'

// Importamos la sección donde se cargan las tareas
import { appendTaskList } from './components/taskList.js'

// Importamos la función para agregar tareas
import { agregarTareas } from './shared/exportsAgregarTareasFuncion.js'

// Usamos las importaciones
appendHeader()
appendTodoInputsSection()
appendTaskList()
agregarTareas()

export const contentLoaded = document.addEventListener('DOMContentLoaded', () => {
  alert('Para agregar una tarea, escriba en el campo de texto y presione la tecla "Enter"')
})
