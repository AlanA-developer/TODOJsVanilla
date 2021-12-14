export const closeModal = () => {
    setTimeout(() => {
      let buttonClose = document.getElementById("close");
      buttonClose.addEventListener("click", () => {
        let modal = document.querySelector(".modal");
        modal.remove();
      });
    }, 500);
  };