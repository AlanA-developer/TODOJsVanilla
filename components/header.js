import { app } from '../exports/exportApp.js';

const headerTemplate = `
        <h1 class="titulo">Proyecto TODO JavaScript Vanilla</h1>
        <h3 class="titulo_nombre">Alan Diaz</h3>
`;

const headerComponent = document.createElement('header');
headerComponent.classList.add('seccion_header');
headerComponent.innerHTML = headerTemplate;

export const appendHeader = () => {
    app.appendChild(headerComponent);
};