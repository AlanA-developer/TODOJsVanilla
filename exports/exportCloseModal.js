//Creamos y exportamos la función para cerrar el modal
export const closeModal = () => {
    //Utilizamos un setTimeout para que se ejecute después de que se haya ejecutado las funciones anteriores
    setTimeout(() => {
      //Localizamos todos los botones para cerrar el modal y guardamos en una variable
      let buttonClose = document.getElementById("close");

      //Detectamos el click sobre cada botón para cerrar el modal
      buttonClose.addEventListener("click", () => {
        //Localizamos todos los modales y guardamos en una variable
        let modal = document.querySelector(".modal");

        //Eliminamos el modal
        modal.remove();
      });
    }, 5);
  };