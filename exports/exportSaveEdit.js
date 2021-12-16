export const saveEdit = () => {
  setTimeout(() => {
    let buttonSave = document.getElementById("save");
    buttonSave.addEventListener("click", () => {
      let actualElement = document.querySelector(".modal");
      let title = document.getElementById("changeTitle").value;
      let subject = document.getElementById("changeSubject").value;
      let description = document.getElementById("changeDescription").value;

      if (title == "") {
        title = actualElement.parentElement.childNodes[1].textContent;
      }
      if (subject == "") {
        subject = actualElement.parentElement.childNodes[5].textContent;
      }
      if (description == "") {
        description = actualElement.parentElement.childNodes[9].textContent;
      }

      actualElement.parentElement.childNodes[1].textContent = title;
      actualElement.parentElement.childNodes[5].textContent = subject;
      actualElement.parentElement.childNodes[9].textContent = description;

      actualElement.remove();
    });
  }, 50);
};
