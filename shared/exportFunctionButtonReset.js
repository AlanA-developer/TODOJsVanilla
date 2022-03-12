// Creamos y exportamos la función para quitar la clase eliminado a la tarea
export const resetCard = function () {
  // Agregamos un setTimeout para que la clase eliminado se agregue después de que se haya ejecutado las funciones anteriores
  setTimeout(() => {
    // Localizamos todos los botones de reset y guardamos en una variable
    const buttonReset = document.querySelectorAll('#buttonReset')

    buttonReset.forEach((element) => {
      // Detectamos el click sobre cada botón de reset
      element.addEventListener('click', (e) => {
        for (let i = 1; i < 10; i += 4) {
          e.target.parentNode.parentNode.childNodes[i].style.transition = '300ms'
          e.target.parentNode.parentNode.childNodes[i].classList.remove('eliminado')
        }
      })
    })
  }, 5)
}
