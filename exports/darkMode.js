export const toggleDarkMode = () => {
    const checkbox = document.getElementById("checkbox");
    const body = document.querySelector("body");

    checkbox.addEventListener("change", () => {

        if (checkbox.checked) {

            body.classList.add("dark");

            checkbox.nextElementSibling.style.border = "1px solid white";
            checkbox.nextElementSibling.innerHTML = "Dark mode: On 🌑";

        } else {

            body.classList.remove("dark");

            checkbox.nextElementSibling.style.border = "1px solid black";
            checkbox.nextElementSibling.innerHTML = "Dark mode: Off ☀";

        }
    });
};
