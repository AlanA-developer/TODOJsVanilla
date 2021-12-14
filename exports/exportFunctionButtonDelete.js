export let deleteTask = () => {
  setTimeout(() => {
    let buttonDelete = document.getElementsByClassName("buttonDelete");
    for (let i = 0; i < buttonDelete.length; i++) {
      buttonDelete[i].addEventListener("click", () => {
        
        let elements = [
          buttonDelete[i].parentNode.childNodes[1],
          buttonDelete[i].parentNode.childNodes[5],
          buttonDelete[i].parentNode.childNodes[9],
        ];

        elements.forEach((element) => {
          element.style.transition = "300ms";
          element.classList.add("eliminado");
        });

      });
    }
  }, 10);
};
