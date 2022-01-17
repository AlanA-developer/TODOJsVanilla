//Creamos y exportamos la función para regresar los valores de los inputs a su estado original
export const resetInputs = () => {
    //Localizamos todos los inputs y los regresamos a su estado original
    document.getElementById("input_tareas").value = "";
    document.getElementById("input_materia").value = "";
    document.getElementById("input_descripcion").value = "";
  };