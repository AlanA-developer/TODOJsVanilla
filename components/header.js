//Importamos el id de la etiqueta donde se va a montar nuestra app
import { app } from '../exports/exportApp.js';

//Importamos la función del toggle para activar el darkmode
import { toggleDarkMode } from '../exports/darkMode.js';

//Creamos el template del header
const headerTemplate = `
        <h1 class="titulo">Proyecto TODO JavaScript Vanilla</h1>
        <h3 class="titulo_nombre">
            Alan Diaz
            <input type="checkbox" class="checkbox" id="checkbox">
            <label for="checkbox" class="checkbox-label">Dark mode: Off  ☀</label>
        </h3>
`;

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
};