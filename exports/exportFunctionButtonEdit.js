import { closeModal } from "./exportCloseModal.js";
import { saveEdit } from "./exportSaveEdit.js";


export let buttonEdit = async () => {
  let buttons = document.getElementsByClassName("buttonEdit");

  let arrayButtons = Array.from(buttons);

  for (let i = 0; i < arrayButtons.length; i++) {

    let tarjetas = document.getElementsByClassName("tarjeta");
    
    arrayButtons[i].addEventListener("click", function () {
      
      let modal = document.createElement("div");
      modal.classList.add("modal");
      let modalCount = document.getElementsByClassName("modal");

      //No se puede crear un modal si ya hay uno
      if (modalCount.length == 0) {
        modal.innerHTML = `

            <div>

              <h1 class="modalTitle"> ¿Qué quieres cambiar de tu tarea? </h1>
              
              <input type="text" id="changeTitle" placeholder="Título">
              <input type="text" id="changeSubject" placeholder="Materia">
              <input type="text" id="changeDescription" placeholder="Descripción">
              
              <br>
              <button id="close" onclick="${closeModal()}">Cancelar</button>
              <br>
              <button id="save"  onclick="${saveEdit()}">Guardar</button>

            </div>

          `;
        tarjetas[i].appendChild(modal);
      }
      
    });
  }
};