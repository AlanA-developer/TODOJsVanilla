import { app } from '../exports/exportApp.js';

const taskListComponent = document.createElement('div');
taskListComponent.classList.add('lista_tareas');
taskListComponent.id = 'lista_tareas';

export const appendTaskList = () => {
    app.appendChild(taskListComponent);
};