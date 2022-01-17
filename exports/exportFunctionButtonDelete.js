//Creamos y exportamos la función para agregar la clase eliminado a la tarea
export let deleteTask = () => {
  //Agregamos un setTimeout para que la clase eliminado se agregue después de que se haya ejecutado las funciones anteriores
  setTimeout(() => {
    //Localizamos todos los botones de eliminar y guardamos en una variable
    let buttonDelete = document.getElementsByClassName("buttonDelete");

    //Recorremos todos los botones de eliminar
    for (let i = 0; i < buttonDelete.length; i++) {
      //Detectamos el click sobre cada botón de eliminar
      buttonDelete[i].addEventListener("click", () => {
        //Creamos un array con todos los elementos de la tarjeta a los que se les agregará la clase eliminado
        let elements = [
          buttonDelete[i].parentNode.parentNode.childNodes[1],
          buttonDelete[i].parentNode.parentNode.childNodes[5],
          buttonDelete[i].parentNode.parentNode.childNodes[9],
        ];
        
        //Agregamos la clase eliminado a cada elemento del array elements
        elements.forEach((element) => {
          element.style.transition = "300ms";
          element.classList.add("eliminado");
        });

      });
    }
  }, 5);
};
