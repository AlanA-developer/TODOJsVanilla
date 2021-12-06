import { app } from '../exports/exportApp.js';
import { toggleDarkMode } from '../exports/darkMode.js';

const headerTemplate = `
        <h1 class="titulo">Proyecto TODO JavaScript Vanilla</h1>
        <h3 class="titulo_nombre">
            Alan Diaz
            <input type="checkbox" class="checkbox" id="checkbox">
            <label for="checkbox" class="checkbox-label">Dark mode: Off  ☀</label>
        </h3>
`;

const headerComponent = document.createElement('header');
headerComponent.classList.add('seccion_header');
headerComponent.innerHTML = headerTemplate;

export const appendHeader = () => {
    app.appendChild(headerComponent);
    toggleDarkMode();
};