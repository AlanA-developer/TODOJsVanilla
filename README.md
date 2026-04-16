# 🌌 ZENIT: Elite Task Manager

**ZENIT** es un gestor de misiones de alto rendimiento con una estética "Futuristic Dark Mode". Ha sido diseñado para ofrecer una experiencia visual envidiable combinando la simplicidad de Vanilla JavaScript con la robustez de un backend en Java.

![Preview](https://via.placeholder.com/800x400.png?text=Zenit+Elite+Task+Manager+Preview)

## 🚀 Características Principales

- **Dashboard SaaS Style**: Interfaz moderna basada en paneles y micro-animaciones.
- **Fullstack Real**: Persistence permanente mediante una base de datos SQLite gestionada por un servidor Java.
- **Glassmorphism 2.0**: Efectos de cristal esmerilado y gradientes de malla dinámicos.
- **Estadísticas en Vivo**: Seguimiento de tu productividad directamente en el Sidebar.
- **Prioridad Crítica**: Etiquetas de misión para gestionar la importancia de cada tarea.

## 🛠️ Stack Tecnológico

- **Frontend**: Vanilla JavaScript (ES6+), CSS3 Moderno (Custom Properties, Grid, Flexbox).
- **Backend**: Java 21 (Servidor HTTP Nativo).
- **Base de Datos**: SQLite (Relacional).
- **Librerías**: GSON (JSON handling), SQLite-JDBC (Driver).

---

## 🏁 Instrucciones de Instalación

### 1. Requisitos Previos

- Tener instalado **Java 21** o superior.
- Un navegador moderno (Chrome, Edge, Firefox).

### 2. Levantar el Backend

Para que la aplicación funcione, el servidor Java debe estar activo para gestionar la base de datos:

1. Abre una terminal en la carpeta raíz del proyecto.
2. Ejecuta el siguiente comando:
   ```bash
   java -cp "backend/lib/*;." backend.TodoServer
   ```
3. Verás el mensaje: `Servidor iniciado en http://localhost:8080`. **No cierres esta terminal.**

### 3. Ejecutar el Frontend

Como el frontend es Vanilla JS, solo necesitas servir los archivos estáticos:

- Puedes abrir directamente el archivo `index.html` en tu navegador.
- O usar extensiones como **Live Server** (VS Code) para una mejor experiencia.

---

## 📂 Estructura del Proyecto

```text
├── backend/            # Servidor Java y Base de Datos solo
│   ├── lib/            # Dependencias externas (GSON, SQLite)
│   ├── todo.db         # Base de Datos (Generada automáticamente)
│   └── TodoServer.java # Código fuente del servidor
├── components/         # Componentes modulares de UI
├── src/                # Archivos principales de la aplicación
│   ├── main.js         # Orquestador del Dashboard
│   └── style.css       # Sistema de diseño y Mesh Gradients
├── shared/             # Lógica de estado y utilidades
└── index.html          # Punto de entrada de la aplicación
```

## 🔒 Seguridad

Los archivos de base de datos (`.db`) están excluidos del control de versiones mediante `.gitignore` para proteger la privacidad de tus misiones locales.

---

**Desarrollado con ❤️ por el Alana-Dveloper.**
