//Importamos la función para detectar la tecla enter
import { detectEnterToAddTask } from "./exportDetectEnterToAddTask.js";

//Exportamos la función para agregar la función de agregar tareas
export const agregarTareas = () => {
  //Localizamos el input de descripción de la tarea y la guardamos en una variable
  const input_descripcion = document.getElementById("input_descripcion");

  //Agregamos el evento para que detecte cuando se levanta una tecla en el input de descripción
  input_descripcion.addEventListener("keypress", (event) => {

    //Si se levanta la tecla enter se agrega la tarea
    detectEnterToAddTask(event);
  });
};
