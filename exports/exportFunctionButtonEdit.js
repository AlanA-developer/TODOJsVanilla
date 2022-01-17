//Importamos la funcionalidad para cerrar el modal
import { closeModal } from "./exportCloseModal.js";

//Importamos la funcionalidad para guardar el edit la tarea
import { saveEdit } from "./exportSaveEdit.js";

//Creamos y exportamos la función para abrir el modal de edición
export let buttonEdit = () => {
  //Localizamos todos los botones de editar y guardamos en una variable
  let buttons = document.getElementsByClassName("buttonEdit");

  //Tomamos el valor de la variable buttons y lo volvemos un array
  let arrayButtons = Array.from(buttons);

  //Recorremos todos los botones de editar
  for (let i = 0; i < arrayButtons.length; i++) {

    //Detectamos cada tarjeta
    let tarjetas = document.getElementsByClassName("tarjeta");
    
    //Detectamos el click sobre cada botón de editar
    arrayButtons[i].addEventListener("click", function () {
      
      //Creamos el div donde se va a mostrar el modal
      let modal = document.createElement("div");

      //Agregamos una clase al div para estilos y propiedades
      modal.classList.add("modal");

      //Localizamos cuantos modales hay en el documento
      let modalCount = document.getElementsByClassName("modal");

      //No se puede crear un modal si ya hay uno
      if (modalCount.length === 0) {
        //Agregamos un template al modal
        modal.innerHTML = `
            <div>

              <h1 class="modalTitle"> ¿Qué quieres cambiar de tu tarea? </h1>
              
              <input type="text" id="changeTitle" placeholder="Título">
              <input type="text" id="changeSubject" placeholder="Materia">
              <input type="text" id="changeDescription" placeholder="Descripción">
              
              <button id="close" onclick="${closeModal()}">Cancelar</button>
              <button id="save"  onclick="${saveEdit()}">Guardar</button>

            </div>
          `;
        
        //A la tarjeta seleccionada le agregamos el modal
        tarjetas[i].appendChild(modal);
      }
      
    });
  }
};