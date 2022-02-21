//Importamos la etiqueta app que es donde se va a montar nuestra app
import { app } from '../shared/exportApp.js';

//Creamos el elemento div donde se van a agregar las tareas
const taskListComponent = document.createElement('div');

//Agregamos una clase para estilos y propiedades
taskListComponent.classList.add('lista_tareas');

//Agregamos un id al div para identificarla
taskListComponent.id = 'lista_tareas';


//Exportamos la función para agregar la sección de tareas
export const appendTaskList = () => {
    app.appendChild(taskListComponent);
};