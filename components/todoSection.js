//Importamos la etiqueta app que es donde se va a montar nuestra app
import { app } from '../exports/exportApp.js';

//Creamos el template de los inputs de la sección de inputs
const todoSectionTemplate = `
        <input type="text" id="input_tareas" class="input" placeholder="Escribe el título de tu tarea a agregar">
        <input type="text" id="input_materia" class="input" placeholder="Escribe la materia de tu tarea a agregar">
        <input type="text" id="input_descripcion" class="input" placeholder="Escribe la descripción de tu tarea a agregar">
`;

//Creamos una seccion para los inputs
const todoSectionComponent = document.createElement('section');

//Agregamos una clase para estilos y propiedades
todoSectionComponent.classList.add('seccion_todo');

//Agregamos un id a la sección para identificarla
todoSectionComponent.id = 'seccion_todo';

//Agregamos el html a la sección
todoSectionComponent.innerHTML = todoSectionTemplate;


//Exportamos la función para agregar la sección de inputs
export const appendTodoInputsSection = () => {
    app.appendChild(todoSectionComponent);
};