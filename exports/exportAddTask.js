import { deleteTask } from "./exportFunctionButtonDelete.js";
import { resetCard } from "./exportFunctionButtonReset.js";

export let contador = 0;

export function addElemento(tarea) {
  contador++;
  const tareas = document.getElementById("lista_tareas");
  let tareasMateria = document.getElementById("input_materia").value;
  let tareasDescripcion = document.getElementById("input_descripcion").value;
  const templateTarea = `
  <div class = "tarjeta" id = ${contador}>
              <h2>${tarea}</h2>
              <hr>
              <h3>${tareasMateria}</h3>
              <hr>
              <h3>${tareasDescripcion}</h3>

              <div class="buttonsContainer">
              
                <button class="buttonDelete btnCard">Terminé ✅</button>
                <button class="buttonEdit btnCard" id="buttonEdit${contador}">Editar 📝</button>
                <button class="buttonReset btnCard">No he acabado 🔄</button>
                
                <select name="transporte" class="btnCard" id="menuSelect">
                  <option selected>Mi tarea es:</option>
                  <option>No importante</option>
                  <option>Importante</option>
                  <option>Muy importante</option>
                </select>
                
              </div>
  </div>
              `;
  
  deleteTask();
  resetCard();
  tareas.insertAdjacentHTML("beforeend", templateTarea);
}

