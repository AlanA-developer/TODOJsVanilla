# Para desarrolladores:

## Estructura del proyecto:

1 - .idea (archivo de configuración de IntelliJ IDEA)

2 - components (
    aquí vas a encontrar las tres partes fundamentales de la aplicación, tales como: 'header.js', 'taskList.js', 'todoSection.js'
)

2.1 - components description = 
- header.js (
    aquí vas a encontrar el código que se encarga de la parte superior de la aplicación, en la que se encuentra el título de la aplicación
)

- taskList.js (
    Aquí se crea y carga el conetendor donde van a estar nuestras tareas
)

- todoSection (
    Aquí se crean todos los inputs para agregar una tarea
)

- node_modules (
    Aquí se encuentran los módulos que se necesitan para que la aplicación funcione
)

- shared (
    Aquí se encuentran todos los pequeños archivos que en conjunto hacen que la aplicación funcione
)

- test (
    Aquí se encuentran los test unitarios que comprueban la ruta crítica de nuestra aplicación
)

## Tecnologías utilizadas:

- HTML
- CSS
- JavaScript
- Jest (para los test unitarios)
- Vite (para contruir el build, lanzar el servidor local y poder tener una preview)
- eslint (para la linting de mi código)

## Para instalar las dependencias:
- npm install

## Para correr un servidor local:
- npm run serve

## Para contruir el build:
- npm run build

## Para lanzar una preview:
- npm run preview

## Para correr el test unitario:
- npm run test