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
        switch (event.target.value) {
          case 'No importante':
            event.target.parentElement.parentElement.style.backgroundColor = 'rgba(25,205,245,0.3)'
            break
          case 'Importante':
            event.target.parentElement.parentElement.style.backgroundColor = 'rgba(255,255,0,0.3)'
            break
          case 'Muy importante':
            event.target.parentElement.parentElement.style.backgroundColor = 'rgba(255,0,0,0.5)'
            break
        }
      })
    }
  }, 5)
}
