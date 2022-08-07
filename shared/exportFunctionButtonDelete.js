// Creamos y exportamos la función para agregar la clase eliminado a la tarea
export const deleteTask = () => {
  // Agregamos un setTimeout para que la clase eliminado se agregue después de que se haya ejecutado las funciones anteriores
  setTimeout(() => {
    // Localizamos todos los botones de eliminar y guardamos en una variable
    const buttonDelete = document.querySelectorAll('#buttonDelete')

    buttonDelete.forEach((element, index) => {
      // Detectamos el click sobre cada botón de eliminar
      element.addEventListener('click', (e) => {
        for (const childNode of e.target.parentNode.parentNode.childNodes) {

          if (
              childNode == e.target.parentNode.parentNode.childNodes[1] 
              ||
              childNode == e.target.parentNode.parentNode.childNodes[5] 
              ||
              childNode == e.target.parentNode.parentNode.childNodes[9] 
            ) 
            {
              childNode.style.transition = '300ms';
              childNode.classList.add('eliminado');
            }

        }
      })
    })
  }, 5)
}
