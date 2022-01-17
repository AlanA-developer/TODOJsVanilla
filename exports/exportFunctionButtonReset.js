//Creamos y exportamos la función para quitar la clase eliminado a la tarea
export let resetCard = function () {
  //Agregamos un setTimeout para que la clase eliminado se agregue después de que se haya ejecutado las funciones anteriores
  setTimeout(() => {
    //Localizamos todos los botones de reset y guardamos en una variable
    const buttonReset = document.getElementsByClassName("buttonReset");

    //Recorremos todos los botones de reset
    for (let i = 0; i < buttonReset.length; i++) {
      //Detectamos el click sobre cada botón de reset
      buttonReset[i].addEventListener("click", () => {

        //Creamos un array con todos los elementos de la tarjeta a los que se les quitará la clase eliminado
        let elements = [
          buttonReset[i].parentNode.parentNode.childNodes[1],
          buttonReset[i].parentNode.parentNode.childNodes[5],
          buttonReset[i].parentNode.parentNode.childNodes[9],
        ];

        //Eliminamos la clase eliminado a cada elemento seleccionado en el array elements
        elements.forEach((element) => {
          element.style.transition = "300ms";
          element.classList.remove("eliminado");
        });
        
      });
    }
  }, 5);
};
