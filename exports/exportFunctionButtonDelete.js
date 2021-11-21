export let deleteTask = () => {
  setTimeout(() => {
    let buttonDelete = document.getElementsByClassName("buttonDelete");
    for (let i = 0; i < buttonDelete.length; i++) {
      buttonDelete[i].addEventListener("click", () => {
        let elementoAEliminar = document.getElementById(buttonDelete[i].parentElement.id);
        elementoAEliminar.classList.add("eliminado");
      });
    }
  }, 10);
};
