export let resetCard = function () {
  setTimeout(() => {
    const buttonReset = document.getElementsByClassName("buttonReset");
    for (let i = 0; i < buttonReset.length; i++) {
      buttonReset[i].addEventListener("click", () => {

        let elements = [
          buttonReset[i].parentNode.childNodes[1],
          buttonReset[i].parentNode.childNodes[5],
          buttonReset[i].parentNode.childNodes[9],
        ];

        elements.forEach((element) => {
          element.style.transition = "300ms";
          element.classList.remove("eliminado");
        });
        
      });
    }
  }, 10);
};
