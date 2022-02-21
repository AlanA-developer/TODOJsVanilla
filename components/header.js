//Importamos el id de la etiqueta donde se va a montar nuestra app
import { app } from '../shared/exportApp.js';

//Importamos la función del toggle para activar el darkmode
import { toggleDarkMode } from '../shared/darkMode.js';

//Importamos la funcion de eliminar tarea
import { deleteTask } from '../shared/exportFunctionButtonDelete.js';

//Importamos la funcion para resetear la clase eliminado
import { resetCard } from '../shared/exportFunctionButtonReset.js';

//Importamos la funcion para abrir el modal de edición
import { buttonEdit } from '../shared/exportFunctionButtonEdit.js';

//Importamos la funcion de importancia de las tareas
import { functionImportanceTask } from '../shared/exportFunctionImportanceTask.js';

//Creamos el template del header
export const headerTemplate = `
        <h1 class="titulo">Proyecto TODO JavaScript Vanilla</h1>
        <h3 class="titulo_nombre">
            Alan Diaz
            <input type="checkbox" class="checkbox" id="checkbox">
            <label for="checkbox" class="checkbox-label">Dark mode: Off  ☀</label>
            <button class="btnCard" id="buttonSave">Guardar las tareas</button>
            <button class="btnCard" id="buttonLoad">Cargar las tareas</button>
        </h3>
`;

function detectButtonHeaderSave() {
    const button = document.getElementById('buttonSave');
    button.addEventListener('click', () => {
        //Guardamos todo el contenido del body en localStorage
        localStorage.setItem('tareas', document.body.childNodes[1].childNodes[5].innerHTML);
    });
}

function detectButtonHeaderLoad() {
    const button = document.getElementById('buttonLoad');
    button.addEventListener('click', () => {
        //Cargamos todo el contenido del body en localStorage
        document.body.childNodes[1].childNodes[5].innerHTML = localStorage.getItem('tareas');
        deleteTask();
        resetCard();
        buttonEdit();
        functionImportanceTask();
    });
}

//Creamos nuestro elemento header
const headerComponent = document.createElement('header');

//Le agregamos la clase para estilos y propiedades al header
headerComponent.classList.add('seccion_header');

//Le agregamos el html al header
headerComponent.innerHTML = headerTemplate;

//Exportamos la función para agregar el header
export const appendHeader = () => {
    //Montamos el header en la etiqueta app
    app.appendChild(headerComponent);

    //Agregamos las funciones al toggle dark mode
    toggleDarkMode();
    detectButtonHeaderSave();
    detectButtonHeaderLoad();
};