export const toggleDarkMode = () => {
  const checkbox = document.getElementById("checkbox");
  const body = document.querySelector("body");

  checkbox.addEventListener("change", () => {

    const tarjetas = document.querySelectorAll(".tarjeta");
    
    if (checkbox.checked) {

          body.classList.add("dark");

          tarjetas.forEach((tarjeta) => {
            tarjeta.classList.add("tarjetaBorderWhite");
          });

          checkbox.nextElementSibling.style.border = "1px solid white";
          checkbox.nextElementSibling.innerHTML = "Dark mode: On 🌑";
      
      } else {
          
          body.classList.remove("dark");

          tarjetas.forEach((tarjeta) => {
            tarjeta.classList.remove("tarjetaBorderWhite");
          });

          checkbox.nextElementSibling.style.border = "1px solid black";
          checkbox.nextElementSibling.innerHTML = "Dark mode: Off ☀";

      }
  });

};
