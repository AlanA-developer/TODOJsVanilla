import { app } from '../exports/exportApp.js';

const todoSectionTemplate = `
        <input type="text" id="input_tareas" class="input" placeholder="Escribe el título de tu tarea a agregar">
        <input type="text" id="input_materia" class="input" placeholder="Escribe la materia de tu tarea a agregar">
        <input type="text" id="input_descripcion" class="input" placeholder="Escribe la descripción de tu tarea a agregar">
`;

const todoSectionComponent = document.createElement('section');
todoSectionComponent.classList.add('seccion_todo');
todoSectionComponent.id = 'seccion_todo';
todoSectionComponent.innerHTML = todoSectionTemplate;

export const appendTodoSection = () => {
    app.appendChild(todoSectionComponent);
};