export const saveEdit = () => {
    setTimeout(() => {
      let buttonSave = document.getElementById("save");
      buttonSave.addEventListener("click", () => {
        let actualElement = document.querySelector(".modal");
        let title = document.getElementById("changeTitle").value;
        let subject = document.getElementById("changeSubject").value;
        let description = document.getElementById("changeDescription").value;
  
        actualElement.parentElement.childNodes[1].innerHTML = title;
        actualElement.parentElement.childNodes[5].innerHTML = subject;
        actualElement.parentElement.childNodes[9].innerHTML = description;
  
        actualElement.remove();
      });
    }, 50);
  }