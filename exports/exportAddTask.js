import { deleteTask } from "./exportFunctionButtonDelete.js";

let contador = 0;

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
              <button class="buttonDelete">Terminé ✅</button>
              <button class="buttonEdit">Editar 📝</button>
              <button class="buttonReset">No he acabado 🔄</button>
          </div>
  `;
  deleteTask();
  tareas.insertAdjacentHTML("beforeend", templateTarea);
}
