// Creamos y exportamos la función para cerrar decidir la importancia de la tarea
export const functionImportanceTask = () => {
  // Usamos un setTimeout para que se ejecute después de que se haya ejecutado las funciones anteriores
  setTimeout(() => {
    // Localizamos todos los selectores y guardamos en una variable
    const menusValue = document.querySelectorAll('#menuSelect')

    // Recorremos los selectores
    for (let i = 0; i < menusValue.length; i++) {
      // Detectamos el click sobre cada selector seleccionado
      menusValue[i].addEventListener('change', event => {
        // Localizamos el elemento seleccionado y le aplicamos el estilo correspondiente
        if (event.target.value === 'No importante') {
          event.target.parentElement.parentElement.style.backgroundColor = 'rgba(25,205,245,0.3)'
        }

        if (event.target.value === 'Importante') {
          event.target.parentElement.parentElement.style.backgroundColor = 'rgba(248,60,114,0.3)'
        }

        if (event.target.value === 'Muy importante') {
          event.target.parentElement.parentElement.style.backgroundColor = 'rgba(246,31,31,0.5)'
        }
      })
    }
  }, 5)
}
