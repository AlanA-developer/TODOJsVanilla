// Importamos la función para agregar la clase eliminado a la tarea
import { deleteTask } from './exportFunctionButtonDelete.js'

// Importamos la función para quitar la clase eliminado a la tarea
import { resetCard } from './exportFunctionButtonReset.js'

// Creamos y exportamos la variable contador para dale un id a cada tarea
export let contador = 0

// Creamos y exportamos lafunción para crear la tarjeta de la tarea con sus respectivos elementos
export function addElemento (tarea) {
  // Aumentamos el contador
  contador++

  // Creamos el template de la tarjeta de la tarea
  const templateTarea = `
  <div class = "tarjeta" id = ${contador}>
              <h2>${tarea}</h2>
              <hr>
              <h3>${document.getElementById('input_materia').value}</h3>
              <hr>
              <h3>${document.getElementById('input_descripcion').value}</h3>

              <div class="buttonsContainer">
              
                <button class="buttonDelete btnCard" id="buttonDelete">Terminé ✅</button>
                <button class="buttonEdit btnCard" id="buttonEdit${contador}">Editar 📝</button>
                <button class="buttonReset btnCard" id="buttonReset">No he acabado 🔄</button>
                
                <select name="transporte" class="btnCard" id="menuSelect">
                  <option selected>Mi tarea es:</option>
                  <option>No importante</option>
                  <option>Importante</option>
                  <option>Muy importante</option>
                </select>
                
              </div>
  </div>
              `

  // Invocamos las funciones para agregar y eliminar las clases de la tarjeta
  deleteTask()
  resetCard()

  // Agregamos la tarjeta a la lista de tareas
  document.getElementById('lista_tareas')
    .insertAdjacentHTML('beforeend', templateTarea)
}
