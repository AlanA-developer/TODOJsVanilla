//Creamos y exportamos la función para regresar los valores de los inputs a su estado original
export const resetInputs = () => {
  const resetingInputs = [
    document.getElementById("input_tareas"),
    document.getElementById("input_materia"),
    document.getElementById("input_descripcion"),
  ];

  resetingInputs.forEach((input) => {
    input.value = "";
  });
};
