//Creamos y exportamos la función para guardar el edit de la tarea
export const saveEdit = () => {
  //Utilizamos un setTimeout para que se ejecute después de que se haya ejecutado las funciones anteriores
  setTimeout(() => {
    //Localizamos todos los botones para guardar el edit de la tarea y guardamos en una variable
    let buttonSave = document.getElementById("save");

    //Detectamos el click sobre cada botón para guardar el edit de la tarea
    buttonSave.addEventListener("click", () => {
      //Localizamos el modal del elemento seleccionado
      let actualElement = document.querySelector(".modal");

      //Guardamos en sus variables respectivas los valores que decidimos cambiar
      let title = document.getElementById("changeTitle").value;
      let subject = document.getElementById("changeSubject").value;
      let description = document.getElementById("changeDescription").value;

      //Si no se modifica nada dentro del modal entonces sus valores se mantienen iguales en los elementos correspondientes
      if (title == "") {
        title = actualElement.parentElement.childNodes[1].textContent;
      }
      if (subject == "") {
        subject = actualElement.parentElement.childNodes[5].textContent;
      }
      if (description == "") {
        description = actualElement.parentElement.childNodes[9].textContent;
      }

      //Sustituimos los valores de los elementos correspondientes
      actualElement.parentElement.childNodes[1].textContent = title;
      actualElement.parentElement.childNodes[5].textContent = subject;
      actualElement.parentElement.childNodes[9].textContent = description;

      //Cerramos el modal
      actualElement.remove();
    });
  }, 5);
};
