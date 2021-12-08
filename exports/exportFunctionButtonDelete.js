export let deleteTask = () => {
  setTimeout(() => {
    let buttonDelete = document.getElementsByClassName("buttonDelete");
    for (let i = 0; i < buttonDelete.length; i++) {
      buttonDelete[i].addEventListener("click", () => {
        let element = buttonDelete[i].parentNode.childNodes[1];
        element.classList.add("eliminado");
      });
    }
  }, 10);
};
