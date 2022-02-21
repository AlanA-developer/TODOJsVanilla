//Creamos y exportamos la función para agregar la clase eliminado a la tarea
export let deleteTask = () => {
  //Agregamos un setTimeout para que la clase eliminado se agregue después de que se haya ejecutado las funciones anteriores
  setTimeout(() => {
    //Localizamos todos los botones de eliminar y guardamos en una variable
    let buttonDelete = document.querySelectorAll("#buttonDelete");

    buttonDelete.forEach((element) => {
      //Detectamos el click sobre cada botón de eliminar
      element.addEventListener("click", (e) => {
        e.target.parentNode.parentNode.childNodes[1].style.transition = "300ms";
        e.target.parentNode.parentNode.childNodes[1].classList.add("eliminado");

        e.target.parentNode.parentNode.childNodes[5].style.transition = "300ms";
        e.target.parentNode.parentNode.childNodes[5].classList.add("eliminado");

        e.target.parentNode.parentNode.childNodes[9].style.transition = "300ms";
        e.target.parentNode.parentNode.childNodes[9].classList.add("eliminado");
      });
    });
  }, 5);
};
