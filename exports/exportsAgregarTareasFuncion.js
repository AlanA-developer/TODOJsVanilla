import { addElemento } from "../exports/exportAddTask.js";
export let contador = 0;

export const agregarTareas = () => {
    const input_descripcion = document.getElementById("input_descripcion");
    input_descripcion.addEventListener("keypress", (event) => {
      if (event.keyCode === 13) {
        const valorTareaInput = document.getElementById("input_tareas");
        let contenidoInput = valorTareaInput.value;
        if (contenidoInput === "") {
          alert("No puedes agregar una tarea vacía");
        } else {
          contador++;
          addElemento(contenidoInput);
        }
        valorTareaInput.value = "";
        document.getElementById("input_materia").value = "";
        document.getElementById("input_descripcion").value = "";
      }
    });
  };